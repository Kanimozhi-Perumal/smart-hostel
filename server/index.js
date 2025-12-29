const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("🔌 Socket connected:", socket.id);
});

app.set("io", io);

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
