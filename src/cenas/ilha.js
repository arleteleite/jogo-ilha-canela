// Chegada à Ilha do Canela: a piada da canela e a semente misteriosa para plantar.
import { textos } from '../config/textos.js';
import { caminho, criarImagem } from '../game/carregador.js';

export function montar({ container, irPara }) {
  const secao = document.createElement('section');
  secao.className = 'cena cena-tela cena-ilha';
  secao.style.backgroundImage = `url('${caminho('assets/cenarios/ilha_canela.webp')}')`;

  const caixa = document.createElement('div');
  caixa.className = 'caixa-texto';

  const chegada = document.createElement('p');
  chegada.textContent = textos.ilha.chegada;

  const piada = document.createElement('p');
  piada.className = 'piada';
  piada.textContent = textos.ilha.piada;

  caixa.append(chegada, piada);

  const areaSemente = document.createElement('div');
  areaSemente.className = 'area-semente';

  // A semente também é tocável, além do botão.
  const semente = document.createElement('button');
  semente.type = 'button';
  semente.className = 'semente';
  semente.setAttribute('aria-label', 'Semente misteriosa');

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = textos.ilha.botaoPlantar;

  const plantar = () => irPara('semente');
  semente.addEventListener('click', plantar);
  botao.addEventListener('click', plantar);

  areaSemente.append(semente, botao);

  const leo = criarImagem({
    src: caminho('assets/personagens/leo_4.webp'),
    alt: 'Leo comemorando',
    classe: 'personagem personagem-pequeno',
    textoFallback: 'Leo',
  });

  secao.append(caixa, areaSemente, leo);
  container.append(secao);

  return {
    desmontar() {
      secao.remove();
    },
  };
}
