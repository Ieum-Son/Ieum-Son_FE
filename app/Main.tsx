import Header from "@/components/header/Header";
import LearningRoadmap from "@/components/main/LearningRoadmap/LearningRoadmap";
import WeekendStrick from "@/components/main/WeekendStrick/WeekendStrick";
import Tab from "@/components/tab/Tab";
import { getStreakErrorMessage, useStreak } from "@/hooks/streak";
import { toLearnedWeekdays } from "@/utils/streak";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Main() {
  const { data: streak, isPending, isError, error } = useStreak();
  const streakCount = streak?.currentStreak ?? 0;
  const learnedDays = toLearnedWeekdays(streak?.week);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
            <Header />
          </View>

          <WeekendStrick
            streakDays={streakCount}
            learnedDays={learnedDays}
            isLoading={isPending}
            errorMessage={isError ? getStreakErrorMessage(error) : null}
          />
          <LearningRoadmap
            onStartLearning={() =>
              router.push({
                pathname: "/study/Study",
                params: { wordIndex: "0" },
              })
            }
          />
        </View>

        <Tab activeTab="home" />
      </SafeAreaView>
    </>
  );
}
