const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const Sockets = require("./sockets");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // HTTP Server
    this.server = http.createServer(this.app);

    // Configuraciones de sockets
    this.io = socketio(this.server, {
      cors: {
        origin: "*",
      },
    });

    this.sockets = new Sockets(this.io);
  }

  middlewares() {
    // Desplegar el directorio publico
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    this.app.use(cors());
    this.app.get("/last", (req, res) => {
      res.json({
        ok: true,
        last: this.sockets.ticketList.last13,
      });
    });
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    this.server.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
