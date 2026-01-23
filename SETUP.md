# F1 2D Racing Game - Setup & Play Guide

## 🎮 Quick Start (No Installation Required)

### Option 1: Direct Browser Play
1. Simply double-click `index.html` to open the game in your browser
2. Select "Single Player" or "Local Multiplayer" to start racing!
3. That's it! No installation needed for basic gameplay.

## 🌐 Full Setup (With Multiplayer)

### Prerequisites
- **Node.js** v14 or higher ([Download here](https://nodejs.org/))
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Game Server** (for serving game files)
   ```bash
   npm run serve
   ```
   The game will be available at: http://localhost:8080

3. **Start the Multiplayer Server** (in a separate terminal)
   ```bash
   npm start
   ```
   The WebSocket server will run on: ws://localhost:3000

4. **Open Your Browser**
   - Navigate to: http://localhost:8080
   - Or open multiple tabs to test multiplayer locally

## 🎯 How to Play

### Single Player Mode
1. Click "Single Player" from main menu
2. Select a track (Monaco, Silverstone, Monza, Suzuka, or Spa)
3. Choose your F1 team
4. Wait for countdown (5 red lights)
5. Race begins when lights go out!
6. Complete 3 laps as fast as possible

### Local Multiplayer Mode
1. Click "Local Multiplayer"
2. Select track and teams
3. Player 1: Arrow keys + Spacebar
4. Player 2: WASD + Shift
5. Race together on the same screen!

### Online Multiplayer Mode
1. Click "Online Multiplayer"
2. **To Host:**
   - Click "Create Room"
   - Share the 6-character room code with friends
   - Wait for players to join
   - Everyone clicks "Ready"
   - Host clicks "Start Race"
3. **To Join:**
   - Click "Join Room"
   - Enter the room code
   - Click "Ready" when ready
   - Wait for host to start

## 🕹️ Controls

### Player 1 (Single Player / Local P1)
- **↑** (Up Arrow) - Accelerate
- **↓** (Down Arrow) - Brake/Reverse
- **←** (Left Arrow) - Turn left
- **→** (Right Arrow) - Turn right
- **Spacebar** - Use power-up
- **Escape** - Pause game

### Player 2 (Local Multiplayer)
- **W** - Accelerate
- **S** - Brake/Reverse
- **A** - Turn left
- **D** - Turn right
- **Shift** - Use power-up

### Tips
- Hold brake + turn for drifting
- Use power-ups strategically
- Stay on track for maximum speed
- Watch the minimap for positioning

## 🎁 Power-ups

| Icon | Name | Effect | Duration |
|------|------|--------|----------|
| ⚡ | Boost | 50% speed increase | 2 seconds |
| 🛡️ | Shield | Invulnerability | 5 seconds |
| 💧 | Oil Slick | Spin opponents | 2 seconds |
| ⚠️ | EMP | Stun nearby cars (200px radius) | 3 seconds |
| ↑ | Teleport | Skip ahead 200px | Instant |
| 👻 | Ghost | Phase through cars | 3 seconds |

## 🏁 Tracks

### 1. Monaco Street Circuit (Beginner)
- **Difficulty:** ⭐⭐☆☆☆
- **Features:** Tight hairpins, chicanes
- **Best for:** Learning controls

### 2. Silverstone (Intermediate)
- **Difficulty:** ⭐⭐⭐☆☆
- **Features:** High-speed corners
- **Best for:** Practicing racing lines

### 3. Monza (Speed Track)
- **Difficulty:** ⭐⭐☆☆☆
- **Features:** Long straights
- **Best for:** High-speed racing

### 4. Suzuka (Advanced)
- **Difficulty:** ⭐⭐⭐⭐☆
- **Features:** Figure-8 layout
- **Best for:** Experienced racers

### 5. Spa-Francorchamps (Expert)
- **Difficulty:** ⭐⭐⭐⭐⭐
- **Features:** Mixed sections
- **Best for:** Championship challenges

### 6. Random Track
- **Difficulty:** Variable
- **Features:** Procedurally generated
- **Best for:** Variety and replayability

## 🏎️ F1 Teams

| Team | Color | Number | Style |
|------|-------|--------|-------|
| Ferrari | Red (#DC0000) | 16 | Aggressive |
| Red Bull | Blue (#0600EF) | 1 | Championship |
| Mercedes | Teal (#00D2BE) | 44 | Dominant |
| McLaren | Orange (#FF8700) | 4 | Classic |
| Alpine | Blue (#0090FF) | 10 | French |
| Aston Martin | Green (#006F62) | 14 | British |
| Williams | Blue (#005AFF) | 23 | Historic |
| AlphaTauri | Navy (#2B4562) | 22 | Italian |

*Note: All cars have identical performance for balanced gameplay*

## 🔧 Troubleshooting

### Game won't load
```bash
# Clear browser cache
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Multiplayer connection issues
```bash
# Check if server is running
npm start

# Check port availability
netstat -ano | findstr :3000

# Try different browser
```

### Performance issues
- Close unnecessary browser tabs
- Check FPS counter (bottom-left)
- Lower browser zoom to 100%
- Try incognito/private mode

### Controls not working
- Click on game canvas first
- Check if page has focus
- Refresh the page (F5)

## 📊 Game Statistics

The game tracks:
- Best lap times per track
- Total races completed
- Win/loss ratio
- Favorite track
- Total distance driven

Stats are saved in browser localStorage.

## 🎓 Pro Tips

### Racing Techniques
1. **Brake before turns** - Don't carry too much speed into corners
2. **Apex clipping** - Hit the inside of corners for faster lines
3. **Throttle control** - Feather the throttle on corner exit
4. **Use the whole track** - Wider lines = faster speeds
5. **Defensive driving** - Block overtaking attempts

### Power-up Strategy
- **Save Boost** for straights, not corners
- **Use Shield** when in traffic
- **Drop Oil** before tight corners
- **EMP** works best in packs
- **Teleport** can skip chicanes
- **Ghost** for overtaking on straights

### Multiplayer Tactics
- **Qualify well** - Starting position matters
- **Draft opponents** - Follow closely for speed boost
- **Protect position** - Block passing lanes
- **Pit strategy** - Time power-up collection
- **Mind games** - Fake overtake attempts

## 🚀 Advanced Features

### Custom Tracks (Coming Soon)
Create your own tracks with the track editor!

### Replay System (Planned)
Record and share your best races.

### Achievements (In Development)
Unlock badges for accomplishments:
- Speed Demon: Complete lap under target time
- Clean Racer: Finish without collision
- Comeback King: Win from 5th place
- Perfect Lap: No track limits violations

## 📱 Mobile Support (Future Update)
Touch controls and mobile-optimized UI coming soon!

## 🤝 Contributing

Want to add features? Check out:
1. `README.md` - Project overview
2. `CONTRIBUTING.md` - Contribution guidelines
3. `docs/` - Technical documentation

## 📄 License

MIT License - Feel free to modify and distribute!

## 🎉 Have Fun!

Remember: It's not about winning, it's about having fun!

...but winning is pretty fun too. 🏆

---

**Need help?** Open an issue on GitHub or contact support.

**Found a bug?** Please report it with steps to reproduce.

**Have suggestions?** We'd love to hear your ideas!
