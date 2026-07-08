const audioMap = { "🐱": "Gato", "🐶": "Cachorro", "🍎": "Maçã", "🚗": "Carro", "⭐": "Estrela" };
const baseData = [["1", "🐱"], ["1", "Gato"], ["2", "🐶"], ["2", "Cachorro"], ["3", "🍎"], ["3", "Maçã"], ["4", "🚗"], ["4", "Carro"], ["5", "⭐"], ["5", "Estrela"]];

let first = null, lock = false, moves = 0, matches = 0;

function falar(valor) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(audioMap[valor] || valor);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
}

function startGame() {
    const gameData = [...baseData].sort(() => Math.random() - .5);
    const board = document.querySelector("#game-board");
    board.innerHTML = "";
    moves = 0; matches = 0;
    document.querySelector("#moves").textContent = "0";

    gameData.forEach(c => {
        const d = document.createElement("div");
        d.className = "col-4 col-md-3 col-lg-2";
        d.innerHTML = `<div class="memory-card" data-id="${c[0]}" data-valor="${c[1]}"><div class="card-inner"><div class="card-front">?</div><div class="card-back">${c[1]}</div></div></div>`;
        d.querySelector(".memory-card").onclick = flip;
        board.appendChild(d);
    });
}

function resetGame() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('winModal'));
    modal.hide();
    setTimeout(startGame, 300);
}

function flip() {
    if (lock || this.classList.contains("flipped")) return;
    this.classList.add("flipped");
    falar(this.dataset.valor);
    if (!first) { first = this; return; }

    let second = this;
    moves++;
    document.querySelector("#moves").textContent = moves;
    lock = true;

    if (first.dataset.id === second.dataset.id) {
        first.classList.add("matched"); second.classList.add("matched");
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        matches += 2; lock = false; first = null;
        if (matches === 10) {
            setTimeout(() => {
                document.querySelector("#final-moves").textContent = moves + " Movimentos";
                new bootstrap.Modal(document.getElementById('winModal')).show();
            }, 600);
        }
    } else {
        setTimeout(() => { first.classList.remove("flipped"); this.classList.remove("flipped"); first = null; lock = false; }, 1000);
    }
}

startGame();