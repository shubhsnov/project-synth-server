import { Room } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
export class Player extends Schema {
    constructor() {
        super(...arguments);
        this.player_message = "Hello Message";
        this.player_id = "0";
    }
}

export class State extends Schema {
    constructor() {
        super(...arguments);
        this.players = new MapSchema();
        this.something = "This attribute won't be sent to the client-side";
    }
    createPlayer(id) {
        this.players[id] = new Player();
        this.players[id].player_id = id;
    }
    removePlayer(id) {
        delete this.players[id];
    }
    updatePlayerMessage(id, messageObj) {
        if (messageObj.string) {
            this.players[id].player_message = messageObj.string;
        }
    }
}

export class JudgementRoom extends Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
    }
    onCreate(options) {
        console.log("ChatHandlerRoom created!", options);
        this.setState(new State());
    }
    onJoin(client) {
        this.state.createPlayer(client.sessionId);
    }
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
    onMessage(client, data) {
        console.log("ChatHandlerRoom received message from", client.sessionId, ":", data);
        this.state.updatePlayerMessage(client.sessionId, data);
    }
    onDispose() {
        console.log("Dispose ChatHandlerRoom");
    }
}
