import { io } from "socket.io-client";

// âœ… Remove /api if present
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace("/api", "");

// âœ… Fallback (extra safety)
const SOCKET_URL = BASE_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false, // âœ… manual control (correct)
});

// âœ… Optional debug (very useful in production)
socket.on("connect", () => {
  console.log("ðŸ”Œ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("âŒ Socket disconnected");
});

export default socket;


