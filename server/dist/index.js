"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // URL du client Vite
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use((0, cors_1.default)());
let state = {
    events: []
};
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Envoyer l'état initial au nouveau client
    socket.emit('state', state);
    socket.on('action', (msg) => {
        console.log('Action received from client:', socket.id, msg);
        // Mettre à jour l'état si nécessaire
        switch (msg.type) {
            case 'events/addEvent':
                state.events.push(msg.payload);
                break;
            case 'events/updateEvent':
                const eventIndex = state.events.findIndex(e => e.id === msg.payload.id);
                if (eventIndex !== -1) {
                    state.events[eventIndex] = msg.payload;
                }
                break;
            case 'events/deleteEvent':
                state.events = state.events.filter(e => e.id !== msg.payload);
                break;
            case 'events/addQuestion':
                const { eventId, question } = msg.payload;
                const event = state.events.find(e => e.id === eventId);
                if (event) {
                    event.questions = event.questions || [];
                    event.questions.push(question);
                }
                break;
            case 'events/updateQuestion':
                const { eventId: updateEventId, question: updateQuestion } = msg.payload;
                const updateEvent = state.events.find(e => e.id === updateEventId);
                if (updateEvent) {
                    const questionIndex = updateEvent.questions.findIndex(q => q.id === updateQuestion.id);
                    if (questionIndex !== -1) {
                        updateEvent.questions[questionIndex] = updateQuestion;
                    }
                }
                break;
            case 'events/deleteQuestion':
                const { eventId: deleteEventId, questionId } = msg.payload;
                const deleteEvent = state.events.find(e => e.id === deleteEventId);
                if (deleteEvent) {
                    deleteEvent.questions = deleteEvent.questions.filter(q => q.id !== questionId);
                }
                break;
            case 'events/upvoteQuestion':
                const { eventId: voteEventId, questionId: voteQuestionId } = msg.payload;
                const voteEvent = state.events.find(e => e.id === voteEventId);
                if (voteEvent) {
                    const voteQuestion = voteEvent.questions.find(q => q.id === voteQuestionId);
                    if (voteQuestion) {
                        voteQuestion.votes += 1;
                    }
                }
                break;
        }
        // Envoyer l'action à tous les clients sauf l'émetteur
        socket.broadcast.emit('action', Object.assign(Object.assign({}, msg), { source: socket.id }));
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
