// Camera Class
class Camera {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.zoom = 1;
        this.targetZoom = 1;
        
        this.followSpeed = 0.1;
        this.zoomSpeed = 0.05;
        
        this.bounds = null;
        this.canvas = null;
    }
    
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    
    setBounds(minX, minY, maxX, maxY) {
        this.bounds = { minX, minY, maxX, maxY };
    }
    
    follow(target, immediate = false) {
        this.targetX = target.x - (this.canvas ? this.canvas.width / 2 : 640);
        this.targetY = target.y - (this.canvas ? this.canvas.height / 2 : 360);
        
        if (immediate) {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }
    
    followMultiple(targets) {
        if (targets.length === 0) return;
        
        // Find center point of all targets
        let avgX = 0, avgY = 0;
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        targets.forEach(target => {
            avgX += target.x;
            avgY += target.y;
            minX = Math.min(minX, target.x);
            minY = Math.min(minY, target.y);
            maxX = Math.max(maxX, target.x);
            maxY = Math.max(maxY, target.y);
        });
        
        avgX /= targets.length;
        avgY /= targets.length;
        
        // Calculate zoom to fit all targets
        const spreadX = maxX - minX;
        const spreadY = maxY - minY;
        const canvasWidth = this.canvas ? this.canvas.width : 1280;
        const canvasHeight = this.canvas ? this.canvas.height : 720;
        
        const zoomX = canvasWidth / (spreadX + 200);
        const zoomY = canvasHeight / (spreadY + 200);
        this.targetZoom = clamp(Math.min(zoomX, zoomY), 0.5, 1.5);
        
        this.targetX = avgX - canvasWidth / 2;
        this.targetY = avgY - canvasHeight / 2;
    }
    
    update(deltaTime) {
        // Smooth follow
        this.x = lerp(this.x, this.targetX, this.followSpeed);
        this.y = lerp(this.y, this.targetY, this.followSpeed);
        
        // Smooth zoom
        this.zoom = lerp(this.zoom, this.targetZoom, this.zoomSpeed);
        
        // Apply bounds
        if (this.bounds && this.canvas) {
            this.x = clamp(this.x, this.bounds.minX, this.bounds.maxX - this.canvas.width);
            this.y = clamp(this.y, this.bounds.minY, this.bounds.maxY - this.canvas.height);
        }
    }
    
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.x) * this.zoom,
            y: (worldY - this.y) * this.zoom
        };
    }
    
    screenToWorld(screenX, screenY) {
        return {
            x: screenX / this.zoom + this.x,
            y: screenY / this.zoom + this.y
        };
    }
    
    shake(intensity = 5, duration = 200) {
        // Camera shake effect for collisions
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeStartTime = Date.now();
    }
    
    applyShake() {
        if (!this.shakeDuration) return;
        
        const elapsed = Date.now() - this.shakeStartTime;
        if (elapsed < this.shakeDuration) {
            const progress = elapsed / this.shakeDuration;
            const intensity = this.shakeIntensity * (1 - progress);
            
            this.x += randomRange(-intensity, intensity);
            this.y += randomRange(-intensity, intensity);
        } else {
            this.shakeDuration = 0;
        }
    }
}
