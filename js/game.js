import { baseData } from './data.js';
import { falar } from './audio.js';

let first = null;
let lock = false;
let moves = 0;
let matches = 0;

export function startGame() {
    const gameData = [...baseData].sort(() => Math.random() - 0.5);
    const board = document.querySelector("#game-board");
    if (!board) return;

    board.innerHTML = "";
    moves = 0;
    matches = 0;

    const movesElement = document.querySelector("#moves");
    if (movesElement) movesElement.textContent = "0";

    gameData.forEach(c => {
        const d = document.createElement("div");
        d.className = "col-4 col-md-3 col-lg-2";
        d.innerHTML = `
            <div class="memory-card" data-id="${c[0]}" data-valor="${c[1]}">
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${c[1]}</div>
                </div>
            </div>`;
        d.querySelector(".memory-card").onclick = flip;
        board.appendChild(d);
    });
}

export function resetGame() {
    const winModalElement = document.getElementById('winModal');
    if (winModalElement) {
        const modal = bootstrap.Modal.getInstance(winModalElement);
        if (modal) modal.hide();
    }
    setTimeout(startGame, 300);
}

export function flip() {
    if (lock || this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    falar(this.dataset.valor);

    if (!first) {
        first = this;
        return;
    }

    let second = this;
    moves++;

    const movesElement = document.querySelector("#moves");
    if (movesElement) movesElement.textContent = moves;

    lock = true;

    if (first.dataset.id === second.dataset.id) {
        first.classList.add("matched");
        second.classList.add("matched");

        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }

        matches += 2;
        lock = false;
        first = null;

        if (matches === baseData.length) {
            setTimeout(() => {
                const finalMovesElement = document.querySelector("#final-moves");
                if (finalMovesElement) finalMovesElement.textContent = `${moves} Movimentos`;

                const winModalElement = document.getElementById('winModal');
                if (winModalElement) {
                    new bootstrap.Modal(winModalElement).show();
                }
            }, 600);
        }
    } else {
        setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
            first = null;
            lock = false;
        }, 1000);
    }
}