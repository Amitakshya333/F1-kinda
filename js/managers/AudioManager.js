// Audio Manager
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.enabled = true;
        this.volume = CONSTANTS.VOLUME.MASTER;
        
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }
    
    // Simple beep generator for now (no external audio files needed)
    createBeep(frequency, duration, type = 'sine') {
        if (!this.audioContext || !this.enabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(this.volume * CONSTANTS.VOLUME.SFX, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playEngine(speed) {
        // Varying engine sound based on speed
        const baseFreq = 100;
        const speedRatio = speed / CONSTANTS.MAX_SPEED;
        const frequency = baseFreq + (speedRatio * 200);
        
        // This would be continuous in a real implementation
        // For now, just a concept
    }
    
    playCollision() {
        this.createBeep(150, 0.1, 'square');
    }
    
    playPowerUp() {
        this.createBeep(800, 0.2, 'sine');
        setTimeout(() => this.createBeep(1000, 0.2, 'sine'), 100);
    }
    
    playLapComplete() {
        this.createBeep(600, 0.15, 'sine');
        setTimeout(() => this.createBeep(700, 0.15, 'sine'), 150);
        setTimeout(() => this.createBeep(800, 0.2, 'sine'), 300);
    }
    
    playRaceStart() {
        this.createBeep(400, 0.3, 'square');
    }
    
    playCountdown() {
        this.createBeep(600, 0.2, 'sine');
    }
    
    playTireScreech() {
        this.createBeep(200, 0.3, 'sawtooth');
    }
    
    playBoost() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createBeep(400 + i * 100, 0.05, 'sine');
            }, i * 50);
        }
    }
    
    setVolume(volume) {
        this.volume = clamp(volume, 0, 1);
    }
    
    toggle() {
        this.enabled = !this.enabled;
    }
    
    mute() {
        this.enabled = false;
    }
    
    unmute() {
        this.enabled = true;
    }
}
