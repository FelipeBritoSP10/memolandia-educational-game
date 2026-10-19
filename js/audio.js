
import { audioMap } from './data.js';

// Inicialização da Web Audio API
const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

const audioCtx = AudioContextClass
    ? new AudioContextClass()
    : null;

// Efeitos sonoros
const SOUND_PRESETS = {
    flip: {
        startFreq: 400,
        endFreq: 800,
        duration: 0.08,
        gain: 0.15
    },

    match: {
        startFreq: 523.25,
        endFreq: 659.25,
        duration: 0.3,
        gain: 0.2
    },

    victory: {
        startFreq: 523.25,
        endFreq: 783.99,
        duration: 0.5,
        gain: 0.25
    }
};

/**
 * Reproduz um efeito sonoro.
 * @param {'flip' | 'match' | 'victory'} type
 */
export function playSoundEffect(type) {
    const config = SOUND_PRESETS[type];

    if (!config || !audioCtx) return;

    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch((error) => {
                console.warn('Não foi possível ativar o áudio:', error);
            });
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        oscillator.frequency.setValueAtTime(
            config.startFreq,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            config.endFreq,
            now + config.duration
        );

        gainNode.gain.setValueAtTime(config.gain, now);

        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            now + config.duration
        );

        oscillator.start(now);
        oscillator.stop(now + config.duration);
    } catch (error) {
        console.error('Erro ao reproduzir efeito sonoro:', error);
    }
}

/**
 * Reproduz uma mensagem usando a voz do navegador.
 * @param {string} text
 * @param {number} rate
 * @param {Function | null} onEndCallback
 */
function speak(text, rate = 1, onEndCallback = null) {
    if (!('speechSynthesis' in window)) {
        console.warn('Este navegador não suporta síntese de voz.');

        if (onEndCallback) onEndCallback();
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    if (onEndCallback) {
        utterance.onend = onEndCallback;
    }

    utterance.onerror = (event) => {
        console.error('Erro na síntese de voz:', event.error);
    };

    window.speechSynthesis.speak(utterance);
}

/**
 * Lê o conteúdo da carta.
 * @param {string} valor
 */
export function falar(valor) {
    speak(audioMap[valor] || String(valor), 1);
}

/**
 * Lê as instruções do jogo.
 */
export function lerInstrucoes() {
    const textoInstrucoes =
        'Como jogar Memolândia. ' +
        'Passo 1: Clique nas cartas para revelar os ícones ou nomes. ' +
        'Passo 2: Encontre o par correspondente de ícone e nome. ' +
        'Passo 3: O sistema lerá em voz alta o conteúdo de cada carta. ' +
        'Passo 4: Complete todos os pares no menor número de movimentos.';

    const btn = document.querySelector('#btn-read-help');

    if (btn) {
        btn.classList.add('btn-active');
        btn.innerHTML =
            '<i class="fa-solid fa-wave-square fa-bounce me-2"></i> Lendo Instruções...';
    }

    speak(textoInstrucoes, 0.95, () => {
        if (btn) {
            btn.classList.remove('btn-active');
            btn.innerHTML =
                '<i class="fa-solid fa-volume-high me-2"></i> Ouvir Instruções';
        }
    });
}

/**
 * Reproduz o efeito sonoro e a mensagem de vitória.
 */
export function falarConclusao() {
    console.log('🏆 Conclusão da Memolândia!');

    // Efeito sonoro de vitória
    playSoundEffect('victory');

    // Mensagem falada
    speak(
        'Parabéns! Você encontrou todos os pares da Memolândia! ' +
        'Muito bem! Você concluiu o desafio!',
        0.95
    );
}

/**
 * Cancela a fala ao fechar o modal de ajuda.
 */
export function pararVozHelp() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    const btn = document.querySelector('#btn-read-help');

    if (btn) {
        btn.classList.remove('btn-active');
        btn.innerHTML =
            '<i class="fa-solid fa-volume-high me-2"></i> Ouvir Instruções';
    }
}