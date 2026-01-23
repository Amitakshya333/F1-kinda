// Game State Management
class GameState {
    constructor() {
        this.state = 'MENU'; // MENU, COUNTDOWN, RACING, PAUSED, FINISHED
        this.mode = null; // single-player, local-multiplayer, online-multiplayer
        this.selectedTrack = null;
        this.selectedTeams = [];
        this.raceStarted = false;
        this.raceFinished = false;
        this.winner = null;
    }
    
    setState(newState) {
        this.state = newState;
        console.log(`Game state changed to: ${newState}`);
    }
    
    setMode(mode) {
        this.mode = mode;
        console.log(`Game mode set to: ${mode}`);
    }
    
    setTrack(trackKey) {
        this.selectedTrack = trackKey;
    }
    
    addTeam(team) {
        this.selectedTeams.push(team);
    }
    
    reset() {
        this.state = 'MENU';
        this.raceStarted = false;
        this.raceFinished = false;
        this.winner = null;
    }
    
    startRace() {
        this.setState('COUNTDOWN');
        this.raceStarted = true;
    }
    
    beginRacing() {
        this.setState('RACING');
    }
    
    pause() {
        if (this.state === 'RACING') {
            this.setState('PAUSED');
            return true;
        }
        return false;
    }
    
    resume() {
        if (this.state === 'PAUSED') {
            this.setState('RACING');
            return true;
        }
        return false;
    }
    
    finishRace(winner) {
        this.setState('FINISHED');
        this.raceFinished = true;
        this.winner = winner;
    }
    
    isRacing() {
        return this.state === 'RACING';
    }
    
    isPaused() {
        return this.state === 'PAUSED';
    }
    
    isFinished() {
        return this.state === 'FINISHED';
    }
}
