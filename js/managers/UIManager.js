// UI Manager
class UIManager {
    constructor() {
        this.currentScreen = 'main-menu';
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Main Menu
        document.getElementById('single-player-btn')?.addEventListener('click', () => {
            this.showScreen('track-selection');
            window.gameInstance?.setGameMode('single-player');
        });
        
        document.getElementById('local-multiplayer-btn')?.addEventListener('click', () => {
            this.showScreen('track-selection');
            window.gameInstance?.setGameMode('local-multiplayer');
        });
        
        document.getElementById('online-multiplayer-btn')?.addEventListener('click', () => {
            this.showScreen('online-lobby');
        });
        
        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showScreen('main-menu');
            });
        });
        
        // Pause menu
        document.getElementById('resume-btn')?.addEventListener('click', () => {
            window.gameInstance?.togglePause();
        });
        
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            window.gameInstance?.restart();
        });
        
        document.getElementById('quit-btn')?.addEventListener('click', () => {
            window.gameInstance?.quitToMenu();
        });
        
        // Online lobby
        document.getElementById('create-room-btn')?.addEventListener('click', () => {
            this.createRoom();
        });
        
        document.getElementById('join-room-btn')?.addEventListener('click', () => {
            this.showJoinRoomInterface();
        });
        
        document.getElementById('copy-code-btn')?.addEventListener('click', () => {
            this.copyRoomCode();
        });
        
        document.getElementById('share-link-btn')?.addEventListener('click', () => {
            this.shareRoomLink();
        });
        
        document.getElementById('ready-btn')?.addEventListener('click', () => {
            this.toggleReady();
        });
        
        document.getElementById('join-btn')?.addEventListener('click', () => {
            this.joinRoom();
        });
        
        // Finish screen
        document.getElementById('rematch-btn')?.addEventListener('click', () => {
            window.gameInstance?.rematch();
        });
        
        document.getElementById('menu-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
    }
    
    showScreen(screenName) {
        document.querySelectorAll('.menu-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = document.getElementById(screenName);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenName;
        }
    }
    
    hideAllScreens() {
        document.querySelectorAll('.menu-screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    showHUD() {
        document.getElementById('hud')?.classList.remove('hidden');
    }
    
    hideHUD() {
        document.getElementById('hud')?.classList.add('hidden');
    }
    
    updateHUD(data) {
        // Update position
        const positionElement = document.getElementById('position');
        if (positionElement && data.position) {
            const suffix = ['st', 'nd', 'rd'][data.position - 1] || 'th';
            positionElement.textContent = `${data.position}${suffix}`;
        }
        
        // Update lap counter
        const lapElement = document.getElementById('lap-counter');
        if (lapElement && data.currentLap !== undefined) {
            lapElement.textContent = `Lap: ${data.currentLap}/${data.totalLaps}`;
        }
        
        // Update speed
        const speedElement = document.getElementById('speed-value');
        if (speedElement && data.speed !== undefined) {
            const kmh = Math.round(data.speed * 0.36); // Convert pixels/sec to km/h (approximate)
            speedElement.textContent = kmh;
        }
        
        // Update lap time
        const lapTimeElement = document.getElementById('lap-time');
        if (lapTimeElement && data.lapTime !== undefined) {
            lapTimeElement.textContent = formatTime(data.lapTime);
        }
        
        // Update power-up display
        const powerUpElement = document.getElementById('powerup-display');
        const powerUpName = document.getElementById('powerup-name');
        if (powerUpElement && powerUpName) {
            if (data.powerUp) {
                powerUpElement.classList.remove('hidden');
                powerUpName.textContent = CONSTANTS.POWERUP_TYPES[data.powerUp].name;
            } else {
                powerUpElement.classList.add('hidden');
            }
        }
    }
    
    showCountdown(callback) {
        const countdownElement = document.getElementById('countdown');
        const lights = document.querySelectorAll('.light');
        
        if (!countdownElement) return;
        
        countdownElement.classList.remove('hidden');
        
        let currentLight = 0;
        const interval = setInterval(() => {
            if (currentLight < lights.length) {
                lights[currentLight].classList.add('active');
                window.gameInstance?.audioManager?.playCountdown();
                currentLight++;
            } else {
                // All lights out - GO!
                lights.forEach(light => {
                    light.classList.remove('active');
                    light.classList.add('go');
                });
                
                window.gameInstance?.audioManager?.playRaceStart();
                
                setTimeout(() => {
                    countdownElement.classList.add('hidden');
                    lights.forEach(light => {
                        light.classList.remove('active', 'go');
                    });
                    if (callback) callback();
                }, 500);
                
                clearInterval(interval);
            }
        }, 1000);
    }
    
    showPauseMenu() {
        document.getElementById('pause-menu')?.classList.remove('hidden');
    }
    
    hidePauseMenu() {
        document.getElementById('pause-menu')?.classList.add('hidden');
    }
    
    showFinishScreen(results) {
        const finishScreen = document.getElementById('finish-screen');
        const resultsContainer = document.getElementById('race-results');
        
        if (!finishScreen || !resultsContainer) return;
        
        resultsContainer.innerHTML = '';
        
        results.forEach((result, index) => {
            const row = document.createElement('div');
            row.className = 'result-row';
            if (index === 0) row.classList.add('first');
            if (index === 1) row.classList.add('second');
            if (index === 2) row.classList.add('third');
            
            row.innerHTML = `
                <span>${index + 1}. ${result.team.name}</span>
                <span>${formatTime(result.totalTime)}</span>
            `;
            
            resultsContainer.appendChild(row);
        });
        
        finishScreen.classList.remove('hidden');
    }
    
    showLoadingScreen() {
        document.getElementById('loading-screen')?.classList.remove('hidden');
    }
    
    hideLoadingScreen() {
        document.getElementById('loading-screen')?.classList.add('hidden');
    }
    
    updateLoadingProgress(percent) {
        const progress = document.getElementById('loading-progress');
        if (progress) {
            progress.style.width = `${percent}%`;
        }
    }
    
    populateTrackSelection(tracks) {
        const trackList = document.getElementById('track-list');
        if (!trackList) return;
        
        trackList.innerHTML = '';
        
        Object.keys(tracks).forEach(trackKey => {
            const track = tracks[trackKey];
            const card = document.createElement('div');
            card.className = 'track-card';
            
            // Create canvas for track preview
            const previewCanvas = document.createElement('canvas');
            previewCanvas.width = 240;
            previewCanvas.height = 140;
            previewCanvas.className = 'track-preview';
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'track-preview';
            previewDiv.appendChild(previewCanvas);
            
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `
                <h3>${track.name}</h3>
                <p>${track.difficulty}</p>
                <p>${track.description}</p>
            `;
            
            card.appendChild(previewDiv);
            card.appendChild(infoDiv);
            
            // Draw mini track preview
            this.drawTrackPreview(previewCanvas, trackKey);
            
            card.addEventListener('click', () => {
                this.selectTrack(trackKey);
            });
            
            trackList.appendChild(card);
        });
    }
    
    selectTrack(trackKey) {
        window.gameInstance?.selectTrack(trackKey);
        this.showScreen('car-selection');
    }
    
    populateCarSelection(teams) {
        const carList = document.getElementById('car-list');
        if (!carList) return;
        
        carList.innerHTML = '';
        
        teams.forEach((team, index) => {
            const card = document.createElement('div');
            card.className = 'car-card';
            
            // Create canvas for car preview
            const previewCanvas = document.createElement('canvas');
            previewCanvas.width = 100;
            previewCanvas.height = 50;
            previewCanvas.className = 'car-preview';
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'car-preview';
            previewDiv.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
            previewDiv.appendChild(previewCanvas);
            
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `
                <h4>${team.name}</h4>
                <p>#${team.number}</p>
            `;
            
            card.appendChild(previewDiv);
            card.appendChild(infoDiv);
            
            // Draw mini car preview
            this.drawCarPreview(previewCanvas, team);
            
            card.addEventListener('click', () => {
                this.selectCar(index);
            });
            
            carList.appendChild(card);
        });
    }
    
    selectCar(teamIndex) {
        window.gameInstance?.selectCar(teamIndex);
        this.hideAllScreens();
        window.gameInstance?.startRace();
    }
    
    // Online lobby methods
    createRoom() {
        const roomCode = generateRoomCode();
        document.getElementById('room-code').textContent = roomCode;
        document.querySelector('.lobby-options')?.classList.add('hidden');
        document.getElementById('room-interface')?.classList.remove('hidden');
        
        window.gameInstance?.networkManager?.createRoom(roomCode);
    }
    
    showJoinRoomInterface() {
        document.querySelector('.lobby-options')?.classList.add('hidden');
        document.getElementById('join-room-interface')?.classList.remove('hidden');
    }
    
    joinRoom() {
        const roomCodeInput = document.getElementById('room-code-input');
        const roomCode = roomCodeInput.value.toUpperCase();
        
        if (roomCode.length === CONSTANTS.ROOM_CODE_LENGTH) {
            window.gameInstance?.networkManager?.joinRoom(roomCode);
        }
    }
    
    copyRoomCode() {
        const roomCode = document.getElementById('room-code')?.textContent;
        if (roomCode) {
            navigator.clipboard.writeText(roomCode).then(() => {
                alert('Room code copied to clipboard!');
            });
        }
    }
    
    shareRoomLink() {
        const roomCode = document.getElementById('room-code')?.textContent;
        const link = `${window.location.origin}?room=${roomCode}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Join my F1 race!',
                text: `Join my race with code: ${roomCode}`,
                url: link
            });
        } else {
            navigator.clipboard.writeText(link).then(() => {
                alert('Room link copied to clipboard!');
            });
        }
    }
    
    toggleReady() {
        const readyBtn = document.getElementById('ready-btn');
        const isReady = readyBtn?.textContent === 'Ready';
        
        if (readyBtn) {
            readyBtn.textContent = isReady ? 'Not Ready' : 'Ready';
            readyBtn.style.background = isReady ? '#27ae60' : '#e74c3c';
        }
        
        window.gameInstance?.networkManager?.setReady(!isReady);
    }
    
    updatePlayersList(players) {
        const playersList = document.getElementById('players-list');
        if (!playersList) return;
        
        playersList.innerHTML = '';
        
        players.forEach(player => {
            const item = document.createElement('div');
            item.className = 'player-item';
            if (player.ready) item.classList.add('ready');
            
            item.innerHTML = `
                <span>${player.name}</span>
                <span>${player.ready ? '✓ Ready' : 'Not Ready'}</span>
            `;
            
            playersList.appendChild(item);
        });
    }

    drawTrackPreview(canvas, trackKey) {
        const ctx = canvas.getContext('2d');
        const track = new Track(trackKey);
        
        // Clear
        ctx.fillStyle = '#0f1012';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate bounds
        const scaleX = canvas.width / (track.bounds.maxX - track.bounds.minX);
        const scaleY = canvas.height / (track.bounds.maxY - track.bounds.minY);
        const scale = Math.min(scaleX, scaleY) * 0.85;
        
        const offsetX = canvas.width / 2;
        const offsetY = canvas.height / 2;
        const centerX = (track.bounds.minX + track.bounds.maxX) / 2;
        const centerY = (track.bounds.minY + track.bounds.maxY) / 2;
        
        // Draw track
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = track.width * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        track.waypoints.forEach((p, i) => {
            const x = offsetX + (p.x - centerX) * scale;
            const y = offsetY + (p.y - centerY) * scale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        
        // Draw center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    drawCarPreview(canvas, team) {
        const ctx = canvas.getContext('2d');
        
        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Center the car
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        
        const scale = 1.5;
        const w = 20 * scale;
        const h = 40 * scale;
        const color = team.color;
        
        // Tires
        ctx.fillStyle = '#111';
        const wheelWidth = w * 0.25;
        const wheelHeight = h * 0.2;
        
        ctx.fillRect(w/2 - wheelWidth/2, -h/2 + wheelHeight/2, wheelWidth, wheelHeight);
        ctx.fillRect(w/2 - wheelWidth/2, h/2 - wheelHeight/2, wheelWidth, wheelHeight);
        ctx.fillRect(-w/2 + wheelWidth/2, -h/2 + wheelHeight/2, wheelWidth, wheelHeight * 1.2);
        ctx.fillRect(-w/2 + wheelWidth/2, h/2 - wheelHeight/2, wheelWidth, wheelHeight * 1.2);

        // Main Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(w/2 + 5, 0);
        ctx.lineTo(w/4, -h/4);
        ctx.lineTo(0, -h/2 + 2);
        ctx.lineTo(-w/2 + 5, -h/2 + 4);
        ctx.lineTo(-w/2 + 5, h/2 - 4);
        ctx.lineTo(0, h/2 - 2);
        ctx.lineTo(w/4, h/4);
        ctx.closePath();
        ctx.fill();
        
        // Gradient
        let gradient = ctx.createLinearGradient(-w/2, 0, w/2, 0);
        gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Front Wing
        ctx.fillStyle = color;
        ctx.fillRect(w/2 - 2, -h/2 - 2, 4, h + 4);
        
        // Rear Wing
        ctx.fillStyle = '#111';
        ctx.fillRect(-w/2 - 2, -h/2 + 2, 6, h - 4);

        // Cockpit
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.ellipse(-5, 0, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Number
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(team.number, w/6, 0);
        
        ctx.restore();
    }
}
