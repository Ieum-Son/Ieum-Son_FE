import { createStudySocket, type StudySocket } from "@/apis/studySocket";
import type {
  HolisticFrame,
  ResultMessage,
  SessionMessage,
} from "@/apis/studySocket/type";
import { useCallback, useEffect, useRef, useState } from "react";

export type StudySocketStatus =
  "idle" | "connecting" | "ready" | "scoring" | "closed";

const CONNECT_TIMEOUT_MS = 10_000;
const SCORING_TIMEOUT_MS = 15_000;
const RETRY_DELAYS_MS = [1_000, 3_000, 5_000];

interface UseStudySocketProps {
  ticket?: string;
  onTicketExpired?: () => void;
}

type Timer = ReturnType<typeof setTimeout>;

export const useStudySocket = ({
  ticket,
  onTicketExpired,
}: UseStudySocketProps) => {
  const socketRef = useRef<StudySocket | null>(null);
  const ticketExpiredRef = useRef(onTicketExpired);
  const retryCountRef = useRef(0);
  const isTeardownRef = useRef(false);
  const connectTimerRef = useRef<Timer | null>(null);
  const scoringTimerRef = useRef<Timer | null>(null);
  const reconnectTimerRef = useRef<Timer | null>(null);

  const [reconnectKey, setReconnectKey] = useState(0);
  const [status, setStatus] = useState<StudySocketStatus>("idle");
  const [session, setSession] = useState<SessionMessage | null>(null);
  const [result, setResult] = useState<ResultMessage | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  ticketExpiredRef.current = onTicketExpired;

  const clearTimer = (timerRef: React.RefObject<Timer | null>) => {
    if (!timerRef.current) return;

    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    retryCountRef.current = 0;
  }, [ticket]);

  useEffect(() => {
    if (!ticket) return;

    isTeardownRef.current = false;
    setStatus("connecting");
    setErrorMessage("");
    setResult(null);

    const socket = createStudySocket(ticket, {
      onSession: (nextSession) => {
        clearTimer(connectTimerRef);
        retryCountRef.current = 0;
        setSession(nextSession);
        setStatus("ready");
      },

      onResult: (nextResult) => {
        clearTimer(scoringTimerRef);
        setResult(nextResult);
        setStatus("ready");
      },

      onError: (socketError) => {
        clearTimer(connectTimerRef);
        clearTimer(scoringTimerRef);
        setErrorMessage(socketError.message);

        if (socketError.code === "INVALID_TICKET") {
          retryCountRef.current = RETRY_DELAYS_MS.length;
          ticketExpiredRef.current?.();
          return;
        }

        setStatus("ready");
      },

      onClose: () => {
        clearTimer(connectTimerRef);
        clearTimer(scoringTimerRef);
        setSession(null);

        if (isTeardownRef.current) return;

        const delay = RETRY_DELAYS_MS[retryCountRef.current];

        if (delay === undefined) {
          setStatus("closed");
          return;
        }

        retryCountRef.current += 1;
        setStatus("connecting");
        reconnectTimerRef.current = setTimeout(
          () => setReconnectKey((key) => key + 1),
          delay,
        );
      },
    });

    socketRef.current = socket;
    connectTimerRef.current = setTimeout(() => {
      setErrorMessage("수어 인식 서버 연결이 지연되고 있어요.");
      socket.close();
    }, CONNECT_TIMEOUT_MS);

    return () => {
      isTeardownRef.current = true;
      clearTimer(connectTimerRef);
      clearTimer(scoringTimerRef);
      clearTimer(reconnectTimerRef);
      socketRef.current = null;
      socket.close();
    };
  }, [ticket, reconnectKey]);

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

    scoringTimerRef.current = setTimeout(() => {
      setErrorMessage("인식 결과를 받지 못했어요. 다시 시도해주세요.");
      setStatus("ready");
    }, SCORING_TIMEOUT_MS);

    return true;
  }, []);

  return { status, session, result, errorMessage, sendAttempt };
};
