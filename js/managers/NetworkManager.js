// Network Manager (Client-side)
class NetworkManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.roomCode = null;
        this.playerId = null;
        this.isHost = false;
        this.players = [];
        this.latency = 0;

        // For this demo, we'll use a simple peer-to-peer approach
        // In production, you'd want a proper backend server
        this.serverUrl = 'ws://localhost:3000'; // WebSocket server
    }

    connect() {
        // Simulated connection - in production, connect to actual WebSocket server
        console.log('Connecting to server...');
        this.connected = true;
        this.playerId = this.generatePlayerId();
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.connected = false;
        this.roomCode = null;
        this.isHost = false;
        this.players = [];
    }

    createRoom(roomCode) {
        // Bug 11 fix: ensure connected (playerId assigned) before creating room
        if (!this.connected) this.connect();

        this.roomCode = roomCode;
        this.isHost = true;
        this.players = [{
            id: this.playerId,
            name: `Player ${this.playerId.substr(0, 4)}`,
            ready: false,
            isHost: true
        }];

        // In production: Send create room request to server
        console.log(`Room created: ${roomCode}`);
        this.updatePlayersList();
    }

    joinRoom(roomCode) {
        // Bug 11 fix: ensure connected (playerId assigned) before joining room
        if (!this.connected) this.connect();

        this.roomCode = roomCode;
        this.isHost = false;

        // In production: Send join room request to server
        console.log(`Joining room: ${roomCode}`);

        // Simulate joining
        this.players.push({
            id: this.playerId,
            name: `Player ${this.playerId.substr(0, 4)}`,
            ready: false,
            isHost: false
        });

        this.updatePlayersList();
    }

    leaveRoom() {
        // In production: Send leave room request to server
        this.roomCode = null;
        this.isHost = false;
        this.players = [];
    }

    setReady(ready) {
        const player = this.players.find(p => p.id === this.playerId);
        if (player) {
            player.ready = ready;
            this.updatePlayersList();

            // In production: Send ready state to server
            this.broadcastPlayerState();
        }
    }

    startGame() {
        if (!this.isHost) return;

        // Check if all players are ready
        const allReady = this.players.every(p => p.ready);
        if (!allReady) {
            alert('Not all players are ready!');
            return;
        }

        // In production: Send start game signal to server
        console.log('Starting game...');
        window.gameInstance?.startNetworkGame();
    }

    sendCarState(car) {
        if (!this.connected) return;

        const state = {
            playerId: this.playerId,
            position: { x: car.position.x, y: car.position.y },
            angle: car.angle,
            speed: car.speed,
            currentLap: car.currentLap,
            timestamp: Date.now()
        };

        // In production: Send to server via WebSocket
        this.broadcastCarState(state);
    }

    broadcastCarState(state) {
        // In production: Broadcast to all players in room
        console.log('Broadcasting car state:', state);
    }

    broadcastPlayerState() {
        // In production: Broadcast player ready state
        window.gameInstance?.uiManager?.updatePlayersList(this.players);
    }

    updatePlayersList() {
        window.gameInstance?.uiManager?.updatePlayersList(this.players);

        // Show start button if host and all ready
        if (this.isHost) {
            const allReady = this.players.every(p => p.ready);
            const startBtn = document.getElementById('start-race-btn');
            if (startBtn) {
                if (allReady && this.players.length > 1) {
                    startBtn.classList.remove('hidden');
                } else {
                    startBtn.classList.add('hidden');
                }
            }
        }
    }

    receiveCarState(state) {
        // In production: Receive and interpolate remote player state
        return state;
    }

    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    measureLatency() {
        // In production: Ping server and calculate latency
        this.latency = 0;
    }
}
