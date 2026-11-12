import type {
  AttemptMessage,
  HolisticFrame,
  ResultMessage,
  ServerMessage,
  SessionMessage,
  SocketErrorMessage,
} from "./type";

const WS_URL = process.env.EXPO_PUBLIC_STUDY_WS_URL;

export interface StudySocketClose {
  /** WebSocket close code. 1000이면 정상 종료다. */
  code: number;
  reason: string | null;
}

interface StudySocketHandlers {
  onSession: (session: SessionMessage) => void;
  onResult: (result: ResultMessage) => void;
  onError: (error: SocketErrorMessage) => void;
  onClose: (close: StudySocketClose) => void;
}

export interface StudySocket {
  sendAttempt: (frames: HolisticFrame[]) => boolean;
  close: () => void;
}

const parseMessage = (raw: unknown): ServerMessage | null => {
  if (typeof raw !== "string") return null;

  try {
    const parsed = JSON.parse(raw);

    return typeof parsed?.type === "string" ? (parsed as ServerMessage) : null;
  } catch {
    return null;
  }
};

export const createStudySocket = (
  ticket: string,
  handlers: StudySocketHandlers,
): StudySocket => {
  if (!WS_URL) {
    throw new Error("EXPO_PUBLIC_STUDY_WS_URL 환경변수가 설정되지 않았습니다.");
  }

  // TODO(임시): 소켓 통신 확인용 로그. 확인이 끝나면 제거할 것.
  const socketLog = (...args: unknown[]) => {
    if (__DEV__) console.log("[임시][socket]", ...args);
  };

  socketLog("연결 시도:", WS_URL);

  const socket = new WebSocket(WS_URL);
  let isAuthenticated = false;
  let isClosed = false;

  socket.onopen = () => {
    socketLog("열림. auth 전송, ticket 길이:", ticket.length);
    socket.send(JSON.stringify({ type: "auth", ticket }));
  };

  socket.onmessage = (event) => {
    const message = parseMessage(event.data);

    socketLog("수신:", message ?? event.data);

    if (!message) return;

    if (message.type === "session") {
      isAuthenticated = true;
      handlers.onSession(message);
      return;
    }

    if (message.type === "result") {
      handlers.onResult(message);
      return;
    }

    if (message.type === "error") {
      handlers.onError(message);
    }
  };

  socket.onerror = () => {
    socketLog("연결 오류");
    handlers.onError({
      type: "error",
      code: "CONNECTION_FAILED",
      message: "수어 인식 서버에 연결하지 못했습니다.",
    });
  };

  socket.onclose = (event) => {
    isClosed = true;
    socketLog("닫힘. code:", event.code, "reason:", event.reason || "(없음)");

    // 1009는 메시지가 서버 한도(16MB)를 넘은 경우다.
    // 에러 JSON 없이 바로 닫히므로 여기서 구분해 알린다.
    if (event.code === 1009) {
      handlers.onError({
        type: "error",
        code: "MESSAGE_TOO_BIG",
        message: "동작이 너무 길어요. 조금 짧게 다시 찍어주세요.",
      });
    }

    handlers.onClose({ code: event.code, reason: event.reason || null });
  };

  return {
    sendAttempt: (frames) => {
      if (
        isClosed ||
        !isAuthenticated ||
        socket.readyState !== WebSocket.OPEN
      ) {
        return false;
      }

      const message: AttemptMessage = { type: "attempt", frames };
      const payload = JSON.stringify(message);

      socketLog(
        `attempt 전송: ${frames.length}장, ${Math.round(payload.length / 1024)}KB`,
      );
      socket.send(payload);
      return true;
    },

    close: () => {
      isClosed = true;
      socket.close();
    },
  };
};
