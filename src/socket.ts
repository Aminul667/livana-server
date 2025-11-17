import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import app from "./app";
import config from "./config";
import { socketAuth } from "./app/middlewares/socketAuth";

// --- 1️⃣ Create HTTP server using Express app ---
const httpServer = new HttpServer(app);

// --- 2️⃣ Initialize Socket.IO ---
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// --- 3️⃣ Apply JWT auth middleware ---
io.use(socketAuth());

// --- 4️⃣ Track online users: { userId: socketId } ---
const userSocketMap: Record<string, string[]> = {};

// --- 5️⃣ Helper: get socketId of a user (used by REST controllers) ---
export function getReceiverSocketId(userId: string): string | undefined {
  const sockets = userSocketMap[userId];
  if (!sockets || sockets.length === 0) return undefined;
  return sockets[0]; // or emit to all later
}

// --- 6️⃣ Helper: deterministic private room between two users ---
function getPrivateRoomId(userA: string, userB: string): string {
  return [userA, userB].sort().join("_");
}

// --- 7️⃣ Main Socket.IO connection handler ---
io.on("connection", (socket) => {
  const user = socket.data.user;
  if (!user) return;

  // console.log("user", user);

  const userId = user.userId;
  if (!userId) {
    console.error("❌ Socket missing user ID", user);
    return;
  }

  // Initialize if empty
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }

  // Add this socket ID
  userSocketMap[userId].push(socket.id);

  // Join room by userId
  socket.join(userId);

  console.log(`✅ ${user.email} connected (${socket.id})`);
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- On disconnect ---
  socket.on("disconnect", () => {
    console.log(`❌ ${user.email} disconnected (${socket.id})`);
    // Remove this socketId from array
    userSocketMap[userId] = userSocketMap[userId].filter(
      (id) => id !== socket.id
    );

    // If no sockets left for this user, delete entirely
    if (userSocketMap[userId].length === 0) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// --- 8️⃣ Export for use in main server ---
export { httpServer, io };

// const userSocketMap: Record<string, string> = {};

// export function getReceiverSocketId(userId: string) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   const user = socket.data.user;
//   if (!user) return;

//   console.log("A user connected", user.email);

//   const userId = user.userId;
//   if (!userId) {
//     console.error("❌ Socket missing user ID", user);
//     return;
//   }

//   userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", user.email);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, httpServer };
