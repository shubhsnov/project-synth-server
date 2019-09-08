import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'colyseus';

// Import demo room handlers
import { JudgementRoom } from "./src/room";

const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();

app.use(cors());
app.use(express.json());

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app),
  express: app,
});

// Register the game room as "judgement"
gameServer.define("judgement", JudgementRoom);

// Register ChatRoom with initial options, as "chat_with_options"
// onInit(options) will receive client join options + options registered here.
// gameServer.define("chat_with_options", ChatRoom, {
//     custom_options: "you can use me on Room#onCreate"
// });
app.use('/', express.static(__dirname+"/static"));

// (optional) attach web monitoring panel
// app.use('/colyseus', monitor(gameServer));

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

gameServer.listen(port);

// process.on("uncaughtException", (e) => {
//   console.log(e.stack);
//   process.exit(1);
// });

console.log(`Listening on http://localhost:${ port }`);
