// Tela inicial: apresenta a missão e leva à escolha dos companheiros.
import { textos } from '../config/textos.js';
import { caminho, criarImagem } from '../game/carregador.js';

export function montar({ container, contexto, irPara }) {
  // Chegar ao título sempre começa uma aventura nova, então zera as escolhas.
  contexto.estado.companheiros = [];

  const secao = document.createElement('section');
  secao.className = 'cena cena-tela cena-titulo';
  secao.style.backgroundImage = `url('${caminho('assets/cenarios/praia_arnos.webp')}')`;

  const h1 = document.createElement('h1');
  h1.textContent = textos.titulo.nomeJogo;

  const introducao = document.createElement('p');
  introducao.className = 'texto-introducao';
  introducao.textContent = textos.titulo.introducao;

  const leo = criarImagem({
    src: caminho('assets/personagens/leo.webp'),
    alt: 'Leo',
    classe: 'personagem',
    textoFallback: 'Leo',
  });

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = textos.titulo.botaoComecar;
  botao.addEventListener('click', () => irPara('companheiros'));

  secao.append(h1, introducao, leo, botao);
  container.append(secao);

  return {
    desmontar() {
      secao.remove();
    },
  };
}
