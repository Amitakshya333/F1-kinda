// Car Class
class Car {
    constructor(x, y, team, playerNumber = 1) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.acceleration = new Vector2D(0, 0);
        
        this.angle = 0; // degrees
        this.speed = 0; // current speed in pixels/second
        this.targetSpeed = 0;
        
        this.width = CONSTANTS.CAR_WIDTH;
        this.height = CONSTANTS.CAR_HEIGHT;
        
        this.team = team;
        this.color = team.color;
        this.number = team.number;
        this.playerNumber = playerNumber;
        
        // State
        this.isAccelerating = false;
        this.isBraking = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.isDrifting = false;
        
        // Race stats
        this.currentLap = 1;
        this.lapTimes = [];
        this.currentLapTime = 0;
        this.totalTime = 0;
        this.position_rank = 1;
        this.checkpointsPassed = 0;
        this.lastCheckpoint = 0;
        
        // Power-up
        this.currentPowerUp = null;
        this.powerUpActive = false;
        this.powerUpEndTime = 0;
        
        // Effects
        this.isInvulnerable = false;
        this.isGhost = false;
        this.hasShield = false;
        this.isStunned = false;
        this.stunEndTime = 0;
        
        // Physics
        this.friction = 0.98;
        this.offTrack = false;
        
        // Animation
        this.tireSmoke = [];
        this.particles = [];
    }
    
    update(deltaTime) {
        // Update power-up effects
        this.updatePowerUps();
        
        // Update stun
        if (this.isStunned && Date.now() > this.stunEndTime) {
            this.isStunned = false;
        }
        
        if (this.isStunned) {
            this.speed *= 0.95;
            this.updatePosition(deltaTime);
            return;
        }
        
        // Calculate turn rate based on speed
        const speedRatio = this.speed / CONSTANTS.MAX_SPEED;
        let turnRate;
        if (speedRatio < 0.3) {
            turnRate = CONSTANTS.TURN_SPEED_SLOW;
        } else if (speedRatio < 0.7) {
            turnRate = CONSTANTS.TURN_SPEED_MEDIUM;
        } else {
            turnRate = CONSTANTS.TURN_SPEED_FAST;
        }
        
        // Handle turning
        if (this.isTurningLeft) {
            this.angle -= turnRate;
            if (this.isDrifting && this.speed > 100) {
                this.addTireSmoke();
            }
        }
        if (this.isTurningRight) {
            this.angle += turnRate;
            if (this.isDrifting && this.speed > 100) {
                this.addTireSmoke();
            }
        }
        
        this.angle = normalizeAngle(this.angle);
        
        // Handle acceleration/braking
        if (this.isAccelerating) {
            this.targetSpeed = CONSTANTS.MAX_SPEED;
            if (this.powerUpActive && this.currentPowerUp === 'BOOST') {
                this.targetSpeed *= CONSTANTS.POWERUP_TYPES.BOOST.speedMultiplier;
            }
        } else if (this.isBraking) {
            this.targetSpeed = 0;
            this.speed -= CONSTANTS.BRAKE_FORCE * deltaTime;
        } else {
            this.targetSpeed = 0;
        }
        
        // Update speed with acceleration/deceleration
        if (this.speed < this.targetSpeed) {
            let accel = CONSTANTS.ACCELERATION;
            if (this.offTrack) accel *= CONSTANTS.OFFTRACK_SPEED_MULTIPLIER;
            this.speed += accel * deltaTime;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= CONSTANTS.DECELERATION * deltaTime;
        }
        
        // Apply friction
        if (!this.isAccelerating && !this.isBraking) {
            this.speed *= this.friction;
        }
        
        // Clamp speed
        this.speed = clamp(this.speed, CONSTANTS.MIN_SPEED, CONSTANTS.MAX_SPEED * 1.5);
        
        // Update position
        this.updatePosition(deltaTime);
        
        // Update particles
        this.updateParticles();
        
        // Update race time
        this.currentLapTime += deltaTime * 1000; // Convert to ms
        this.totalTime += deltaTime * 1000;
    }
    
    updatePosition(deltaTime) {
        const angleRad = degreesToRadians(this.angle);
        const velocityX = Math.cos(angleRad) * this.speed * deltaTime;
        const velocityY = Math.sin(angleRad) * this.speed * deltaTime;
        
        this.position.x += velocityX;
        this.position.y += velocityY;
    }
    
    updatePowerUps() {
        if (this.powerUpActive && Date.now() > this.powerUpEndTime) {
            this.deactivatePowerUp();
        }
    }
    
    activatePowerUp() {
        if (!this.currentPowerUp) return;
        
        const powerUp = CONSTANTS.POWERUP_TYPES[this.currentPowerUp];
        this.powerUpActive = true;
        
        switch (this.currentPowerUp) {
            case 'BOOST':
                this.powerUpEndTime = Date.now() + powerUp.duration;
                break;
            case 'SHIELD':
                this.hasShield = true;
                this.isInvulnerable = true;
                this.powerUpEndTime = Date.now() + powerUp.duration;
                break;
            case 'GHOST':
                this.isGhost = true;
                this.powerUpEndTime = Date.now() + powerUp.duration;
                break;
            case 'TELEPORT':
                this.teleportForward(powerUp.distance);
                this.currentPowerUp = null;
                this.powerUpActive = false;
                break;
            case 'OIL':
                // Drop oil slick behind car
                // Handled by game logic
                break;
            case 'EMP':
                // Handled by game logic
                break;
        }
    }
    
    deactivatePowerUp() {
        this.powerUpActive = false;
        this.hasShield = false;
        this.isInvulnerable = false;
        this.isGhost = false;
        this.currentPowerUp = null;
    }
    
    teleportForward(distance) {
        const angleRad = degreesToRadians(this.angle);
        this.position.x += Math.cos(angleRad) * distance;
        this.position.y += Math.sin(angleRad) * distance;
    }
    
    collectPowerUp(type) {
        this.currentPowerUp = type;
    }
    
    handleCollision(wall = false) {
        if (this.isInvulnerable || this.isGhost) return;
        
        if (wall) {
            this.speed *= (1 - CONSTANTS.WALL_COLLISION_SPEED_LOSS);
            // Bounce back
            const angleRad = degreesToRadians(this.angle);
            this.position.x -= Math.cos(angleRad) * 10;
            this.position.y -= Math.sin(angleRad) * 10;
        } else {
            this.speed *= (1 - CONSTANTS.CAR_COLLISION_SPEED_LOSS);
        }
        
        this.addCollisionParticles();
    }
    
    stun(duration) {
        if (this.hasShield) {
            this.deactivatePowerUp();
            return;
        }
        this.isStunned = true;
        this.stunEndTime = Date.now() + duration;
    }
    
    addTireSmoke() {
        const angleRad = degreesToRadians(this.angle);
        const offsetX = -Math.cos(angleRad) * this.height / 2;
        const offsetY = -Math.sin(angleRad) * this.height / 2;
        
        this.tireSmoke.push({
            x: this.position.x + offsetX,
            y: this.position.y + offsetY,
            alpha: 1,
            size: 5
        });
        
        if (this.tireSmoke.length > 20) {
            this.tireSmoke.shift();
        }
    }
    
    addCollisionParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.position.x,
                y: this.position.y,
                vx: randomRange(-3, 3),
                vy: randomRange(-3, 3),
                life: 30,
                maxLife: 30
            });
        }
    }
    
    updateParticles() {
        // Update tire smoke
        this.tireSmoke = this.tireSmoke.filter(smoke => {
            smoke.alpha -= 0.05;
            smoke.size += 0.2;
            return smoke.alpha > 0;
        });
        
        // Update collision particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    completeLap() {
        this.lapTimes.push(this.currentLapTime);
        this.currentLapTime = 0;
        this.currentLap++;
        this.checkpointsPassed = 0;
    }
    
    getBoundingBox() {
        return {
            x: this.position.x - this.width / 2,
            y: this.position.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    draw(ctx, camera) {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Draw tire smoke (World space, so we draw it before rotation to avoid smoke spinning with car)
        this.tireSmoke.forEach(smoke => {
            ctx.fillStyle = `rgba(100, 100, 100, ${smoke.alpha})`;
            ctx.beginPath();
            // smoke.x is world pos. screenX is car center relative to camera. 
            // We are at (screenX, screenY) in canvas context.
            // We want to draw at (smoke.x - camera.x, smoke.y - camera.y).
            // So relative to current context origin (screenX, screenY):
            // x = (smoke.x - camera.x) - screenX = smoke.x - (screenX + camera.x) = smoke.x - this.position.x
            ctx.arc(smoke.x - this.position.x, smoke.y - this.position.y, smoke.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Now rotate for the car body
        ctx.rotate(degreesToRadians(this.angle));
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.filter = 'blur(5px)';
        ctx.beginPath();
        ctx.ellipse(0, 5, this.width / 1.8, this.height / 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';

        // Shield effect
        if (this.hasShield) {
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
            ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.width * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Spinning shield ring
            ctx.save();
            ctx.rotate(Date.now() / 200);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.arc(0, 0, this.width * 0.7, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Ghost effect transparency
        if (this.isGhost) {
            ctx.globalAlpha = 0.4;
        }

        // --- F1 CAR RENDERING ---
        const w = this.width;
        const h = this.height;
        const color = this.color;
        
        // Tires
        ctx.fillStyle = '#111';
        const wheelWidth = w * 0.25;
        const wheelHeight = h * 0.2;
        const wheelInsetX = w * 0.35;
        const wheelInsetY = h * 0.3;
        
        // FL, FR, BL, BR
        this.drawWheel(ctx, w/2 - wheelWidth/2, -h/2 + wheelHeight/2, wheelWidth, wheelHeight);
        this.drawWheel(ctx, w/2 - wheelWidth/2, h/2 - wheelHeight/2, wheelWidth, wheelHeight);
        this.drawWheel(ctx, -w/2 + wheelWidth/2, -h/2 + wheelHeight/2, wheelWidth, wheelHeight * 1.2); // Rear slightly larger
        this.drawWheel(ctx, -w/2 + wheelWidth/2, h/2 - wheelHeight/2, wheelWidth, wheelHeight * 1.2);

        // Main Body (Chassis)
        ctx.fillStyle = color;
        ctx.beginPath();
        // Nose
        ctx.moveTo(w/2 + 5, 0); 
        ctx.lineTo(w/4, -h/4);
        // Sidepods front
        ctx.lineTo(0, -h/2 + 2);
        // Sidepods rear
        ctx.lineTo(-w/2 + 5, -h/2 + 4);
        // Rear
        ctx.lineTo(-w/2 + 5, h/2 - 4);
        ctx.lineTo(0, h/2 - 2);
        ctx.lineTo(w/4, h/4);
        ctx.closePath();
        ctx.fill();
        
        // Gradient Highlight on Body
        let gradient = ctx.createLinearGradient(-w/2, 0, w/2, 0);
        gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Front Wing
        ctx.fillStyle = color; // Or secondary color relative to team
        ctx.fillRect(w/2 - 2, -h/2 - 2, 4, h + 4); 
        
        // Rear Wing
        ctx.fillStyle = '#111';
        ctx.fillRect(-w/2 - 2, -h/2 + 2, 6, h - 4);
        ctx.fillStyle = color;
        ctx.fillRect(-w/2, -h/2 + 2, 4, h - 4);

        // Cockpit
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.ellipse(-5, 0, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Driver Helmet
        ctx.fillStyle = '#f1c40f'; // Yellow helmet
        ctx.beginPath();
        ctx.arc(-5, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Number
        ctx.save();
        ctx.translate(w/6, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.number, 0, 0);
        ctx.restore();
        
        // Boost flame
        if (this.powerUpActive && this.currentPowerUp === 'BOOST') {
            const time = Date.now();
            const flameLength = (Math.sin(time / 50) + 2) * 10;
            ctx.fillStyle = '#e74c3c'; // Inner
            ctx.beginPath();
            ctx.moveTo(-w/2 - 2, -3);
            ctx.lineTo(-w/2 - 2 - flameLength, 0);
            ctx.lineTo(-w/2 - 2, 3);
            ctx.fill();
            
            ctx.fillStyle = '#f39c12'; // Outer
            ctx.beginPath();
            ctx.moveTo(-w/2 - 2, -6);
            ctx.lineTo(-w/2 - 2 - flameLength * 0.7, 0);
            ctx.lineTo(-w/2 - 2, 6);
            ctx.fill();
        }
        
        ctx.restore();
        
        // Draw collision particles (World Space)
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.fillStyle = `rgba(255, 87, 34, ${alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x - camera.x, particle.y - camera.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw position indicator
        // Only if not me (optional, but good for identifying others)
        if (this.playerNumber !== 1) { 
            ctx.fillStyle = '#fff';
            ctx.font = '10px Share Tech Mono';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.textAlign = 'center';
            ctx.fillText(`P${this.playerNumber}`, screenX, screenY - this.height);
            ctx.shadowBlur = 0;
        }
    }

    drawWheel(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);
        // Tire tread
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-width/2, -height/2, width, height);
        ctx.fillStyle = '#333';
        // Simple pixel detail
        ctx.fillRect(-width/2 + 1, -height/2 + 1, width - 2, height - 2);
        ctx.restore();
    }
}
