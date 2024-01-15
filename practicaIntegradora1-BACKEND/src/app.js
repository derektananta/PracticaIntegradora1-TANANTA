import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import { MessageModel } from './models/messages.model.js';
import { router as cartsRouter } from "./routes/carts.router.js"
import { router as productRouter } from "./routes/products.router.js"
import { router as chatRouter } from "./routes/chat.router.js"
import mongoose from "mongoose"

const app = express()

const httpServer = app.listen(8080, () => console.log("Server is running in port 8080"))
const socketServer = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(process.cwd() + "/public"))

app.engine("handlebars", handlebars.engine())
app.set("views", process.cwd() + "/src/views")
app.set("view engine", "handlebars")

mongoose.connect('mongodb+srv://Benjamin:1234@firstcluster.0frk82c.mongodb.net/ecommerce?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
    process.exit(1);
  });

app.use(cartsRouter)
app.use(productRouter)
app.use(chatRouter)

app.get("/", (req, res) => {
  res.render("index", {
    style: "home.css"
  })
})

let messages = []
let users = []
socketServer.on('connection', (socket) => {
  console.log('handshake');

  socket.on('authenticate', (username) => {
    users[socket.id] = username;
    socket.emit('authenticated', username);

    MessageModel.find()
      .then((messages) => {
        socket.emit('messagesLogs', messages);
      })
      .catch((error) => {
        console.error('Error al cargar los mensajes desde la base de datos:', error);
      });

    socket.broadcast.emit('userConnected', username);
  });

  socket.on('message', (data) => {

    const newMessage = new MessageModel({
      user: data.user,
      message: data.message,
    });

    newMessage.save()
      .then(() => {
        console.log('Mensaje guardado con éxito');
      })
      .catch((error) => {
        console.error('Error al guardar el mensaje:', error);
      });

    messages.push(data);
    socketServer.emit('messagesLogs', messages);
  });
});
