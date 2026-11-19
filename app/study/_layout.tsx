import { StudySocketProvider } from "@/contexts/StudySocketContext";
import { Stack } from "expo-router";

export default function StudyLayout() {
  return (
    <StudySocketProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      />
    </StudySocketProvider>
  );
}
