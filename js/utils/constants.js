// Game Constants
const CONSTANTS = {
    // Canvas
    CANVAS_WIDTH: 1280,
    CANVAS_HEIGHT: 720,
    
    // Car Physics
    CAR_WIDTH: 20,
    CAR_HEIGHT: 40,
    MAX_SPEED: 300, // pixels/second
    MIN_SPEED: 0,
    ACCELERATION: 50, // pixels/second²
    DECELERATION: 80,
    BRAKE_FORCE: 150,
    
    // Turning
    TURN_SPEED_SLOW: 5, // degrees/frame
    TURN_SPEED_MEDIUM: 3,
    TURN_SPEED_FAST: 1.5,
    DRIFT_FRICTION: 0.95,
    
    // Collision
    WALL_COLLISION_SPEED_LOSS: 0.7,
    CAR_COLLISION_SPEED_LOSS: 0.5,
    OFFTRACK_SPEED_MULTIPLIER: 0.6,
    COLLISION_BOUNCE: 0.3,
    
    // Track
    TRACK_COLORS: {
        TRACK: '#2c3e50',
        GRASS: '#27ae60',
        GRAVEL: '#d4a574',
        BARRIER: '#e74c3c',
        LINE_WHITE: '#ffffff',
        START_FINISH: '#f0f0f0'
    },
    
    // Teams/Cars
    TEAMS: [
        { name: 'Ferrari', color: '#DC0000', number: 16 },
        { name: 'Red Bull', color: '#0600EF', number: 1 },
        { name: 'Mercedes', color: '#00D2BE', number: 44 },
        { name: 'McLaren', color: '#FF8700', number: 4 },
        { name: 'Alpine', color: '#0090FF', number: 10 },
        { name: 'Aston Martin', color: '#006F62', number: 14 },
        { name: 'Williams', color: '#005AFF', number: 23 },
        { name: 'AlphaTauri', color: '#2B4562', number: 22 }
    ],
    
    // Power-ups
    POWERUP_TYPES: {
        BOOST: {
            name: 'Boost',
            duration: 2000, // ms
            speedMultiplier: 1.5,
            color: '#3498db'
        },
        SHIELD: {
            name: 'Shield',
            duration: 5000,
            color: '#9b59b6'
        },
        OIL: {
            name: 'Oil Slick',
            duration: 2000,
            color: '#34495e'
        },
        EMP: {
            name: 'EMP',
            radius: 200,
            duration: 3000,
            color: '#e67e22'
        },
        TELEPORT: {
            name: 'Teleport',
            distance: 200,
            color: '#1abc9c'
        },
        GHOST: {
            name: 'Ghost',
            duration: 3000,
            color: '#95a5a6'
        }
    },
    
    // Game Settings
    FPS: 60,
    DELTA_TIME: 1 / 60,
    TOTAL_LAPS: 3,
    POWERUP_RESPAWN_TIME: 10000, // ms
    
    // Network
    NETWORK_UPDATE_RATE: 20, // Hz
    MAX_PLAYERS: 8,
    ROOM_CODE_LENGTH: 6,
    
    // Audio
    VOLUME: {
        MASTER: 0.7,
        MUSIC: 0.5,
        SFX: 0.8
    }
};

// Track Definitions
const TRACKS = {
    MONACO: {
        name: 'Monaco Street Circuit',
        difficulty: 'Beginner',
        width: 120,
        length: 2000,
        turns: 15,
        description: 'Tight hairpins and chicanes'
    },
    SILVERSTONE: {
        name: 'Silverstone',
        difficulty: 'Intermediate',
        width: 150,
        length: 2500,
        turns: 18,
        description: 'High-speed corners'
    },
    MONZA: {
        name: 'Monza',
        difficulty: 'Speed Track',
        width: 180,
        length: 2800,
        turns: 11,
        description: 'Long straights for high speeds'
    },
    SUZUKA: {
        name: 'Suzuka',
        difficulty: 'Advanced',
        width: 140,
        length: 2600,
        turns: 18,
        description: 'Figure-8 layout with technical sections'
    },
    SPA: {
        name: 'Spa-Francorchamps',
        difficulty: 'Expert',
        width: 150,
        length: 3000,
        turns: 19,
        description: 'Fast and technical combination'
    },
    CUSTOM: {
        name: 'Random Track',
        difficulty: 'Variable',
        width: 150,
        length: 2500,
        turns: 15,
        description: 'Procedurally generated'
    }
};

// Controls
const CONTROLS = {
    PLAYER1: {
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        POWERUP: ' ' // Space
    },
    PLAYER2: {
        UP: 'w',
        DOWN: 's',
        LEFT: 'a',
        RIGHT: 'd',
        POWERUP: 'Shift'
    },
    GENERAL: {
        PAUSE: 'Escape',
        RESTART: 'r'
    }
};
