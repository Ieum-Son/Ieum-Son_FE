import type {
  AttemptMessage,
  HolisticFrame,
  ResultMessage,
  ServerMessage,
  SessionMessage,
  SocketErrorMessage,
} from "./type";

const WS_URL = process.env.EXPO_PUBLIC_STUDY_WS_URL;

interface StudySocketHandlers {
  onSession: (session: SessionMessage) => void;
  onResult: (result: ResultMessage) => void;
  onError: (error: SocketErrorMessage) => void;
  onClose: (reason: string | null) => void;
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

  const socket = new WebSocket(WS_URL);
  let isAuthenticated = false;
  let isClosed = false;

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "auth", ticket }));
  };

  socket.onmessage = (event) => {
    const message = parseMessage(event.data);

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
    handlers.onError({
      type: "error",
      code: "CONNECTION_FAILED",
      message: "수어 인식 서버에 연결하지 못했습니다.",
    });
  };

  socket.onclose = (event) => {
    isClosed = true;
    handlers.onClose(event.reason || null);
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

      socket.send(JSON.stringify(message));
      return true;
    },

    close: () => {
      isClosed = true;
      socket.close();
    },
  };
};
