"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3001 });
let globalState = {
    currentEventId: '1', // Set default event
    events: [
        {
            id: '1',
            title: 'Premier événement',
            questions: [
                { id: 'q1', content: 'Première question ?', votes: 3 },
                { id: 'q2', content: 'Deuxième question ?', votes: 1 }
            ]
        }
    ]
};
// Fonction pour diffuser l'état à tous les clients
const broadcastState = (excludeWs) => {
    wss.clients.forEach(client => {
        if (client !== excludeWs && client.readyState === ws_1.WebSocket.OPEN) {
            try {
                client.send(JSON.stringify({
                    type: 'STATE_UPDATE',
                    payload: globalState
                }));
            }
            catch (error) {
                console.error('Error broadcasting to client:', error);
            }
        }
    });
};
wss.on('connection', (ws) => {
    console.log('New client connected');
    // Envoi de l'état initial
    try {
        ws.send(JSON.stringify({
            type: 'STATE_UPDATE',
            payload: globalState
        }));
    }
    catch (error) {
        console.error('Error sending initial state:', error);
    }
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received message:', data);
            if (data.type === 'UPVOTE_QUESTION') {
                const { eventId, questionId, votes } = data.payload;
                const event = globalState.events.find(e => e.id === eventId);
                if (event) {
                    const question = event.questions.find(q => q.id === questionId);
                    if (question) {
                        question.votes = votes;
                        broadcastState(ws);
                    }
                }
            }
            else if (data.type === 'STATE_UPDATE' && data.payload) {
                // Vérifier si l'état a réellement changé
                if (JSON.stringify(globalState) !== JSON.stringify(data.payload)) {
                    console.log('Updating state:', {
                        oldState: globalState,
                        newState: data.payload
                    });
                    globalState = data.payload;
                    broadcastState(ws);
                }
            }
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
});
console.log('WebSocket server running on ws://localhost:3001');
