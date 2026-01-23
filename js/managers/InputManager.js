// Input Manager
class InputManager {
    constructor() {
        this.keys = {};
        this.players = {
            1: {
                up: false,
                down: false,
                left: false,
                right: false,
                powerup: false
            },
            2: {
                up: false,
                down: false,
                left: false,
                right: false,
                powerup: false
            }
        };
        
        this.paused = false;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(e) {
        this.keys[e.key] = true;
        
        // Player 1 controls
        if (e.key === CONTROLS.PLAYER1.UP) this.players[1].up = true;
        if (e.key === CONTROLS.PLAYER1.DOWN) this.players[1].down = true;
        if (e.key === CONTROLS.PLAYER1.LEFT) this.players[1].left = true;
        if (e.key === CONTROLS.PLAYER1.RIGHT) this.players[1].right = true;
        if (e.key === CONTROLS.PLAYER1.POWERUP) this.players[1].powerup = true;
        
        // Player 2 controls
        if (e.key === CONTROLS.PLAYER2.UP) this.players[2].up = true;
        if (e.key === CONTROLS.PLAYER2.DOWN) this.players[2].down = true;
        if (e.key === CONTROLS.PLAYER2.LEFT) this.players[2].left = true;
        if (e.key === CONTROLS.PLAYER2.RIGHT) this.players[2].right = true;
        if (e.key === CONTROLS.PLAYER2.POWERUP) this.players[2].powerup = true;
        
        // General controls
        if (e.key === CONTROLS.GENERAL.PAUSE) this.paused = !this.paused;
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
        
        // Player 1 controls
        if (e.key === CONTROLS.PLAYER1.UP) this.players[1].up = false;
        if (e.key === CONTROLS.PLAYER1.DOWN) this.players[1].down = false;
        if (e.key === CONTROLS.PLAYER1.LEFT) this.players[1].left = false;
        if (e.key === CONTROLS.PLAYER1.RIGHT) this.players[1].right = false;
        if (e.key === CONTROLS.PLAYER1.POWERUP) this.players[1].powerup = false;
        
        // Player 2 controls
        if (e.key === CONTROLS.PLAYER2.UP) this.players[2].up = false;
        if (e.key === CONTROLS.PLAYER2.DOWN) this.players[2].down = false;
        if (e.key === CONTROLS.PLAYER2.LEFT) this.players[2].left = false;
        if (e.key === CONTROLS.PLAYER2.RIGHT) this.players[2].right = false;
        if (e.key === CONTROLS.PLAYER2.POWERUP) this.players[2].powerup = false;
    }
    
    applyInputToCar(car, playerNumber) {
        const input = this.players[playerNumber];
        if (!input) return;
        
        car.isAccelerating = input.up;
        car.isBraking = input.down;
        car.isTurningLeft = input.left;
        car.isTurningRight = input.right;
        car.isDrifting = input.down && (input.left || input.right);
        
        if (input.powerup && car.currentPowerUp && !car.powerUpActive) {
            car.activatePowerUp();
            input.powerup = false; // Reset to prevent repeated activation
        }
    }
    
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    reset() {
        this.keys = {};
        this.players[1] = { up: false, down: false, left: false, right: false, powerup: false };
        this.players[2] = { up: false, down: false, left: false, right: false, powerup: false };
    }
}
