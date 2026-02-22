// Track Class
class Track {
    constructor(trackName) {
        this.config = TRACKS[trackName];
        this.name = this.config.name;
        this.difficulty = this.config.difficulty;

        // Track data
        this.waypoints = [];
        this.walls = [];
        this.checkpoints = [];
        this.powerUpSpawns = [];
        this.startPositions = [];
        this.offTrackZones = [];

        // Dimensions
        this.width = this.config.width;
        this.bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

        // Generate track based on name
        this.generateTrack(trackName);
    }

    generateTrack(trackName) {
        switch (trackName) {
            case 'MONACO':
                this.generateMonaco();
                break;
            case 'SILVERSTONE':
                this.generateSilverstone();
                break;
            case 'MONZA':
                this.generateMonza();
                break;
            case 'SUZUKA':
                this.generateSuzuka();
                break;
            case 'SPA':
                this.generateSpa();
                break;
            case 'CUSTOM':
                this.generateRandomTrack();
                break;
            default:
                this.generateSimpleOval();
        }

        this.calculateBounds();
        this.generateWalls();
        this.generateCheckpoints();
        this.generatePowerUpSpawns();
        this.generateStartPositions();
    }

    generateSimpleOval() {
        // Simple oval track for testing
        const centerX = 640;
        const centerY = 360;
        const radiusX = 400;
        const radiusY = 250;
        const points = 60;

        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            this.waypoints.push({
                x: centerX + Math.cos(angle) * radiusX,
                y: centerY + Math.sin(angle) * radiusY
            });
        }
    }

    generateMonaco() {
        // Monaco-inspired street circuit with tight corners
        const points = [
            { x: 400, y: 200 }, { x: 600, y: 200 }, { x: 800, y: 250 },
            { x: 900, y: 350 }, { x: 900, y: 500 }, { x: 800, y: 600 },
            { x: 600, y: 650 }, { x: 400, y: 650 }, { x: 300, y: 600 },
            { x: 200, y: 500 }, { x: 200, y: 350 }, { x: 300, y: 250 }
        ];
        this.waypoints = this.smoothTrackPoints(points);
    }

    generateSilverstone() {
        // Silverstone-inspired fast flowing circuit
        const points = [
            { x: 300, y: 300 }, { x: 500, y: 250 }, { x: 700, y: 250 },
            { x: 900, y: 300 }, { x: 1000, y: 400 }, { x: 950, y: 550 },
            { x: 800, y: 650 }, { x: 600, y: 650 }, { x: 400, y: 600 },
            { x: 250, y: 500 }, { x: 200, y: 400 }
        ];
        this.waypoints = this.smoothTrackPoints(points);
    }

    generateMonza() {
        // Monza-inspired high-speed circuit with long straights
        const points = [
            { x: 300, y: 300 }, { x: 900, y: 300 }, { x: 1000, y: 400 },
            { x: 1000, y: 500 }, { x: 900, y: 600 }, { x: 300, y: 600 },
            { x: 200, y: 500 }, { x: 200, y: 400 }
        ];
        this.waypoints = this.smoothTrackPoints(points);
    }

    generateSuzuka() {
        // Suzuka-inspired figure-8 layout
        const points = [
            { x: 300, y: 300 }, { x: 600, y: 250 }, { x: 800, y: 300 },
            { x: 900, y: 400 }, { x: 850, y: 500 }, { x: 700, y: 550 },
            { x: 500, y: 500 }, { x: 400, y: 400 }, { x: 450, y: 300 },
            { x: 350, y: 450 }, { x: 250, y: 500 }, { x: 200, y: 400 }
        ];
        this.waypoints = this.smoothTrackPoints(points);
    }

    generateSpa() {
        // Spa-inspired elevation changes and fast sections
        const points = [
            { x: 300, y: 350 }, { x: 450, y: 300 }, { x: 650, y: 250 },
            { x: 850, y: 300 }, { x: 1000, y: 400 }, { x: 950, y: 550 },
            { x: 750, y: 650 }, { x: 500, y: 650 }, { x: 300, y: 600 },
            { x: 200, y: 500 }, { x: 200, y: 400 }
        ];
        this.waypoints = this.smoothTrackPoints(points);
    }

    generateRandomTrack() {
        // Procedurally generate a random track
        const numPoints = randomInt(8, 15);
        const centerX = 640;
        const centerY = 360;
        const radiusMin = 200;
        const radiusMax = 400;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radius = randomRange(radiusMin, radiusMax);
            this.waypoints.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        }

        this.waypoints = this.smoothTrackPoints(this.waypoints);
    }

    smoothTrackPoints(points) {
        // Add interpolated points for smoother curves
        const smooth = [];
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            smooth.push(p1);

            // Add intermediate points
            for (let j = 1; j < 5; j++) {
                const t = j / 5;
                smooth.push({
                    x: lerp(p1.x, p2.x, t),
                    y: lerp(p1.y, p2.y, t)
                });
            }
        }
        return smooth;
    }

    generateWalls() {
        // Generate inner and outer walls
        this.walls = [];

        for (let i = 0; i < this.waypoints.length; i++) {
            const p1 = this.waypoints[i];
            const p2 = this.waypoints[(i + 1) % this.waypoints.length];

            // Calculate perpendicular offset
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / length;
            const ny = dx / length;

            // Outer wall
            this.walls.push({
                x1: p1.x + nx * (this.width / 2),
                y1: p1.y + ny * (this.width / 2),
                x2: p2.x + nx * (this.width / 2),
                y2: p2.y + ny * (this.width / 2),
                type: 'outer'
            });

            // Inner wall
            this.walls.push({
                x1: p1.x - nx * (this.width / 2),
                y1: p1.y - ny * (this.width / 2),
                x2: p2.x - nx * (this.width / 2),
                y2: p2.y - ny * (this.width / 2),
                type: 'inner'
            });
        }
    }

    generateCheckpoints() {
        // Create checkpoints at regular intervals
        const numCheckpoints = 6;
        const interval = Math.floor(this.waypoints.length / numCheckpoints);

        for (let i = 0; i < numCheckpoints; i++) {
            const index = i * interval;
            const p = this.waypoints[index];
            this.checkpoints.push({
                x: p.x,
                y: p.y,
                index: i,
                radius: this.width / 2 + 20
            });
        }
    }

    generatePowerUpSpawns() {
        // Create power-up spawn locations
        const numSpawns = 8;
        const interval = Math.floor(this.waypoints.length / numSpawns);

        for (let i = 0; i < numSpawns; i++) {
            const index = i * interval;
            const p = this.waypoints[index];
            this.powerUpSpawns.push({
                x: p.x,
                y: p.y,
                active: true,
                type: null,
                respawnTime: 0
            });
        }
    }

    generateStartPositions() {
        // Create starting grid positions
        const startPoint = this.waypoints[0];
        const nextPoint = this.waypoints[1];

        const dx = nextPoint.x - startPoint.x;
        const dy = nextPoint.y - startPoint.y;
        const angle = Math.atan2(dy, dx);

        const gridWidth = this.width * 0.8;
        const gridSpacing = 60;

        for (let i = 0; i < CONSTANTS.MAX_PLAYERS; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const offsetX = (col - 0.5) * (gridWidth / 2);
            const offsetY = -row * gridSpacing;

            this.startPositions.push({
                x: startPoint.x + offsetX * Math.cos(angle + Math.PI / 2) + offsetY * Math.cos(angle),
                y: startPoint.y + offsetX * Math.sin(angle + Math.PI / 2) + offsetY * Math.sin(angle),
                angle: radiansToDegrees(angle)
            });
        }
    }

    calculateBounds() {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        this.waypoints.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });

        this.bounds = {
            minX: minX - this.width,
            minY: minY - this.width,
            maxX: maxX + this.width,
            maxY: maxY + this.width
        };
    }

    checkWallCollision(car) {
        const carBox = car.getBoundingBox();

        for (const wall of this.walls) {
            if (this.lineRectCollision(wall, carBox)) {
                return true;
            }
        }
        return false;
    }

    lineRectCollision(line, rect) {
        // Check if line segment intersects with rectangle
        return this.lineLineCollision(
            line.x1, line.y1, line.x2, line.y2,
            rect.x, rect.y, rect.x + rect.width, rect.y
        ) || this.lineLineCollision(
            line.x1, line.y1, line.x2, line.y2,
            rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height
        ) || this.lineLineCollision(
            line.x1, line.y1, line.x2, line.y2,
            rect.x + rect.width, rect.y + rect.height, rect.x, rect.y + rect.height
        ) || this.lineLineCollision(
            line.x1, line.y1, line.x2, line.y2,
            rect.x, rect.y + rect.height, rect.x, rect.y
        );
    }

    lineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
        if (denom === 0) return false;

        const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denom;
        const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denom;

        return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
    }

    checkCheckpoint(car) {
        for (const checkpoint of this.checkpoints) {
            const dist = distance(car.position.x, car.position.y, checkpoint.x, checkpoint.y);
            if (dist < checkpoint.radius && checkpoint.index === car.lastCheckpoint + 1) {
                car.checkpointsPassed++;
                car.lastCheckpoint = checkpoint.index;
                return true;
            }
        }

        // Check finish line (checkpoint 0 after last checkpoint)
        if (car.lastCheckpoint === this.checkpoints.length - 1) {
            const startCheckpoint = this.checkpoints[0];
            const dist = distance(car.position.x, car.position.y, startCheckpoint.x, startCheckpoint.y);
            if (dist < startCheckpoint.radius) {
                car.completeLap();
                car.lastCheckpoint = 0;
                return true;
            }
        }

        return false;
    }

    isOffTrack(x, y) {
        // Check if point is on the track
        let minDist = Infinity;

        for (const waypoint of this.waypoints) {
            const dist = distance(x, y, waypoint.x, waypoint.y);
            minDist = Math.min(minDist, dist);
        }

        return minDist > this.width / 2;
    }

    draw(ctx, camera) {
        // Draw off-track (background)
        const patternSize = 100;
        const offsetX = -camera.x % patternSize;
        const offsetY = -camera.y % patternSize;

        ctx.fillStyle = '#0f1012'; // Dark asphalt-like grass for night/modern feel
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear screen with background

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let x = offsetX; x < ctx.canvas.width; x += patternSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
        }
        for (let y = offsetY; y < ctx.canvas.height; y += patternSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
        }
        ctx.stroke();

        // Draw Kerbs (underneath track to handle simple overlap)
        const kerbWidth = this.width + 24; // Slightly wider than track
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        this.waypoints.forEach((p, i) => {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            if (i === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
        });
        ctx.closePath();
        ctx.lineWidth = kerbWidth;
        ctx.strokeStyle = '#e74c3c'; // Red base
        ctx.stroke();

        // White stripes for kerbs
        ctx.beginPath();
        this.waypoints.forEach((p, i) => {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            if (i === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
        });
        ctx.closePath();
        ctx.setLineDash([20, 20]);
        ctx.lineWidth = kerbWidth;
        ctx.strokeStyle = '#ecf0f1'; // White stripes
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw track surface
        ctx.beginPath();
        this.waypoints.forEach((p, i) => {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            if (i === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
        });
        ctx.closePath();
        ctx.strokeStyle = '#2c3e50'; // Dark asphalt
        ctx.lineWidth = this.width;
        ctx.stroke();

        // Draw racing line (faint tire marks)
        ctx.beginPath();
        this.waypoints.forEach((p, i) => {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            if (i === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
        });
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = this.width * 0.8;
        ctx.stroke();

        // Draw center line
        ctx.beginPath();
        this.waypoints.forEach((p, i) => {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            if (i === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
        });
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.setLineDash([40, 60]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw walls/Barriers
        ctx.lineWidth = 6;
        this.walls.forEach(wall => {
            ctx.strokeStyle = '#bdc3c7'; // Metal barrier
            ctx.beginPath();
            ctx.moveTo(wall.x1 - camera.x, wall.y1 - camera.y);
            ctx.lineTo(wall.x2 - camera.x, wall.y2 - camera.y);
            ctx.stroke();
        });

        // Draw Start/Finish Line
        const startPoint = this.waypoints[0];
        const nextPoint = this.waypoints[1];
        const dx = nextPoint.x - startPoint.x;
        const dy = nextPoint.y - startPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / length;
        const ny = dx / length;

        const lineWid = this.width;
        const checkSize = 10;
        const numChecks = Math.floor(lineWid / checkSize);

        ctx.save();
        ctx.translate(startPoint.x - camera.x, startPoint.y - camera.y);
        ctx.rotate(Math.atan2(dy, dx));

        // Draw checks
        for (let row = 0; row < 3; row++) {
            for (let i = -numChecks / 2; i < numChecks / 2; i++) {
                ctx.fillStyle = ((i + row) % 2 === 0) ? '#fff' : '#000';
                ctx.fillRect(row * checkSize - checkSize * 1.5, i * checkSize, checkSize, checkSize);
            }
        }

        ctx.strokeStyle = '#f1c40f'; // Gold line marker
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-checkSize * 2, -lineWid / 2);
        ctx.lineTo(-checkSize * 2, lineWid / 2);
        ctx.stroke();

        ctx.restore();
    }

    drawMinimap(ctx, cars, x, y, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x, y, width, height);

        // Calculate scale
        const scaleX = width / (this.bounds.maxX - this.bounds.minX);
        const scaleY = height / (this.bounds.maxY - this.bounds.minY);
        const scale = Math.min(scaleX, scaleY) * 0.9;

        const offsetX = x + width / 2;
        const offsetY = y + height / 2;

        // Draw track
        ctx.strokeStyle = CONSTANTS.TRACK_COLORS.TRACK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.waypoints.forEach((p, i) => {
            const mx = offsetX + (p.x - (this.bounds.minX + this.bounds.maxX) / 2) * scale;
            const my = offsetY + (p.y - (this.bounds.minY + this.bounds.maxY) / 2) * scale;
            if (i === 0) {
                ctx.moveTo(mx, my);
            } else {
                ctx.lineTo(mx, my);
            }
        });
        ctx.closePath();
        ctx.stroke();

        // Draw cars
        cars.forEach(car => {
            const mx = offsetX + (car.position.x - (this.bounds.minX + this.bounds.maxX) / 2) * scale;
            const my = offsetY + (car.position.y - (this.bounds.minY + this.bounds.maxY) / 2) * scale;

            ctx.fillStyle = car.color;
            ctx.fillRect(mx - 3, my - 3, 6, 6);
        });
    }
}
