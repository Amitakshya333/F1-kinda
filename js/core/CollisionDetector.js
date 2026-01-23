// Collision Detector
class CollisionDetector {
    constructor() {
        this.collisionPairs = [];
    }
    
    checkCarCollisions(cars) {
        this.collisionPairs = [];
        
        for (let i = 0; i < cars.length; i++) {
            for (let j = i + 1; j < cars.length; j++) {
                if (this.checkCarPair(cars[i], cars[j])) {
                    this.collisionPairs.push([cars[i], cars[j]]);
                    this.resolveCarCollision(cars[i], cars[j]);
                }
            }
        }
    }
    
    checkCarPair(car1, car2) {
        // Skip if either car is ghost mode
        if (car1.isGhost || car2.isGhost) return false;
        
        const dist = distance(
            car1.position.x,
            car1.position.y,
            car2.position.x,
            car2.position.y
        );
        
        const collisionDistance = (car1.width + car2.width) / 2;
        return dist < collisionDistance;
    }
    
    resolveCarCollision(car1, car2) {
        // Calculate collision normal
        const dx = car2.position.x - car1.position.x;
        const dy = car2.position.y - car1.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) return;
        
        const nx = dx / dist;
        const ny = dy / dist;
        
        // Separate cars
        const overlap = (car1.width + car2.width) / 2 - dist;
        car1.position.x -= nx * overlap / 2;
        car1.position.y -= ny * overlap / 2;
        car2.position.x += nx * overlap / 2;
        car2.position.y += ny * overlap / 2;
        
        // Apply collision effects
        car1.handleCollision(false);
        car2.handleCollision(false);
    }
    
    checkTrackCollisions(car, track) {
        // Check wall collisions
        if (track.checkWallCollision(car)) {
            car.handleCollision(true);
            return true;
        }
        
        // Check if off track
        car.offTrack = track.isOffTrack(car.position.x, car.position.y);
        
        return false;
    }
    
    checkPowerUpCollisions(car, powerUps) {
        for (const powerUp of powerUps) {
            if (powerUp.checkCollision(car)) {
                car.collectPowerUp(powerUp.type);
                powerUp.collect();
                return powerUp.type;
            }
        }
        return null;
    }
    
    checkOilSlickCollision(car, oilSlicks) {
        for (const oil of oilSlicks) {
            const dist = distance(
                car.position.x,
                car.position.y,
                oil.x,
                oil.y
            );
            
            if (dist < oil.radius + car.width / 2) {
                if (!car.hasShield && !car.isInvulnerable) {
                    car.stun(2000);
                    return true;
                }
            }
        }
        return false;
    }
    
    checkEMPEffect(car, empCenter, empRadius) {
        const dist = distance(
            car.position.x,
            car.position.y,
            empCenter.x,
            empCenter.y
        );
        
        if (dist < empRadius) {
            if (!car.hasShield && !car.isInvulnerable) {
                car.stun(3000);
                return true;
            }
        }
        return false;
    }
}
