import { io } from "socket.io-client";

// ✅ Remove /api if present
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace("/api", "");

// ✅ Fallback (extra safety)
const SOCKET_URL = BASE_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false, // ✅ manual control (correct)
});

// ✅ Optional debug (very useful in production)
socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;
