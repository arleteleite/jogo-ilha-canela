// Plantio da semente: a semente cai no solo, brilha, cria raízes, cresce e revela
// a Arlete com os ingressos. Cada etapa é uma classe na seção; o CSS faz a animação
// e este arquivo só controla o tempo.
import { animacoes } from '../config/animacoes.js';
import { textos } from '../config/textos.js';
import { caminho, criarImagem } from '../game/carregador.js';

const NUMERO_RAIZES = 3;
const NUMERO_PARTICULAS = 14;

// Ângulos das raízes, em graus, para ficarem espalhadas.
const ANGULOS_RAIZES = [-40, 0, 40];

export function montar({ container, irPara }) {
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fator = reduzirMovimento ? animacoes.fatorTempoReduzido : 1;
  const timers = [];

  const secao = document.createElement('section');
  secao.className = 'cena cena-tela cena-semente';
  secao.style.backgroundImage = `url('${caminho('assets/cenarios/ilha_canela.webp')}')`;

  const palco = document.createElement('div');
  palco.className = 'palco';

  const solo = document.createElement('div');
  solo.className = 'solo';

  const grao = document.createElement('div');
  grao.className = 'grao';

  const brilho = document.createElement('div');
  brilho.className = 'brilho';

  const raizes = document.createElement('div');
  raizes.className = 'raizes';
  for (const angulo of ANGULOS_RAIZES.slice(0, NUMERO_RAIZES)) {
    const raiz = document.createElement('div');
    raiz.className = 'raiz';
    raiz.style.setProperty('--angulo', `${angulo}deg`);
    raizes.append(raiz);
  }

  const planta = document.createElement('div');
  planta.className = 'planta';
  const broto = document.createElement('div');
  broto.className = 'broto';
  const caule = document.createElement('div');
  caule.className = 'caule';
  const folhaEsquerda = document.createElement('div');
  folhaEsquerda.className = 'folha folha-esquerda';
  const folhaDireita = document.createElement('div');
  folhaDireita.className = 'folha folha-direita';
  const flor = document.createElement('div');
  flor.className = 'flor';
  planta.append(broto, caule, folhaEsquerda, folhaDireita, flor);

  const particulas = document.createElement('div');
  particulas.className = 'particulas';
  if (!reduzirMovimento) {
    for (let i = 0; i < NUMERO_PARTICULAS; i += 1) {
      const particula = document.createElement('span');
      particula.className = 'particula';
      particula.style.setProperty('--dx', `${Math.round((Math.random() * 2 - 1) * 110)}px`);
      particula.style.setProperty('--atraso', `${(Math.random() * 1.2).toFixed(2)}s`);
      particulas.append(particula);
    }
  }

  const clarao = document.createElement('div');
  clarao.className = 'clarao';

  // Arlete aparece só nesta etapa. O nome dela também só aparece aqui.
  const arlete = criarImagem({
    src: caminho('assets/personagens/arlete.webp'),
    alt: 'Arlete segurando dois ingressos',
    classe: 'arlete',
    textoFallback: 'Arlete',
  });

  palco.append(solo, raizes, brilho, planta, particulas, grao, clarao, arlete);

  const revelacao = document.createElement('p');
  revelacao.className = 'revelacao';
  revelacao.textContent = textos.semente.revelacao;

  const botaoConvite = document.createElement('button');
  botaoConvite.type = 'button';
  botaoConvite.className = 'botao-convite';
  botaoConvite.textContent = textos.semente.botaoConvite;
  botaoConvite.addEventListener('click', () => irPara('convite'));

  secao.append(palco, revelacao, botaoConvite);
  container.append(secao);

  // Linha do tempo: cada marco adiciona uma classe, e o CSS faz o resto.
  const marcos = [
    { tempo: 0, classe: 'etapa-cair' },
    { tempo: animacoes.sementeBrilho, classe: 'etapa-brilho' },
    { tempo: animacoes.sementeRaizes, classe: 'etapa-raizes' },
    { tempo: animacoes.sementeCresce, classe: 'etapa-crescer' },
    { tempo: animacoes.sementeClarao, classe: 'etapa-clarao' },
    { tempo: animacoes.sementeArlete, classe: 'etapa-arlete' },
    { tempo: animacoes.sementeRevelacao, classe: 'etapa-revelacao' },
  ];

  for (const { tempo, classe } of marcos) {
    if (tempo === 0) {
      secao.classList.add(classe);
    } else {
      timers.push(setTimeout(() => secao.classList.add(classe), tempo * fator));
    }
  }

  return {
    desmontar() {
      timers.forEach(clearTimeout);
      secao.remove();
    },
  };
}
