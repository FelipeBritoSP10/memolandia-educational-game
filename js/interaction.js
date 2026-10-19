// js/interaction.js
import { startGame, resetGame } from './game.js';
import { lerInstrucoes, pararVozHelp, falarConclusao  } from './audio.js';

// Torna as funções acessíveis no escopo do HTML
window.resetGame = resetGame;
window.lerInstrucoes = lerInstrucoes;
window.pararVozHelp = pararVozHelp;
window.falarConclusao = falarConclusao;

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        startGame();
    }, 150);
});