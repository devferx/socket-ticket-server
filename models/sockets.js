const TicketList = require("./ticket-list");
class Sockets {
  constructor(io) {
    this.io = io;
    this.ticketList = new TicketList();
    this.socketEvents();
  }

  socketEvents() {
    this.io.on("connection", (socket) => {
      console.log("cliente conectado");

      socket.on("get-ticket", (_, callback) => {
        const newTicket = this.ticketList.createTicket();
        callback(newTicket);
      });

      socket.on("next-ticket-to-attend", ({ agent, desk }, cb) => {
        const nextTicket = this.ticketList.assignTicket(agent, desk);
        cb(nextTicket);

        this.io.emit("assigned-tickets", this.ticketList.last13);
      });
    });
  }
}

module.exports = Sockets;
