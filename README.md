# F1 2D Racing Game

A modern Formula 1 inspired 2D racing game built with HTML5 Canvas and vanilla JavaScript.

## 🏎️ Features

- **Single Player Mode**: Race against the clock
- **Local Multiplayer**: Split-screen racing with friends
- **Online Multiplayer**: Race with players worldwide (coming soon)
- **Multiple Tracks**: Monaco, Silverstone, Monza, Suzuka, Spa, and more
- **8 F1 Teams**: Choose from Ferrari, Red Bull, Mercedes, McLaren, Alpine, Aston Martin, Williams, and AlphaTauri
- **Power-ups**: Boost, Shield, Ghost, Teleport, Oil Slick, and EMP
- **Realistic Physics**: Drift mechanics, collision detection, and track boundaries
- **Modern UI**: Beautiful carbon fiber themed interface with smooth animations

## 🎮 Controls

### Player 1 (Keyboard)
- **Arrow Keys**: Steer and accelerate/brake
- **Space**: Use power-up
- **Escape**: Pause game

### Player 2 (Local Multiplayer)
- **WASD**: Steer and accelerate/brake
- **Shift**: Use power-up

## 🚀 Getting Started

### Play Online
Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari).

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/f1-2d-racing-game.git
cd f1-2d-racing-game
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

3. Navigate to `http://localhost:8000`

## 📁 Project Structure

```
f1-2d-racing-game/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Game styling
├── js/
│   ├── core/              # Core game classes
│   │   ├── Car.js         # Car physics and rendering
│   │   ├── Track.js       # Track generation and rendering
│   │   ├── PowerUp.js     # Power-up system
│   │   ├── Camera.js      # Camera follow system
│   │   ├── Vector2D.js    # Vector math utilities
│   │   └── CollisionDetector.js
│   ├── game/              # Game management
│   │   ├── Game.js        # Main game loop
│   │   └── GameState.js   # Game state management
│   ├── managers/          # System managers
│   │   ├── UIManager.js   # UI and menu system
│   │   ├── InputManager.js # Keyboard input
│   │   ├── AudioManager.js # Sound effects
│   │   └── NetworkManager.js # Online multiplayer
│   ├── utils/             # Utilities
│   │   ├── constants.js   # Game constants
│   │   └── helpers.js     # Helper functions
│   └── main.js            # Entry point
└── README.md
```

## 🎨 Graphics Features

- **Enhanced Visuals**: Modern F1 car designs with detailed rendering
- **Dynamic Track Elements**: Kerbs, rumble strips, and checkered finish lines
- **Visual Effects**: Tire smoke, collision sparks, boost flames
- **Power-up Effects**: Glowing animations and particle systems
- **Responsive HUD**: Real-time speed, lap times, and position tracking

## 🛠️ Technologies

- **HTML5 Canvas**: For game rendering
- **Vanilla JavaScript**: No frameworks, pure performance
- **CSS3**: Modern UI with animations and gradients
- **WebSocket** (planned): For online multiplayer

## 📝 Game Modes

### Single Player
Race against the clock on various F1-inspired tracks. Complete 3 laps as fast as possible!

### Local Multiplayer
Split-screen racing for 2 players on the same device.

### Online Multiplayer (Coming Soon)
Create or join rooms to race with players around the world.

## 🎯 Roadmap

- [ ] AI opponents for single player
- [ ] Time trial leaderboards
- [ ] More tracks and teams
- [ ] Custom track editor
- [ ] Mobile touch controls
- [ ] Sound effects and music
- [ ] Replay system
- [ ] Weather conditions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Credits

Developed with ❤️ by AMITAKSHYA SUTAR

Inspired by classic F1 games and modern web technologies.

---

**Enjoy the race!** 🏁
