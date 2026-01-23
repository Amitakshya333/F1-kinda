// Power-up Class
class PowerUp {
    constructor(x, y, type) {
        this.position = new Vector2D(x, y);
        this.type = type;
        this.active = true;
        this.radius = 15;
        this.rotation = 0;
        this.respawnTime = 0;
        
        this.config = CONSTANTS.POWERUP_TYPES[type];
    }
    
    update(deltaTime) {
        this.rotation += 2;
        if (this.rotation >= 360) this.rotation = 0;
        
        // Check respawn
        if (!this.active && Date.now() > this.respawnTime) {
            this.active = true;
        }
    }
    
    collect() {
        this.active = false;
        this.respawnTime = Date.now() + CONSTANTS.POWERUP_RESPAWN_TIME;
    }
    
    checkCollision(car) {
        if (!this.active) return false;
        
        const dist = distance(
            this.position.x,
            this.position.y,
            car.position.x,
            car.position.y
        );
        
        return dist < this.radius + car.width / 2;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;
        
        const time = Date.now();
        const pulse = (Math.sin(time / 200) + 1) * 0.2 + 0.8; // 0.8 to 1.2
        const glowSize = this.radius * 1.5 * pulse;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Glow Effect
        const gradient = ctx.createRadialGradient(0, 0, this.radius, 0, 0, glowSize * 2);
        gradient.addColorStop(0, this.config.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Rotate the inner box
        ctx.rotate(degreesToRadians(this.rotation));
        
        // Draw power-up box (Diamond shape?)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.config.color;
        
        ctx.beginPath();
        const size = this.radius * 1.2;
        ctx.moveTo(0, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw icon/symbol
        ctx.rotate(-degreesToRadians(this.rotation)); // Keep icon upright? Or let it spin. Let's keep upright.
        // Actually, let's let it spin with the box for dynamic feel
        ctx.rotate(degreesToRadians(this.rotation)); // Spin it 2x speed relative to box? No, just sync.
        
        // Reset rotation for icon to keep it readable? 
        // Let's make the symbol upright always.
        ctx.rotate(-degreesToRadians(this.rotation * 2)); 

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Segoe UI Emoji", "Arial"'; // Better emoji support
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let symbol = '?';
        switch (this.type) {
            case 'BOOST': symbol = '⚡'; break;
            case 'SHIELD': symbol = '🛡'; break;
            case 'OIL': symbol = '💧'; break;
            case 'EMP': symbol = '⚡'; break; // EMP also bolt? maybe different
            case 'TELEPORT': symbol = '🚀'; break;
            case 'GHOST': symbol = '👻'; break;
        }
        
        ctx.shadowColor = this.config.color;
        ctx.shadowBlur = 10;
        ctx.fillText(symbol, 0, 0);
        ctx.shadowBlur = 0;
        
        ctx.restore();
    }
}
