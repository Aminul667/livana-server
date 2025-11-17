// import { Server } from "http";
// import app from "./app";
// import config from "./config";

// const port = config.port || 5000;

// async function main() {
//   const server: Server = app.listen(port, () => {
//     console.log("Server is running on port ", port);
//   });
// }

// main();

import { httpServer } from "./socket";
import config from "./config";

const port = config.port || 5000;

async function main() {
  httpServer.listen(port, () => {
    console.log(`🚀 Server & Socket.IO running on port ${port}`);
  });
}

main();
