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
/** 티켓이 만료되기 이만큼 전에 미리 갱신한다. */
const TICKET_REFRESH_MARGIN_MS = 30_000;
/**
 * 이미 지난 티켓을 받아서 곧바로 다시 요청하는 횟수의 상한.
 *
 * 서버 시각과 기기 시각이 어긋나 있으면(예: 오프셋 없는 시간 문자열)
 * 새로 받아도 계속 지난 값이 온다. 막지 않으면 티켓 요청과 재연결이
 * 끝없이 반복되고, 안내 문구가 "연결하는 중"과 "준비됨" 사이를 깜빡인다.
 */
const MAX_IMMEDIATE_TICKET_REFRESHES = 1;

interface UseStudySocketProps {
  ticket?: string;
  /** daily 응답의 expiresAt. 지나면 서버가 소켓을 닫는다. */
  expiresAt?: string;
  onTicketExpired?: () => void;
}

type Timer = ReturnType<typeof setTimeout>;

export const useStudySocket = ({
  ticket,
  expiresAt,
  onTicketExpired,
}: UseStudySocketProps) => {
  const socketRef = useRef<StudySocket | null>(null);
  const ticketExpiredRef = useRef(onTicketExpired);
  const retryCountRef = useRef(0);
  const connectTimerRef = useRef<Timer | null>(null);
  const scoringTimerRef = useRef<Timer | null>(null);
  const reconnectTimerRef = useRef<Timer | null>(null);

  /**
   * 티켓은 연결을 열 때 auth에 한 번만 쓰인다.
   *
   * daily 쿼리는 화면에 들어올 때마다 새로 받아오고 서버는 그때마다 다른
   * 티켓을 준다. 그 값을 의존성으로 두면 멀쩡한 연결을 끊고 다시 붙어서
   * 안내 문구가 "연결하는 중"과 "준비됨" 사이를 깜빡이고, 그때마다
   * result까지 비워져 맞힌 표시가 사라진다.
   * 그래서 바뀐 티켓은 다음에 열 때 쓰도록 여기 담아만 둔다.
   */
  const ticketRef = useRef(ticket);
  /** 지금 열어 둔 연결이 있는지. 새 티켓이 왔을 때 다시 붙을지 가른다. */
  const isConnectedRef = useRef(false);
  /** 이미 지난 티켓을 받아 곧바로 다시 요청한 횟수 */
  const immediateRefreshCountRef = useRef(0);

  const [connectKey, setConnectKey] = useState(0);
  const [status, setStatus] = useState<StudySocketStatus>("idle");
  const [session, setSession] = useState<SessionMessage | null>(null);
  const [result, setResult] = useState<ResultMessage | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  ticketExpiredRef.current = onTicketExpired;
  ticketRef.current = ticket;

  const clearTimer = (timerRef: React.RefObject<Timer | null>) => {
    if (!timerRef.current) return;

    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    retryCountRef.current = 0;
  }, [ticket]);

  // 끊겨 있을 때 티켓이 오면 그때 연결을 연다.
  // 붙어 있는 동안 티켓이 바뀌어도 그냥 둔다. 지금 연결에는 쓸 일이 없다.
  useEffect(() => {
    if (!ticket || isConnectedRef.current) return;

    setConnectKey((key) => key + 1);
  }, [ticket]);

  // 만료되고 나서 INVALID_TICKET을 받으면 이미 한 번 헛되이 찍은 뒤다.
  // 끊기기 전에 미리 새 티켓을 받아 둔다.
  useEffect(() => {
    if (!expiresAt) return;

    const expiresAtMs = new Date(expiresAt).getTime();

    if (Number.isNaN(expiresAtMs)) return;

    const remainingMs = expiresAtMs - Date.now();

    // 이미 지난 티켓은 정해진 횟수만 다시 받는다.
    // 받아올 때마다 expiresAt이 달라지므로 값으로는 반복을 막을 수 없다.
    if (remainingMs <= 0) {
      if (immediateRefreshCountRef.current >= MAX_IMMEDIATE_TICKET_REFRESHES) {
        return;
      }

      immediateRefreshCountRef.current += 1;
      ticketExpiredRef.current?.();
      return;
    }

    // 앞으로 남은 티켓을 받았으면 막아 둔 횟수를 되돌린다.
    immediateRefreshCountRef.current = 0;

    // 티켓 수명이 여유분보다 짧으면 여유분을 빼는 순간 즉시 갱신이 된다.
    // 그러면 갱신이 또 만료된 티켓을 불러와 끝없이 반복되므로,
    // 그만큼 짧을 때는 남은 시간의 절반에서 미리 받는다.
    const refreshAfterMs =
      remainingMs > TICKET_REFRESH_MARGIN_MS * 2
        ? remainingMs - TICKET_REFRESH_MARGIN_MS
        : remainingMs / 2;

    const timer = setTimeout(
      () => ticketExpiredRef.current?.(),
      refreshAfterMs,
    );

    return () => clearTimeout(timer);
  }, [expiresAt]);

  useEffect(() => {
    // 끊긴 뒤 다시 열 때는 그동안 받아 둔 가장 새 티켓을 쓴다.
    const currentTicket = ticketRef.current;

    if (!currentTicket) return;

    /**
     * 이 연결에만 걸리는 깃발.
     *
     * 공용 ref로 두면 안 된다. close()는 onclose를 비동기로 부르는데,
     * 그 사이에 다음 연결이 ref를 false로 되돌려 놓는다. 그러면 버린 소켓의
     * onclose가 "예상치 못한 끊김"으로 읽혀 재연결이 한 번 더 예약되고,
     * 그 겹친 연결이 서로를 닫으면서 끊김이 계속 늘어난다.
     */
    let isTornDown = false;

    isConnectedRef.current = true;
    setStatus("connecting");
    setErrorMessage("");
    setResult(null);

    let socket: StudySocket;

    try {
      socket = createStudySocket(currentTicket, {
        onSession: (nextSession) => {
          if (isTornDown) return;

          clearTimer(connectTimerRef);
          retryCountRef.current = 0;
          setSession(nextSession);
          setStatus("ready");
        },

        onResult: (nextResult) => {
          if (isTornDown) return;

          clearTimer(scoringTimerRef);
          setResult(nextResult);
          setStatus("ready");
        },

        onError: (socketError) => {
          if (isTornDown) return;

          clearTimer(connectTimerRef);
          clearTimer(scoringTimerRef);
          setErrorMessage(socketError.message);

          if (socketError.code === "INVALID_TICKET") {
            retryCountRef.current = RETRY_DELAYS_MS.length;
            ticketExpiredRef.current?.();
            return;
          }

          // 연결 자체가 실패한 경우는 준비 상태가 아니다.
          // 곧 onClose가 따라오므로 재연결 판단은 거기에 맡긴다.
          if (socketError.code === "CONNECTION_FAILED") return;

          setStatus("ready");
        },

        onClose: ({ code }) => {
          clearTimer(connectTimerRef);
          clearTimer(scoringTimerRef);

          // 우리가 닫은 소켓이면 여기서 끝낸다.
          // 상태를 건드리면 이미 열린 다음 연결의 상태를 덮어쓴다.
          if (isTornDown) return;

          // 끊겼으니 새 티켓이 오면 다시 붙어야 한다.
          isConnectedRef.current = false;
          setSession(null);

          const delay = RETRY_DELAYS_MS[retryCountRef.current];

          if (delay === undefined) {
            // 1009는 onError에서 이미 따로 알려 줬다.
            if (code !== 1009) {
              setErrorMessage(
                `연결이 끊겼어요. 화면을 다시 열어주세요. (code: ${code})`,
              );
            }

            setStatus("closed");
            return;
          }

          retryCountRef.current += 1;
          setStatus("connecting");
          reconnectTimerRef.current = setTimeout(
            () => setConnectKey((key) => key + 1),
            delay,
          );
        },
      });
    } catch (error) {
      // 환경변수 누락 등으로 소켓을 만들지 못하면 화면만 막고 끝낸다.
      console.error(error);
      isConnectedRef.current = false;
      setErrorMessage("수어 인식 서버에 연결할 수 없습니다.");
      setStatus("closed");
      return;
    }

    socketRef.current = socket;
    connectTimerRef.current = setTimeout(() => {
      setErrorMessage("수어 인식 서버 연결이 지연되고 있어요.");
      socket.close();
    }, CONNECT_TIMEOUT_MS);

    return () => {
      isTornDown = true;
      isConnectedRef.current = false;
      clearTimer(connectTimerRef);
      clearTimer(scoringTimerRef);
      clearTimer(reconnectTimerRef);
      socketRef.current = null;
      socket.close();
    };
  }, [connectKey]);

  const sendAttempt = useCallback((frames: HolisticFrame[]) => {
    // 타이머가 살아 있으면 아직 채점 중이다. 겹쳐 보내면 이전 타이머가
    // 남아 엉뚱한 시점에 실패 문구가 뜬다.
    if (scoringTimerRef.current) return false;

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

    clearTimer(scoringTimerRef);
    scoringTimerRef.current = setTimeout(() => {
      setErrorMessage("인식 결과를 받지 못했어요. 다시 시도해주세요.");
      setStatus("ready");
    }, SCORING_TIMEOUT_MS);

    return true;
  }, []);

  return { status, session, result, errorMessage, sendAttempt };
};
