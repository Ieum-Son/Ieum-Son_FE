import { useDailyProgress } from "@/hooks/progress";
import { useStudySocket } from "@/hooks/studySocket";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type StudySocketValue = ReturnType<typeof useStudySocket> & {
  /** 카메라가 필요한 화면에서 호출한다. 한 번 켜지면 레이아웃이 사라질 때까지 유지된다. */
  activate: () => void;
};

const StudySocketContext = createContext<StudySocketValue | null>(null);

export function StudySocketProvider({ children }: PropsWithChildren) {
  const { data: daily, refetch } = useDailyProgress();
  // study 아래에는 소켓이 필요 없는 화면(StudyComplete, Lesson 등)도 있다.
  // 카메라 화면이 처음 열릴 때만 연결하도록 늦게 켠다.
  const [isActivated, setIsActivated] = useState(false);

  const socket = useStudySocket({
    ticket: isActivated ? daily?.sessionTicket : undefined,
    expiresAt: isActivated ? daily?.expiresAt : undefined,
    onTicketExpired: () => {
      void refetch();
    },
  });

  const activate = useCallback(() => setIsActivated(true), []);

  return (
    <StudySocketContext.Provider value={{ ...socket, activate }}>
      {children}
    </StudySocketContext.Provider>
  );
}

export const useStudySocketContext = () => {
  const context = useContext(StudySocketContext);

  if (!context) {
    throw new Error(
      "useStudySocketContext는 StudySocketProvider 안에서만 사용할 수 있습니다.",
    );
  }

  return context;
};
