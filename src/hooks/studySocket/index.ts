import { createStudySocket, type StudySocket } from "@/apis/studySocket";
import type {
  HolisticFrame,
  ResultMessage,
  SessionMessage,
  SocketErrorMessage,
} from "@/apis/studySocket/type";
import { useCallback, useEffect, useRef, useState } from "react";

export type StudySocketStatus =
  "idle" | "connecting" | "ready" | "scoring" | "closed";

interface UseStudySocketProps {
  ticket?: string;
  onTicketExpired?: () => void;
}

const isTicketError = (error: SocketErrorMessage) =>
  error.code === "INVALID_TICKET";

export const useStudySocket = ({
  ticket,
  onTicketExpired,
}: UseStudySocketProps) => {
  const socketRef = useRef<StudySocket | null>(null);
  const ticketExpiredRef = useRef(onTicketExpired);
  const [status, setStatus] = useState<StudySocketStatus>("idle");
  const [session, setSession] = useState<SessionMessage | null>(null);
  const [result, setResult] = useState<ResultMessage | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  ticketExpiredRef.current = onTicketExpired;

  useEffect(() => {
    if (!ticket) return;

    setStatus("connecting");
    setErrorMessage("");
    setResult(null);

    const socket = createStudySocket(ticket, {
      onSession: (nextSession) => {
        setSession(nextSession);
        setStatus("ready");
      },

      onResult: (nextResult) => {
        setResult(nextResult);
        setStatus("ready");
      },

      onError: (socketError) => {
        setErrorMessage(socketError.message);
        setStatus("ready");

        if (isTicketError(socketError)) {
          ticketExpiredRef.current?.();
        }
      },

      onClose: () => {
        setStatus("closed");
        setSession(null);
      },
    });

    socketRef.current = socket;

    return () => {
      socketRef.current = null;
      socket.close();
    };
  }, [ticket]);

  const sendAttempt = useCallback((frames: HolisticFrame[]) => {
    if (frames.length === 0) {
      setErrorMessage("인식할 동작이 없습니다. 다시 시도해주세요.");
      return false;
    }

    const sent = socketRef.current?.sendAttempt(frames) ?? false;

    if (!sent) {
      setErrorMessage("수어 인식 서버와 연결되어 있지 않습니다.");
      return false;
    }

    setErrorMessage("");
    setResult(null);
    setStatus("scoring");
    return true;
  }, []);

  return { status, session, result, errorMessage, sendAttempt };
};
