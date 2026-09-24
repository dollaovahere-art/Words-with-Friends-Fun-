// ================= FIREBASE DATABASE INITIALIZATION =================
// Paste your exact project keys from your Firebase Web App screen right here!
const firebaseConfig = {
    apiKey: "PASTE_YOUR_API_KEY_HERE",
    authDomain: "://firebaseapp.com",
    databaseURL: "https://firebaseio.com", 
    projectId: "words-with-family",
    storageBucket: "://appspot.com",
    messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "PASTE_YOUR_APP_ID_HERE"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentRoomId = "room101";
let assignedPlayerRole = "player1"; 
let onlineGameState = { activeTurn: "player1", player1Name: "Player 1", player2Name: "Player 2", player1Score: 0, player2Score: 0, expirationTime: 0, boardMatrix: {} };

const DICTIONARY_DATABASE = { "HELLO": "A greeting.", "WORLD": "The planet Earth.", "PLAY": "To engage in a game.", "WORDS": "Speech elements.", "GAME": "A contest with rules.", "DUEL": "A match between two competitors.", "TILES": "Letter blocks.", "MAGIC": "Influencing events with forces." };
const DICTIONARY = Object.keys(DICTIONARY_DATABASE);
const TILE_BAG_LEDGER = { "A": 9, "B": 2, "C": 2, "D": 4, "E": 12, "F": 2, "G": 3, "H": 2, "I": 9, "M": 2, "N": 6, "O": 8, "P": 2, "R": 6, "S": 4, "T": 6, "U": 4, "W": 2, "Z": 1 };
const TW_COORDS = ["0,0", "0,7", "0,14", "7,0", "7,14", "14,0", "14,7", "14,14"];
const DW_COORDS = ["1,1", "2,2", "3,3", "4,4", "1,13", "2,12", "3,11", "4,10", "13,1", "12,2", "11,3", "10,4", "13,13", "12,12", "11,11", "10,10"];
const TL_COORDS = ["1,5", "1,9", "5,1", "5,5", "5,9", "5,13", "9,1", "9,5", "9,9", "9,13", "13,5", "13,9"];
const DL_COORDS = ["0,3", "0,11", "2,6", "2,8", "3,0", "3,14", "6,2", "6,6", "6,8", "6,12", "7,3", "7,11", "8,2", "8,6", "8,8", "8,12", "11,0", "11,14", "12,6", "12,8", "14,3", "14,11"];

let isAppAudioSystemMutedGlobal = false;
let activeRackLetters = [ { id: "t1", letter: "W", points: 4 }, { id: "t2", letter: "O", points: 1 }, { id: "t3", letter: "R", points: 1 }, { id: "t4", letter: "D", points: 2 }, { id: "t5", letter: "G", points: 2 }, { id: "t6", letter: "A", points: 1 }, { id: "t7", letter: "M", points: 3 } ];
let turnTimerInterval = null;

const AudioSynthEngine = {
    ctx: null, init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    playClick() { if (isAppAudioSystemMutedGlobal) return; this.init(); let osc = this.ctx.createOscillator(), g = this.ctx.createGain(); osc.connect(g); g.connect(this.ctx.destination); osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); g.gain.setValueAtTime(0.15, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08); osc.start(); osc.stop(this.ctx.currentTime + 0.08); },
    playSuccess() { if (isAppAudioSystemMutedGlobal) return; this.init(); [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => { let osc = this.ctx.createOscillator(), g = this.ctx.createGain(); osc.connect(g); g.connect(this.ctx.destination); osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.1)); g.gain.setValueAtTime(0.15, this.ctx.currentTime + (idx * 0.1)); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.1) + 0.25); osc.start(this.ctx.currentTime + (idx * 0.1)); osc.stop(this.ctx.currentTime + (idx * 0.1) + 0.25); }); },
    playError() { if (isAppAudioSystemMutedGlobal) return; this.init(); let osc = this.ctx.createOscillator(), g = this.ctx.createGain(); osc.connect(g); g.connect(this.ctx.destination); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(110.00, this.ctx.currentTime); g.gain.setValueAtTime(0.25, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3); osc.start(); osc.stop(this.ctx.currentTime + 0.3); }
};
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

            if (onlineGameState.boardMatrix && onlineGameState.boardMatrix[coordKey]) {
                const tileData = onlineGameState.boardMatrix[coordKey];
                const tileEl = document.createElement('div'); tileEl.classList.add('letter-tile'); stylePlacedTileLock(tileEl);
                tileEl.innerHTML = `${tileData.letter}<span class="points-val">${tileData.points}</span>`;
                cell.appendChild(tileEl);
            }
            cell.addEventListener('dragover', (e) => e.preventDefault());
            cell.addEventListener('drop', (e) => handleTileDropOnCell(e, cell));
            boardContainer.appendChild(cell);
        }
    }
}

function stylePlacedTileLock(el) { el.style.background = '#475569'; el.style.cursor = 'default'; el.setAttribute('draggable', 'false'); }

function renderPlayerRackSlots() {
    const rackContainer = document.getElementById('live-rack-container'); rackContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const slot = document.createElement('div'); slot.classList.add('rack-slot'); slot.dataset.slotIndex = i;
        slot.addEventListener('dragover', (e) => e.preventDefault()); slot.addEventListener('drop', (e) => handleTileDropOnRackSlot(e, slot));
        const matchingLetter = activeRackLetters[i];
        if (matchingLetter && !matchingLetter.placedCoord) {
            const tileEl = document.createElement('div'); tileEl.classList.add('letter-tile'); tileEl.setAttribute('draggable', 'true'); tileEl.id = matchingLetter.id;
            tileEl.innerHTML = `${matchingLetter.letter}<span class="points-val">${matchingLetter.points}</span>`;
            tileEl.addEventListener('dragstart', (e) => { if(onlineGameState.activeTurn !== assignedPlayerRole) { e.preventDefault(); return; } e.dataTransfer.setData('text/plain', matchingLetter.id); });
            slot.appendChild(tileEl);
        }
        rackContainer.appendChild(slot);
    }
}

function handleTileDropOnCell(e, cell) { e.preventDefault(); if (onlineGameState.activeTurn !== assignedPlayerRole || cell.querySelector('.letter-tile')) return; const id = e.dataTransfer.getData('text/plain'), t = activeRackLetters.find(x => x.id === id); if (!t) return; t.placedCoord = `${cell.dataset.row},${cell.dataset.col}`; cell.appendChild(document.getElementById(id)); AudioSynthEngine.playClick(); calculateLiveTurnScore(); }
function handleTileDropOnRackSlot(e, slot) { e.preventDefault(); if (slot.querySelector('.letter-tile')) return; const id = e.dataTransfer.getData('text/plain'), t = activeRackLetters.find(x => x.id === id); if (!t) return; t.placedCoord = null; slot.appendChild(document.getElementById(id)); AudioSynthEngine.playClick(); calculateLiveTurnScore(); }

function calculateLiveTurnScore() {
    let totalWordScore = 0, wordMultiplier = 1, currentWordString = "";
    const placedTiles = activeRackLetters.filter(t => t.placedCoord);
    placedTiles.forEach(tile => {
        let basePoints = tile.points; const coord = tile.placedCoord; currentWordString += tile.letter;
        if (TW_COORDS.includes(coord)) wordMultiplier *= 3; else if (DW_COORDS.includes(coord)) wordMultiplier *= 2; else if (TL_COORDS.includes(coord)) basePoints *= 3; else if (DL_COORDS.includes(coord)) basePoints *= 2;
        totalWordScore += basePoints;
    });
    const finalCalculatedScore = totalWordScore * wordMultiplier;
    if (placedTiles.length > 0) document.getElementById('score-preview-banner').innerText = `"${currentWordString}" : ${finalCalculatedScore} pts`;
    updateWordStrengthMeter(currentWordString, finalCalculatedScore);
    return { score: finalCalculatedScore, word: currentWordString, tiles: placedTiles };
}

function updateWordStrengthMeter(word, score) { const fill = document.getElementById('strength-fill-meter'), lbl = document.getElementById('strength-label-text'); if(!word){ fill.style.width="0%"; lbl.innerText="Waiting"; return; } if(!DICTIONARY.includes(word)){ fill.style.width="25%"; fill.style.backgroundColor="#ef4444"; lbl.innerText="Invalid"; } else { fill.style.width="100%"; fill.style.backgroundColor="#22c55e"; lbl.innerText="Excellent"; } }
function saveProfileAndLaunch() {
    const username = document.getElementById('input-username').value.trim() || "Player";
    currentRoomId = document.getElementById('input-room-id').value.trim() || "room101";
    assignedPlayerRole = document.getElementById('input-role').value;
    AudioSynthEngine.playClick();
    
    database.ref('rooms/' + currentRoomId).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) { onlineGameState = data; } else {
            onlineGameState = { activeTurn: "player1", player1Name: assignedPlayerRole === 'player1' ? username : "Player 1", player2Name: assignedPlayerRole === 'player2' ? username : "Player 2", player1Score: 0, player2Score: 0, expirationTime: Date.now() + (3*24*60*60*1000), boardMatrix: {} };
            database.ref('rooms/' + currentRoomId).set(onlineGameState);
        }
        syncInterfaceDisplayElements();
    });
    navigateView('game');
}

function syncInterfaceDisplayElements() {
    document.getElementById('name-display-p1').innerText = onlineGameState.player1Name; document.getElementById('name-display-p2').innerText = onlineGameState.player2Name;
    document.getElementById('live-score-p1').innerText = onlineGameState.player1Score; document.getElementById('live-score-p2').innerText = onlineGameState.player2Score;
    const badge = document.getElementById('turn-indicator-badge');
    if (onlineGameState.activeTurn === assignedPlayerRole) { badge.innerText = "YOUR TURN"; badge.style.background = "#22c55e"; } 
    else { badge.innerText = "OPPONENT'S TURN"; badge.style.background = "#f97316"; }
    buildInteractiveMatrix(); renderPlayerRackSlots(); restartTurnTimeoutCountdown();
}

function restartTurnTimeoutCountdown() {
    clearInterval(turnTimerInterval); const banner = document.getElementById('score-preview-banner');
    turnTimerInterval = setInterval(() => {
        const timeLeft = onlineGameState.expirationTime - Date.now();
        if (timeLeft <= 0) { clearInterval(turnTimerInterval); banner.innerText = "Turn Window Expired!"; alert("Game Forfeited due to Move timeout expiration!"); return; }
        const days = Math.floor(timeLeft / (1000*60*60*24)), hours = Math.floor((timeLeft % (1000*60*60*24)) / (1000*60*60)), minutes = Math.floor((timeLeft % (1000*60*60)) / (1000*60));
        const currentPlacements = calculateLiveTurnScore(); if (!currentPlacements.word) banner.innerText = `Time Left: ${days}d ${hours}h ${minutes}m`;
    }, 1000);
}

function validateCurrentTurnWord() {
    if (onlineGameState.activeTurn !== assignedPlayerRole) { alert("Please wait for your turn!"); return; }
    const turnData = calculateLiveTurnScore(); if (!turnData.word) { AudioSynthEngine.playError(); alert("Place tiles first!"); return; }
    if (DICTIONARY.includes(turnData.word)) {
        AudioSynthEngine.playSuccess(); if (!onlineGameState.boardMatrix) onlineGameState.boardMatrix = {};
        turnData.tiles.forEach(t => { onlineGameState.boardMatrix[t.placedCoord] = { letter: t.letter, points: t.points }; });
        if (assignedPlayerRole === 'player1') onlineGameState.player1Score += turnData.score; else onlineGameState.player2Score += turnData.score;
        onlineGameState.activeTurn = assignedPlayerRole === 'player1' ? 'player2' : 'player1'; onlineGameState.expirationTime = Date.now() + (3*24*60*60*1000);
        database.ref('rooms/' + currentRoomId).set(onlineGameState); lockPlacedTurnTiles();
    } else { AudioSynthEngine.playError(); alert(`"${turnData.word}" is not valid.`); }
}

function lockPlacedTurnTiles() { activeRackLetters = activeRackLetters.filter(t => !t.placedCoord); while(activeRackLetters.length < 7) { const randomLetters = ["A","E","I","O","T","S","N"]; const randL = randomLetters[Math.floor(Math.random() * randomLetters.length)]; activeRackLetters.push({ id: "t_" + Math.random().toString(36).substr(2, 4), letter: randL, points: 1 }); } renderPlayerRackSlots(); calculateLiveTurnScore(); }
function resetCurrentTurnTiles() { AudioSynthEngine.playClick(); activeRackLetters.forEach(t => t.placedCoord = null); syncInterfaceDisplayElements(); }
function shuffleRackTiles() { AudioSynthEngine.playClick(); activeRackLetters.sort(() => Math.random() - 0.5); renderPlayerRackSlots(); }
function toggleAppAudioMuteSystem() { isAppAudioSystemMutedGlobal = !isAppAudioSystemMutedGlobal; document.getElementById('master-mute-toggle-btn').style.opacity = isAppAudioSystemMutedGlobal ? '0.4' : '1.0'; }
function populateTileBagView() { const bagView = document.getElementById('tile-bag-grid-view'); if(!bagView) return; bagView.innerHTML = ''; Object.keys(TILE_BAG_LEDGER).forEach(letter => { const pill = document.createElement('div'); pill.classList.add('bag-count-pill'); pill.innerHTML = `${letter}: <span>${TILE_BAG_LEDGER[letter]}</span>`; bagView.appendChild(pill); }); }
function lookupWordDefinitionInApp() { const queryWord = document.getElementById('dict-search-box').value.trim().toUpperCase(); const displayField = document.getElementById('dict-result-display'); if(DICTIONARY_DATABASE[queryWord]) { AudioSynthEngine.playClick(); displayField.innerHTML = `<span style="color:#22c55e; font-weight:bold;">&check; VALID:</span> - ${DICTIONARY_DATABASE[queryWord]}`; } else { AudioSynthEngine.playError(); displayField.innerHTML = `<span style="color:#ef4444; font-weight:bold;">&cross; UNKNOWN.</span>`; } }
function navigateView(id) { document.querySelectorAll('.view-screen').forEach(v => v.classList.remove('active')); document.getElementById(`screen-${id}`).classList.add('active'); }
function toggleDrawerAction(open) { AudioSynthEngine.playClick(); const o = document.getElementById('action-drawer-overlay'), d = document.getElementById('action-sliding-drawer'); if(open) { o.classList.add('active'); d.classList.add('open'); } else { d.classList.remove('open'); o.classList.remove('active'); } }
swapTileCosmeticSkin=(t)=>{AudioSynthEngine.playClick();document.getElementById('app-root-body').className=`skin-${t}`;document.querySelectorAll('.skin-toggle-btn').forEach(b=>b.classList.remove('active'));document.getElementById(`btn-skin-${t}`).classList.add('active');};
function executeMatchAction(a) { alert(`Action: ${a}`); }
function showUserProfileView(roleKey) { alert(`Inspecting player: [${roleKey}]`); }
function commitMatchEndToDatabase() { toggleDrawerAction(false); database.ref('rooms/' + currentRoomId).remove(); alert("Game match session deleted safely."); navigateView('home'); }

window.addEventListener('DOMContentLoaded', () => { populateTileBagView(); });
