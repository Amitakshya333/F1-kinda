// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = CONSTANTS.CANVAS_HEIGHT;
        
        // Managers
        this.inputManager = new InputManager();
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager();
        this.networkManager = new NetworkManager();
        this.collisionDetector = new CollisionDetector();
        
        // Game state
        this.gameState = new GameState();
        
        // Game objects
        this.track = null;
        this.cars = [];
        this.powerUps = [];
        this.camera = new Camera(0, 0);
        this.camera.setCanvas(this.canvas);
        
        // Performance
        this.perfMonitor = new PerformanceMonitor();
        this.lastTime = performance.now();
        this.deltaTime = 0;
        
        // Game loop
        this.running = false;
        this.animationFrameId = null;
        
        // Oil slicks and effects
        this.oilSlicks = [];
        this.empEffects = [];
        
        // Initialize UI
        this.init();
    }
    
    init() {
        console.log('Initializing F1 Racing Game...');
        
        // Populate UI
        this.uiManager.populateTrackSelection(TRACKS);
        this.uiManager.populateCarSelection(CONSTANTS.TEAMS);
        
        // Make instance globally available
        window.gameInstance = this;
        
        console.log('Game initialized successfully!');
    }
    
    setGameMode(mode) {
        this.gameState.setMode(mode);
    }
    
    selectTrack(trackKey) {
        this.gameState.setTrack(trackKey);
    }
    
    selectCar(teamIndex) {
        const team = CONSTANTS.TEAMS[teamIndex];
        this.gameState.addTeam(team);
    }
    
    startRace() {
        console.log('Starting race...');
        
        this.uiManager.showLoadingScreen();
        
        // Load track
        setTimeout(() => {
            this.loadTrack();
            this.uiManager.updateLoadingProgress(50);
            
            setTimeout(() => {
                this.setupRace();
                this.uiManager.updateLoadingProgress(100);
                
                setTimeout(() => {
                    this.uiManager.hideLoadingScreen();
                    this.beginCountdown();
                }, 500);
            }, 500);
        }, 500);
    }
    
    loadTrack() {
        const trackKey = this.gameState.selectedTrack || 'MONACO';
        this.track = new Track(trackKey);
        this.camera.setBounds(
            this.track.bounds.minX,
            this.track.bounds.minY,
            this.track.bounds.maxX,
            this.track.bounds.maxY
        );
        console.log(`Track loaded: ${this.track.name}`);
    }
    
    setupRace() {
        this.cars = [];
        this.powerUps = [];
        this.oilSlicks = [];
        this.empEffects = [];
        
        // Create cars based on game mode
        const numPlayers = this.gameState.mode === 'local-multiplayer' ? 2 : 1;
        
        for (let i = 0; i < numPlayers; i++) {
            const team = this.gameState.selectedTeams[i] || CONSTANTS.TEAMS[i];
            const startPos = this.track.startPositions[i];
            
            const car = new Car(startPos.x, startPos.y, team, i + 1);
            car.angle = startPos.angle;
            this.cars.push(car);
        }
        
        // Create power-ups
        this.track.powerUpSpawns.forEach(spawn => {
            const types = Object.keys(CONSTANTS.POWERUP_TYPES);
            const randomType = types[randomInt(0, types.length)];
            const powerUp = new PowerUp(spawn.x, spawn.y, randomType);
            this.powerUps.push(powerUp);
        });
        
        // Position camera on first car
        if (this.cars.length > 0) {
            this.camera.follow(this.cars[0].position, true);
        }
        
        console.log('Race setup complete');
    }
    
    beginCountdown() {
        this.gameState.startRace();
        this.uiManager.hideAllScreens();
        this.uiManager.showHUD();
        
        // Start rendering
        if (!this.running) {
            this.running = true;
            this.gameLoop();
        }
        
        // Show countdown
        this.uiManager.showCountdown(() => {
            this.gameState.beginRacing();
            console.log('Race started!');
        });
    }
    
    gameLoop(currentTime = performance.now()) {
        if (!this.running) {
            console.log('Game loop stopped - running is false');
            return;
        }
        
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Clamp delta time to prevent large jumps
        this.deltaTime = Math.min(this.deltaTime, 0.1);
        
        // Update
        this.update(this.deltaTime);
        
        // Render
        this.render();
        
        // Performance monitoring
        this.perfMonitor.update();
        
        // Continue loop
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        if (this.gameState.isPaused()) return;
        
        if (this.gameState.isRacing()) {
            // Update cars
            this.cars.forEach((car, index) => {
                // Apply input
                if (index === 0) {
                    this.inputManager.applyInputToCar(car, 1);
                } else if (index === 1 && this.gameState.mode === 'local-multiplayer') {
                    this.inputManager.applyInputToCar(car, 2);
                }
                
                // Update car physics
                car.update(deltaTime);
                
                // Check collisions
                this.collisionDetector.checkTrackCollisions(car, this.track);
                
                // Check checkpoints
                this.track.checkCheckpoint(car);
                
                // Check power-ups
                const collectedPowerUp = this.collisionDetector.checkPowerUpCollisions(car, this.powerUps);
                if (collectedPowerUp) {
                    this.audioManager.playPowerUp();
                }
                
                // Check oil slicks
                this.collisionDetector.checkOilSlickCollision(car, this.oilSlicks);
                
                // Handle power-up effects
                if (car.currentPowerUp === 'OIL' && car.powerUpActive) {
                    // Drop oil slick
                    this.dropOilSlick(car);
                    car.deactivatePowerUp();
                }
                
                if (car.currentPowerUp === 'EMP' && car.powerUpActive) {
                    this.triggerEMP(car);
                    car.deactivatePowerUp();
                }
                
                // Check race completion
                if (car.currentLap > CONSTANTS.TOTAL_LAPS) {
                    this.finishRace();
                }
            });
            
            // Check car-to-car collisions
            this.collisionDetector.checkCarCollisions(this.cars);
            
            // Update power-ups
            this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
            
            // Update oil slicks
            this.oilSlicks = this.oilSlicks.filter(oil => {
                oil.life--;
                return oil.life > 0;
            });
            
            // Update EMP effects
            this.empEffects = this.empEffects.filter(emp => {
                emp.radius += 5;
                emp.alpha -= 0.02;
                return emp.alpha > 0;
            });
            
            // Update positions/rankings
            this.updateRankings();
            
            // Update camera
            if (this.gameState.mode === 'local-multiplayer') {
                this.camera.followMultiple(this.cars.map(c => c.position));
            } else {
                this.camera.follow(this.cars[0].position);
            }
            this.camera.update(deltaTime);
            
            // Update HUD
            if (this.cars.length > 0) {
                this.uiManager.updateHUD({
                    position: this.cars[0].position_rank,
                    currentLap: this.cars[0].currentLap,
                    totalLaps: CONSTANTS.TOTAL_LAPS,
                    speed: this.cars[0].speed,
                    lapTime: this.cars[0].currentLapTime,
                    powerUp: this.cars[0].currentPowerUp
                });
            }
        }
        
        // Handle pause
        if (this.inputManager.paused && this.gameState.isRacing()) {
            this.togglePause();
            this.inputManager.paused = false;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        console.log('Render called - track:', !!this.track, 'cars:', this.cars.length, 'running:', this.running);
        
        if (this.track && this.cars.length > 0) {
            // Draw track
            this.track.draw(this.ctx, this.camera);
            
            // Draw power-ups
            this.powerUps.forEach(powerUp => powerUp.draw(this.ctx, this.camera));
            
            // Draw oil slicks
            this.oilSlicks.forEach(oil => {
                const alpha = oil.life / oil.maxLife;
                this.ctx.fillStyle = `rgba(50, 50, 50, ${alpha * 0.8})`;
                this.ctx.beginPath();
                this.ctx.arc(
                    oil.x - this.camera.x,
                    oil.y - this.camera.y,
                    oil.radius,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            });
            
            // Draw EMP effects
            this.empEffects.forEach(emp => {
                this.ctx.strokeStyle = `rgba(230, 126, 34, ${emp.alpha})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(
                    emp.x - this.camera.x,
                    emp.y - this.camera.y,
                    emp.radius,
                    0,
                    Math.PI * 2
                );
                this.ctx.stroke();
            });
            
            // Draw cars
            this.cars.forEach(car => car.draw(this.ctx, this.camera));
            
            // Draw minimap
            const minimapX = this.canvas.width - 220;
            const minimapY = 20;
            this.track.drawMinimap(this.ctx, this.cars, minimapX, minimapY, 200, 200);
        }
        
        // Draw FPS counter (debug)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`FPS: ${this.perfMonitor.getFPS()}`, 10, this.canvas.height - 10);
    }
    
    updateRankings() {
        // Sort cars by progress (checkpoints + lap)
        const sortedCars = [...this.cars].sort((a, b) => {
            const progressA = a.currentLap * 1000 + a.checkpointsPassed;
            const progressB = b.currentLap * 1000 + b.checkpointsPassed;
            return progressB - progressA;
        });
        
        sortedCars.forEach((car, index) => {
            car.position_rank = index + 1;
        });
    }
    
    dropOilSlick(car) {
        const angleRad = degreesToRadians(car.angle);
        this.oilSlicks.push({
            x: car.position.x - Math.cos(angleRad) * car.height,
            y: car.position.y - Math.sin(angleRad) * car.height,
            radius: 20,
            life: 300,
            maxLife: 300
        });
    }
    
    triggerEMP(car) {
        const empConfig = CONSTANTS.POWERUP_TYPES.EMP;
        this.empEffects.push({
            x: car.position.x,
            y: car.position.y,
            radius: 0,
            alpha: 1
        });
        
        // Stun nearby cars
        this.cars.forEach(otherCar => {
            if (otherCar !== car) {
                this.collisionDetector.checkEMPEffect(
                    otherCar,
                    car.position,
                    empConfig.radius
                );
            }
        });
    }
    
    togglePause() {
        if (this.gameState.pause()) {
            this.uiManager.showPauseMenu();
        } else if (this.gameState.resume()) {
            this.uiManager.hidePauseMenu();
        }
    }
    
    restart() {
        this.uiManager.hidePauseMenu();
        this.setupRace();
        this.beginCountdown();
    }
    
    quitToMenu() {
        this.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.gameState.reset();
        this.uiManager.hideHUD();
        this.uiManager.hidePauseMenu();
        this.uiManager.showScreen('main-menu');
        
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    finishRace() {
        if (this.gameState.isFinished()) return;
        
        console.log('Race finished!');
        this.gameState.finishRace(this.cars[0]);
        
        // Sort cars by total time
        const results = [...this.cars].sort((a, b) => a.totalTime - b.totalTime);
        
        // Show finish screen
        this.uiManager.showFinishScreen(results);
        this.audioManager.playLapComplete();
    }
    
    rematch() {
        this.uiManager.showScreen('track-selection');
    }
    
    startNetworkGame() {
        // Start online multiplayer game
        console.log('Starting network game...');
        this.uiManager.hideAllScreens();
        this.startRace();
    }
}
