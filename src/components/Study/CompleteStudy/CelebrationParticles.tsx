import { colors } from "@/constants/colors";
import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const PARTICLES = [
  { x: 0.08, drift: 26, delay: 0, duration: 1650, rotation: 220, color: colors.primary200 },
  { x: 0.17, drift: -22, delay: 120, duration: 1850, rotation: -260, color: colors.primary300 },
  { x: 0.28, drift: 30, delay: 40, duration: 1750, rotation: 290, color: colors.primary100 },
  { x: 0.39, drift: -28, delay: 210, duration: 1950, rotation: -220, color: colors.primary400 },
  { x: 0.5, drift: 20, delay: 90, duration: 1700, rotation: 260, color: colors.primary200 },
  { x: 0.61, drift: -24, delay: 250, duration: 2050, rotation: -290, color: colors.primary300 },
  { x: 0.72, drift: 28, delay: 150, duration: 1820, rotation: 240, color: colors.primary100 },
  { x: 0.83, drift: -26, delay: 60, duration: 1900, rotation: -250, color: colors.primary400 },
  { x: 0.92, drift: 20, delay: 190, duration: 1680, rotation: 220, color: colors.primary200 },
] as const;

interface ParticleProps {
  left: number;
  drift: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
}

function Particle({
  left,
  drift,
  delay,
  duration,
  rotation,
  color,
}: ParticleProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration }));
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.08, 0.78, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateX: interpolate(progress.value, [0, 0.5, 1], [0, drift * 0.35, drift]),
      },
      { translateY: interpolate(progress.value, [0, 1], [-16, 260]) },
      {
        rotate: `${interpolate(progress.value, [0, 1], [0, rotation])}deg`,
      },
    ],
  }));

  return (
    <Animated.View
      style={[styles.particle, { left, backgroundColor: color }, animatedStyle]}
    />
  );
}

export default function CelebrationParticles() {
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      {PARTICLES.map((particle, index) => (
        <Particle
          key={`${particle.x}-${index}`}
          {...particle}
          left={width * particle.x}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 36,
    right: 0,
    left: 0,
    height: 280,
    overflow: "hidden",
    zIndex: 2,
  },
  particle: {
    position: "absolute",
    top: 0,
    width: 22,
    height: 10,
    borderRadius: 5,
  },
});
