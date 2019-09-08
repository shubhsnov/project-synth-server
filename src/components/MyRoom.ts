import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("string")
    player_message = "Hello Message";

    @type("string")
    player_id = "0";
}

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    something = "This attribute won't be sent to the client-side";

    createPlayer (id: string) {
        this.players[ id ] = new Player();
        this.players[ id ].player_id = id;
    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    updatePlayerMessage (id: string, messageObj: any) {
        if (messageObj.string) {
            this.players[ id ].player_message = messageObj.string;
        } 
    }
}

export class JudgementRoom extends Room<State> {
    maxClients = 4;

    onCreate (options: any) {
        console.log("JudgementRoom created!", options);

        this.setState(new State());
    }

    onJoin (client: Client, options: any) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client: Client, consented: boolean) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client: Client, message: any) {
        console.log("JudgementRoom received message from", client.sessionId, ":", message);
        this.state.updatePlayerMessage(client.sessionId, message);
    }

    onDispose () {
        console.log("Dispose JudgementRoom");
    }
}
