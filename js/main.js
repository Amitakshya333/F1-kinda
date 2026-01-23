// Main Entry Point
console.log('F1 2D Racing Game - Loading...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready - Initializing game...');
    
    // Check for room code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    
    // Create game instance
    const game = new Game();
    
    // Auto-join room if code in URL
    if (roomCode) {
        game.uiManager.showScreen('online-lobby');
        game.uiManager.showJoinRoomInterface();
        document.getElementById('room-code-input').value = roomCode;
    }
    
    // Handle visibility change (pause when tab not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.gameState.isRacing()) {
            game.togglePause();
        }
    });
    
    // Prevent arrow keys from scrolling page
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    console.log('Game ready! Select a mode to start racing.');
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
