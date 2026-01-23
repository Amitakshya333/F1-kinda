// WebSocket Server for Multiplayer
// Run with: node server.js

const WebSocket = require('ws');
const http = require('http');

const PORT = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('F1 Racing Game - WebSocket Server Running\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active rooms
const rooms = new Map();

// Store player connections
const players = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    let playerId = null;
    let currentRoom = null;
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data.type);
            
            switch (data.type) {
                case 'register':
                    playerId = data.playerId;
                    players.set(playerId, ws);
                    ws.send(JSON.stringify({
                        type: 'registered',
                        playerId: playerId
                    }));
                    break;
                
                case 'create-room':
                    currentRoom = data.roomCode;
                    rooms.set(currentRoom, {
                        host: playerId,
                        players: [playerId],
                        readyStates: {},
                        gameState: 'lobby'
                    });
                    
                    ws.send(JSON.stringify({
                        type: 'room-created',
                        roomCode: currentRoom
                    }));
                    break;
                
                case 'join-room':
                    const roomCode = data.roomCode;
                    if (rooms.has(roomCode)) {
                        currentRoom = roomCode;
                        const room = rooms.get(roomCode);
                        room.players.push(playerId);
                        
                        // Notify all players in room
                        broadcastToRoom(roomCode, {
                            type: 'player-joined',
                            playerId: playerId,
                            players: room.players
                        });
                        
                        ws.send(JSON.stringify({
                            type: 'room-joined',
                            roomCode: roomCode,
                            players: room.players
                        }));
                    } else {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Room not found'
                        }));
                    }
                    break;
                
                case 'leave-room':
                    if (currentRoom && rooms.has(currentRoom)) {
                        const room = rooms.get(currentRoom);
                        room.players = room.players.filter(p => p !== playerId);
                        
                        if (room.players.length === 0) {
                            rooms.delete(currentRoom);
                        } else {
                            broadcastToRoom(currentRoom, {
                                type: 'player-left',
                                playerId: playerId,
                                players: room.players
                            });
                        }
                        currentRoom = null;
                    }
                    break;
                
                case 'ready':
                    if (currentRoom && rooms.has(currentRoom)) {
                        const room = rooms.get(currentRoom);
                        room.readyStates[playerId] = data.ready;
                        
                        broadcastToRoom(currentRoom, {
                            type: 'ready-update',
                            playerId: playerId,
                            ready: data.ready,
                            readyStates: room.readyStates
                        });
                    }
                    break;
                
                case 'start-game':
                    if (currentRoom && rooms.has(currentRoom)) {
                        const room = rooms.get(currentRoom);
                        if (room.host === playerId) {
                            room.gameState = 'racing';
                            
                            broadcastToRoom(currentRoom, {
                                type: 'game-start',
                                timestamp: Date.now()
                            });
                        }
                    }
                    break;
                
                case 'car-state':
                    if (currentRoom) {
                        broadcastToRoom(currentRoom, {
                            type: 'car-state-update',
                            playerId: playerId,
                            position: data.position,
                            angle: data.angle,
                            speed: data.speed,
                            currentLap: data.currentLap,
                            timestamp: data.timestamp
                        }, playerId);
                    }
                    break;
                
                case 'power-up-collected':
                    if (currentRoom) {
                        broadcastToRoom(currentRoom, {
                            type: 'power-up-collected',
                            playerId: playerId,
                            powerUpId: data.powerUpId
                        });
                    }
                    break;
                
                case 'power-up-used':
                    if (currentRoom) {
                        broadcastToRoom(currentRoom, {
                            type: 'power-up-used',
                            playerId: playerId,
                            powerUpType: data.powerUpType,
                            position: data.position
                        });
                    }
                    break;
                
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        if (playerId) {
            players.delete(playerId);
            
            // Remove from room if in one
            if (currentRoom && rooms.has(currentRoom)) {
                const room = rooms.get(currentRoom);
                room.players = room.players.filter(p => p !== playerId);
                
                if (room.players.length === 0) {
                    rooms.delete(currentRoom);
                } else {
                    broadcastToRoom(currentRoom, {
                        type: 'player-disconnected',
                        playerId: playerId
                    });
                }
            }
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function broadcastToRoom(roomCode, message, excludePlayerId = null) {
    if (!rooms.has(roomCode)) return;
    
    const room = rooms.get(roomCode);
    const messageStr = JSON.stringify(message);
    
    room.players.forEach(playerId => {
        if (playerId !== excludePlayerId && players.has(playerId)) {
            const playerWs = players.get(playerId);
            if (playerWs.readyState === WebSocket.OPEN) {
                playerWs.send(messageStr);
            }
        }
    });
}

server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
    console.log(`Connect to: ws://localhost:${PORT}`);
});
