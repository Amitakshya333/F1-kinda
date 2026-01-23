// 2D Vector Class
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    
    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }
    
    limit(max) {
        if (this.magnitude() > max) {
            this.normalize();
            this.multiply(max);
        }
        return this;
    }
    
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    
    angle() {
        return Math.atan2(this.y, this.x);
    }
    
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }
    
    distance(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    clone() {
        return new Vector2D(this.x, this.y);
    }
    
    static add(v1, v2) {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y);
    }
    
    static subtract(v1, v2) {
        return new Vector2D(v1.x - v2.x, v1.y - v2.y);
    }
    
    static multiply(v, scalar) {
        return new Vector2D(v.x * scalar, v.y * scalar);
    }
    
    static distance(v1, v2) {
        return v1.distance(v2);
    }
    
    static fromAngle(angle, length = 1) {
        return new Vector2D(Math.cos(angle) * length, Math.sin(angle) * length);
    }
}
