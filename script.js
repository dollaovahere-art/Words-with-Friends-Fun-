// AUDIO SYSTEM OVERRIDE PREFERENCES CONFIGURATION MATRIX
let isAppAudioSystemMutedGlobal = false;

function toggleAppAudioMuteSystem() {
    isAppAudioSystemMutedGlobal = !isAppAudioSystemMutedGlobal;
    const iconSvg = document.getElementById('mute-icon-svg');
    
    if (isAppAudioSystemMutedGlobal) {
        // Redraw to Muted speaker path layout configuration matrix icon
        iconSvg.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l7 7v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
        document.getElementById('master-mute-toggle-btn').style.opacity = '0.5';
    } else {
        // Redraw to Active sounding wave speaker graphic engine index
        iconSvg.innerHTML = `<path d="M3 9v6h4l7 7V2L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
        document.getElementById('master-mute-toggle-btn').style.opacity = '1.0';
        AudioSynthEngine.playClick(); // Play instant indicator tone verifying activation
    }
}

const AudioSynthEngine = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    playClick() {
        if (isAppAudioSystemMutedGlobal) return; // Immediate Master Refusal if Muted
        this.init(); let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08); osc.start(); osc.stop(this.ctx.currentTime + 0.08);
    },
    playSuccess() {
        if (isAppAudioSystemMutedGlobal) return; // Immediate Master Refusal if Muted
        this.init(); const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
            let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.1)); gain.gain.setValueAtTime(0.2, this.ctx.currentTime + (idx * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.1) + 0.25); osc.start(this.ctx.currentTime + (idx * 0.1)); osc.stop(this.ctx.currentTime + (idx * 0.1) + 0.25);
        });
    },
    playError() {
        if (isAppAudioSystemMutedGlobal) return; // Immediate Master Refusal if Muted
        this.init(); let osc = this.ctx.createOscillator(); let gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110.00, this.ctx.currentTime); gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3); osc.start(); osc.stop(this.ctx.currentTime + 0.3);
    }
};
const DICTIONARY_DATABASE = {
    "HELLO": "An expression of greeting used to acknowledge or welcome someone.",
    "WORLD": "The earth, together with all of its countries, peoples, and natural features.",
    "PLAY": "Engage in an activity for enjoyment or competitive points value.",
    "WORDS": "Elements of speech or writing used as structural tokens in combinations.",
    "GAME": "A competitive form of play governed by rules and tracking score indexes.",
    "DUEL": "A contest or structured match sequence between two competitors.",
    "TILES": "Flat rectangular blocks bearing letters used inside scrabble boards.",
    "HUSH": "Make quiet; suppress mention or call an immediate calm sequence.",
    "DIETS": "The kinds of food that a person, animal, or community habitually eats.",
    "VIBED": "Transmitted or responded with a specific emotional aura or feeling.",
    "HOMER": "A home run in baseball, or a classical Greek epic poet storyteller.",
    "MOW": "Cut down grass or a grain crop using a machine scythe tool.",
    "PAN": "A metal container used for cooking food, or to spin a viewport frame.",
    "REEFY": "Abounding with sandbanks or jagged coral ridges underwater.",
    "ZAG": "A sharp change of direction in a continuous path alignment row.",
    "MAGIC": "The power of apparently influencing events by using mysterious forces."
};
const DICTIONARY = Object.keys(DICTIONARY_DATABASE);

const TILE_BAG_LEDGER = {
    "A": 9, "B": 2, "C": 2, "D": 4, "E": 12, "F": 2, "G": 3, "H": 2, "I": 9, 
    "M": 2, "N": 6, "O": 8, "P": 2, "R": 6, "S": 4, "T": 6, "U": 4, "W": 2, "Z": 1
};

const DatabaseEngine = {
    getStats() {
        const existing = localStorage.getItem('word_duel_db_stats');
        if (existing) return JSON.parse(existing);
        const defaultSchema = {
            player: { name: "Player One", wins: 277, totalGames: 350, highestScore: 576, totalScoreSum: 127225, averageScore: 363.5, averageMoveVs: 20.6, liveScore: 346, avatar: "" },
            elma: { name: "Elma.b", wins: 64, totalGames: 350, highestScore: 464, totalScoreSum: 106295, averageScore: 303.7, averageMoveVs: 17.1, liveScore: 280 },
            matchLogs: [
                { id: 101, opponent: "Elma.b", playerFinal: 395, opponentFinal: 310, status: "WIN", date: "Sep 20, 2026" },
                { id: 102, opponent: "Michael R.", playerFinal: 342, opponentFinal: 355, status: "LOSS", date: "Sep 22, 2026" }
            ],
            turnExpirationTime: null
        };
        localStorage.setItem('word_duel_db_stats', JSON.stringify(defaultSchema));
        return defaultSchema;
    },
    updatePlayerName(newName) {
        const stats = this.getStats(); stats.player.name = newName; localStorage.setItem('word_duel_db_stats', JSON.stringify(stats));
    },
    updatePlayerAvatar(base64Image) {
        const stats = this.getStats(); stats.player.avatar = base64Image; localStorage.setItem('word_duel_db_stats', JSON.stringify(stats));
    },
    addPlayerScore(points) {
        const stats = this.getStats(); stats.player.liveScore += points; localStorage.setItem('word_duel_db_stats', JSON.stringify(stats));
        document.getElementById('live-score-p1').innerText = stats.player.liveScore;
        if (stats.player.liveScore >= 400) setTimeout(() => triggerVictoryScreen('player'), 600);
    },
    recordMatchConclusion(winnerKey, isTimeout = false) {
        const stats = this.getStats();
        const logEntry = {
            id: Date.now(), opponent: isTimeout ? "Forfeit Timeout" : "Elma.b", playerFinal: isTimeout ? 0 : (stats.player.liveScore || 346), opponentFinal: isTimeout ? 400 : (stats.elma.liveScore || 280),
            status: winnerKey === 'player' ? "WIN" : "LOSS", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        stats.matchLogs.unshift(logEntry);
        stats.player.totalGames += 1; stats.elma.totalGames += 1; stats.player.totalScoreSum += logEntry.playerFinal; stats.elma.totalScoreSum += logEntry.opponentFinal;
        if(logEntry.playerFinal > stats.player.highestScore) stats.player.highestScore = logEntry.playerFinal;
        if(logEntry.opponentFinal > stats.elma.highestScore) stats.elma.highestScore = logEntry.opponentFinal;
        if (winnerKey === 'player') stats.player.wins += 1; else stats.elma.wins += 1;
        stats.player.averageScore = parseFloat((stats.player.totalScoreSum / stats.player.totalGames).toFixed(1)); stats.elma.averageScore = parseFloat((stats.elma.totalScoreSum / stats.elma.totalGames).toFixed(1));
        stats.player.liveScore = 0; stats.elma.liveScore = 0; stats.turnExpirationTime = null;
        localStorage.setItem('word_duel_db_stats', JSON.stringify(stats));
        document.getElementById('live-score-p1').innerText = 0; document.getElementById('live-score-p2').innerText = 0;
    }
};

const ConfettiEngine = {
    canvas: null, ctx: null, particles: [], animationFrame: null,
    init() {
        if (this.canvas) return;
        this.canvas = document.createElement('canvas'); this.canvas.style.position = 'absolute'; this.canvas.style.top = '0'; this.canvas.style.left = '0'; this.canvas.style.width = '100%'; this.canvas.style.height = '100%'; this.canvas.style.pointerEvents = 'none'; this.canvas.style.zIndex = '999';
        document.getElementById('board-click-wrapper').appendChild(this.canvas); this.ctx = this.canvas.getContext('2d');
    },
    burst() {
        this.init(); this.canvas.width = this.canvas.offsetWidth; this.canvas.height = this.canvas.offsetHeight;
        const colors = ['#22c55e', '#3b82f6', '#ef4444', '#eab308', '#a855f7', '#f97316'];
        for (let i = 0; i < 75; i++) { this.particles.push({ x: this.canvas.width / 2, y: this.canvas.height / 2, radius: Math.random() * 4 + 2, color: colors[Math.floor(Math.random() * colors.length)], vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.7) * 12, alpha: 1 }); }
        if (!this.animationFrame) this.update();
    },
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); let liveParticles = false;
        this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.alpha -= 0.015; if (p.alpha > 0) { liveParticles = true; this.ctx.save(); this.ctx.globalAlpha = p.alpha; this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); this.ctx.fillStyle = p.color; this.ctx.fill(); this.ctx.restore(); } });
        if (liveParticles) this.animationFrame = requestAnimationFrame(() => this.update()); else { cancelAnimationFrame(this.animationFrame); this.animationFrame = null; this.particles = []; }
    }
};

function triggerVictoryScreen(winnerKey, isForfeit = false) {
    AudioSynthEngine.playSuccess(); if (!isForfeit) ConfettiEngine.burst();
    const overlay = document.createElement('div'); overlay.style.position = 'absolute'; overlay.style.inset = '0'; overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.95)'; overlay.style.zIndex = '5000'; overlay.style.display = 'flex'; overlay.style.flexDirection = 'column'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.color = '#fff'; overlay.style.padding = '24px'; overlay.style.textAlign = 'center';
    overlay.innerHTML = `<h1 style="color: ${isForfeit ? '#ef4444' : '#eab308'}; font-size: 28px; margin-bottom: 8px;">${isForfeit ? '❌ TURN EXPIRED' : '👑 MATCH COMPLETED!'}</h1><p style="font-size: 15px; margin-bottom: 24px; color:#cbd5e1;">${isForfeit ? 'Forfeited.' : 'Threshold of 400 Points Broken!'}</p><button id="close-victory-btn" style="background:#3b82f6; color:#fff; border:none; padding:12px 32px; border-radius:24px; font-weight:bold; font-size:16px; cursor:pointer;">Return to Homepage</button>`;
    document.getElementById('screen-game').appendChild(overlay);
    document.getElementById('close-victory-btn').addEventListener('click', () => { overlay.remove(); if (!isForfeit) DatabaseEngine.recordMatchConclusion(winnerKey); navigateView('home'); });
}
let turnTimerInterval = null;

function restartTurnTimeoutCountdown() {
    clearInterval(turnTimerInterval); const stats = DatabaseEngine.getStats(); const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    if (!stats.turnExpirationTime) { stats.turnExpirationTime = Date.now() + THREE_DAYS_MS; localStorage.setItem('word_duel_db_stats', JSON.stringify(stats)); }
    const timerBanner = document.getElementById('score-preview-banner');
    turnTimerInterval = setInterval(() => {
        const timeLeft = stats.turnExpirationTime - Date.now();
        if (timeLeft <= 0) { clearInterval(turnTimerInterval); DatabaseEngine.recordMatchConclusion('elma', true); triggerVictoryScreen('elma', true); return; }
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)), hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)), seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const currentPlacements = calculateLiveTurnScore();
        if (!currentPlacements.word) {
            timerBanner.innerText = `Time Remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
            const percentage = (timeLeft / THREE_DAYS_MS) * 100, fillMeter = document.getElementById('strength-fill-meter'), labelText = document.getElementById('strength-label-text');
            fillMeter.style.width = `${percentage}%`; fillMeter.style.backgroundColor = percentage > 20 ? '#3b82f6' : '#ef4444';
            labelText.innerText = "Clock Ticking"; labelText.style.color = percentage > 20 ? '#64748b' : '#ef4444';
        }
    }, 1000);
}

const TW_COORDS = ["0,0", "0,7", "0,14", "7,0", "7,14", "14,0", "14,7", "14,14"];
const DW_COORDS = ["1,1", "2,2", "3,3", "4,4", "1,13", "2,12", "3,11", "4,10", "13,1", "12,2", "11,3", "10,4", "13,13", "12,12", "11,11", "10,10"];
const TL_COORDS = ["1,5", "1,9", "5,1", "5,5", "5,9", "5,13", "9,1", "9,5", "9,9", "9,13", "13,5", "13,9"];
const DL_COORDS = ["0,3", "0,11", "2,6", "2,8", "3,0", "3,14", "6,2", "6,6", "6,8", "6,12", "7,3", "7,11", "8,2", "8,6", "8,8", "8,12", "11,0", "11,14", "12,6", "12,8", "14,3", "14,11"];

let activeRackLetters = [
    { id: "t1", letter: "W", points: 4 }, { id: "t2", letter: "O", points: 1 }, { id: "t3", letter: "R", points: 1 }, { id: "t4", letter: "D", points: 2 }, { id: "t5", letter: "G", points: 2 }, { id: "t6", letter: "A", points: 1 }, { id: "t7", letter: "M", points: 3 }
];

function buildInteractiveMatrix() {
    const boardContainer = document.getElementById('main-scrabble-board'); boardContainer.innerHTML = '';
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const coordKey = `${r},${c}`, cell = document.createElement('div'); cell.classList.add('board-cell'); cell.dataset.row = r; cell.dataset.col = c;
            if (r === 7 && c === 7) { cell.classList.add('center-star'); cell.innerText = '★'; }
            else if (TW_COORDS.includes(coordKey)) { cell.classList.add('tw'); cell.innerText = 'TW'; }
            else if (DW_COORDS.includes(coordKey)) { cell.classList.add('dw'); cell.innerText = 'DW'; }
            else if (TL_COORDS.includes(coordKey)) { cell.classList.add('tl'); cell.innerText = 'TL'; }
            else if (DL_COORDS.includes(coordKey)) { cell.classList.add('dl'); cell.innerText = 'DL'; }
            cell.addEventListener('dragover', (e) => e.preventDefault()); cell.addEventListener('drop', (e) => handleTileDropOnCell(e, cell)); boardContainer.appendChild(cell);
        }
    }
}

function renderPlayerRackSlots() {
    const rackContainer = document.getElementById('live-rack-container'); rackContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const slot = document.createElement('div'); slot.classList.add('rack-slot'); slot.dataset.slotIndex = i; slot.addEventListener('dragover', (e) => e.preventDefault()); slot.addEventListener('drop', (e) => handleTileDropOnRackSlot(e, slot));
        const matchingLetter = activeRackLetters[i]; if (matchingLetter && !matchingLetter.placedCoord) slot.appendChild(createTileElement(matchingLetter));
        rackContainer.appendChild(slot);
    }
}

function createTileElement(tileData) {
    const tileEl = document.createElement('div'); tileEl.classList.add('letter-tile'); tileEl.setAttribute('draggable', 'true'); tileEl.id = tileData.id; tileEl.innerHTML = `${tileData.letter}<span class="points-val">${tileData.points}</span>`;
    tileEl.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', tileData.id));
    tileEl.addEventListener('click', (e) => { if (tileData.placedCoord) { e.stopPropagation(); tileData.placedCoord = null; AudioSynthEngine.playClick(); buildInteractiveMatrix(); restoreUnplacedTilesToBoardView(); renderPlayerRackSlots(); calculateLiveTurnScore(); } });
    return tileEl;
}

function restoreUnplacedTilesToBoardView() { activeRackLetters.forEach(t => { if (t.placedCoord) { const split = t.placedCoord.split(','); const cell = document.querySelector(`[data-row="${split[0]}"][data-col="${split[1]}"]`); if (cell) cell.appendChild(createTileElement(t)); } }); }
function openSelectiveSwapTradePanel() {
    toggleDrawerAction(false); AudioSynthEngine.playClick();
    const overlay = document.createElement('div'); overlay.id = 'tile-swap-desk-overlay'; overlay.style.position = 'absolute'; overlay.style.inset = '0'; overlay.style.backgroundColor = 'rgba(30, 41, 59, 0.95)'; overlay.style.zIndex = '4000'; overlay.style.padding = '20px'; overlay.style.color = '#fff';
    overlay.innerHTML = `<h2 style="text-align:center; color:#38bdf8; margin-bottom:12px;">🔄 Tile Swapping Exchange</h2><div id="swap-rack-picker" style="display:flex; justify-content:center; gap:8px; margin-bottom:24px; height:50px;"></div><div style="display:flex; gap:12px;"><button id="cancel-swap-btn" style="flex:1; background:#475569; color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold;">Cancel</button><button id="confirm-swap-btn" style="flex:1; background:#22c55e; color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold;">Trade Letters</button></div>`;
    document.getElementById('screen-game').appendChild(overlay); const picker = document.getElementById('swap-rack-picker'); let selected = [];
    activeRackLetters.forEach(t => { if (!t.placedCoord) { const node = document.createElement('div'); node.style.width = '44px'; node.style.height = '44px'; node.style.background = '#2b95d6'; node.style.borderRadius = '4px'; node.style.display = 'flex'; node.style.alignItems = 'center'; node.style.justifyContent = 'center'; node.style.fontWeight = 'bold'; node.style.cursor = 'pointer'; node.style.border = '2px solid transparent'; node.innerText = t.letter; node.addEventListener('click', () => { AudioSynthEngine.playClick(); if(selected.includes(t.id)){ selected = selected.filter(id=>id!==t.id); node.style.borderColor='transparent'; }else{ selected.push(t.id); node.style.borderColor='#eab308'; }}); picker.appendChild(node); } });
    document.getElementById('cancel-swap-btn').addEventListener('click', () => overlay.remove());
    document.getElementById('confirm-swap-btn').addEventListener('click', () => {
        if(selected.length===0) return; AudioSynthEngine.playSuccess(); activeRackLetters = activeRackLetters.filter(t => { if(selected.includes(t.id)){ if(TILE_BAG_LEDGER[t.letter]!==undefined) TILE_BAG_LEDGER[t.letter]++; return false; } return true; });
        while(activeRackLetters.length < 7) { const keys = Object.keys(TILE_BAG_LEDGER).filter(k=>TILE_BAG_LEDGER[k]>0); const randL = keys[Math.floor(Math.random()*keys.length)]; TILE_BAG_LEDGER[randL]--; activeRackLetters.push({ id:"t_"+Math.random().toString(36).substr(2,4), letter:randL, points:1 }); }
        overlay.remove(); populateTileBagView(); buildInteractiveMatrix(); renderPlayerRackSlots(); calculateLiveTurnScore();
    });
}

function injectAvatarUploaderWidgetMarkup(parentElement) {
    const wrapper = document.createElement('div'); wrapper.style.marginTop = '15px'; wrapper.style.background = '#f8fafc'; wrapper.style.padding = '12px'; wrapper.style.borderRadius = '8px'; wrapper.style.border = '1px dashed #cbd5e1';
    wrapper.innerHTML = `<label style="font-size:12px; font-weight:bold; color:#475569; display:block; margin-bottom:6px;">📷 Upload Custom Profile Image Picture:</label><input type="file" id="avatar-file-input" accept="image/*" style="font-size:12px; width:100%;">`; parentElement.appendChild(wrapper);
    document.getElementById('avatar-file-input').addEventListener('change', (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(event) { DatabaseEngine.updatePlayerAvatar(event.target.result); AudioSynthEngine.playSuccess(); alert("Custom avatar picture uploaded successfully!"); }; reader.readAsDataURL(file); });
}

function handleTileDropOnCell(e, cell) { e.preventDefault(); if (cell.querySelector('.letter-tile')) return; const id = e.dataTransfer.getData('text/plain'), t = activeRackLetters.find(x => x.id === id); if (!t) return; t.placedCoord = `${cell.dataset.row},${cell.dataset.col}`; cell.appendChild(document.getElementById(id)); AudioSynthEngine.playClick(); calculateLiveTurnScore(); }
// Drops back into slots
function handleTileDropOnRackSlot(e, slot) { e.preventDefault(); if (slot.querySelector('.letter-tile')) return; const id = e.dataTransfer.getData('text/plain'), t = activeRackLetters.find(x => x.id === id); if (!t) return; t.placedCoord = null; slot.appendChild(document.getElementById(id)); AudioSynthEngine.playClick(); calculateLiveTurnScore(); }

function updateWordStrengthMeter(wordText, scoreValue) {
    const fillMeter = document.getElementById('strength-fill-meter'); const labelText = document.getElementById('strength-label-text');
    if (!wordText) return; if (!DICTIONARY.includes(wordText)) { fillMeter.style.width = "25%"; fillMeter.style.backgroundColor = "#ef4444"; labelText.innerText = "Invalid"; labelText.style.color = "#ef4444"; return; }
    if (scoreValue <= 10) { fillMeter.style.width = "50%"; fillMeter.style.backgroundColor = "#eab308"; labelText.innerText = "Good"; labelText.style.color = "#eab308"; } 
    else if (scoreValue <= 20) { fillMeter.style.width = "75%"; fillMeter.style.backgroundColor = "#3b82f6"; labelText.innerText = "Strong"; labelText.style.color = "#3b82f6"; } 
    else { fillMeter.style.width = "100%"; fillMeter.style.backgroundColor = "#22c55e"; labelText.innerText = "Excellent"; labelText.style.color = "#22c55e"; }
}

function calculateLiveTurnScore() {
    let totalWordScore = 0; let wordMultiplier = 1; let currentWordString = ""; const placedTiles = activeRackLetters.filter(t => t.placedCoord);
    placedTiles.forEach(tile => { let basePoints = tile.points; const coord = tile.placedCoord; currentWordString += tile.letter; if (TW_COORDS.includes(coord)) wordMultiplier *= 3; else if (DW_COORDS.includes(coord)) wordMultiplier *= 2; else if (TL_COORDS.includes(coord)) basePoints *= 3; else if (DL_COORDS.includes(coord)) basePoints *= 2; totalWordScore += basePoints; });
    const finalCalculatedScore = totalWordScore * wordMultiplier;
    if (placedTiles.length > 0) document.getElementById('score-preview-banner').innerText = `"${currentWordString}" : ${finalCalculatedScore} pts`;
    updateWordStrengthMeter(currentWordString, finalCalculatedScore); return { score: finalCalculatedScore, word: currentWordString };
}

function validateCurrentTurnWord() {
    const turnData = calculateLiveTurnScore(); if (!turnData.word) { AudioSynthEngine.playError(); alert("Please place tiles first!"); return; }
    if (DICTIONARY.includes(turnData.word)) {
        AudioSynthEngine.playSuccess(); ConfettiEngine.burst(); spawnFloatingScorePopup(turnData.score); DatabaseEngine.addPlayerScore(turnData.score);
        for(let l of turnData.word) { if(TILE_BAG_LEDGER[l] && TILE_BAG_LEDGER[l] > 0) TILE_BAG_LEDGER[l]--; }
        populateTileBagView(); lockPlacedTurnTiles(); const stats = DatabaseEngine.getStats(); stats.turnExpirationTime = null; localStorage.setItem('word_duel_db_stats', JSON.stringify(stats)); restartTurnTimeoutCountdown();
    } else { AudioSynthEngine.playError(); alert(`"${turnData.word}" is not valid.`); }
}

function commitMatchEndToDatabase(winnerToken) { toggleDrawerAction(false); DatabaseEngine.recordMatchConclusion(winnerToken); AudioSynthEngine.playSuccess(); alert(`Match recorded!`); navigateView('home'); }
function lockPlacedTurnTiles() { activeRackLetters = activeRackLetters.filter(t => !t.placedCoord); while(activeRackLetters.length < 7) { const randomLetters = ["A","E","I","O","T","S","N"]; const randL = randomLetters[Math.floor(Math.random() * randomLetters.length)]; activeRackLetters.push({ id: "t_" + Math.random().toString(36).substr(2, 4), letter: randL, points: 1 }); } calculateLiveTurnScore(); buildInteractiveMatrix(); renderPlayerRackSlots(); }
function resetCurrentTurnTiles() { AudioSynthEngine.playClick(); activeRackLetters.forEach(t => t.placedCoord = null); buildInteractiveMatrix(); renderPlayerRackSlots(); calculateLiveTurnScore(); }
function shuffleRackTiles() { AudioSynthEngine.playClick(); activeRackLetters.sort(() => Math.random() - 0.5); renderPlayerRackSlots(); restoreUnplacedTilesToBoardView(); }
function populateTileBagView() { const bagView = document.getElementById('tile-bag-grid-view'); if(!bagView) return; bagView.innerHTML = ''; Object.keys(TILE_BAG_LEDGER).forEach(letter => { const pill = document.createElement('div'); pill.classList.add('bag-count-pill'); pill.innerHTML = `${letter}: <span>${TILE_BAG_LEDGER[letter]}</span>`; bagView.appendChild(pill); }); }
function lookupWordDefinitionInApp() { const queryWord = document.getElementById('dict-search-box').value.trim().toUpperCase(); const displayField = document.getElementById('dict-result-display'); if(DICTIONARY_DATABASE[queryWord]) { AudioSynthEngine.playClick(); displayField.innerHTML = `<span style="color:#22c55e; font-weight:bold;">&check; VALID:</span> - ${DICTIONARY_DATABASE[queryWord]}`; } else { AudioSynthEngine.playError(); displayField.innerHTML = `<span style="color:#ef4444; font-weight:bold;">&cross; UNKNOWN.</span>`; } }
function populateHistoricalMatchLedgerUI() { const dataStore = DatabaseEngine.getStats(); const container = document.getElementById('profile-historical-match-ledger-list'); if(!container) return; container.innerHTML = ''; dataStore.matchLogs.forEach(log => { const card = document.createElement('div'); card.classList.add('history-ledger-card'); card.innerHTML = `<div><strong>vs ${log.opponent}</strong><br><span style="font-size:11px;">${log.date}</span></div><div><span style="font-weight:bold;">${log.playerFinal} - ${log.opponentFinal}</span></div>`; container.appendChild(card); }); }
