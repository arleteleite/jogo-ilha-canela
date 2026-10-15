// Escolha de exatamente dois companheiros. Ao escolher o segundo, a seleção
// trava e a travessia começa depois de uma pequena pausa.
import { animais, QUANTIDADE_COMPANHEIROS } from '../config/animais.js';
import { animacoes } from '../config/animacoes.js';
import { textos } from '../config/textos.js';
import { caminho, criarImagem } from '../game/carregador.js';
import { escolherCompanheiro, selecaoCompleta } from '../game/estado.js';

export function montar({ container, contexto, irPara }) {
  const { estado } = contexto;
  let timerTravessia = null;

  const secao = document.createElement('section');
  secao.className = 'cena cena-tela cena-companheiros';
  secao.style.backgroundImage = `url('${caminho('assets/cenarios/praia_arnos_2.webp')}')`;

  const leo = criarImagem({
    src: caminho('assets/personagens/leo.webp'),
    alt: 'Leo',
    classe: 'personagem personagem-pequeno',
    textoFallback: 'Leo',
  });

  const instrucao = document.createElement('p');
  instrucao.className = 'texto-introducao';
  instrucao.textContent = textos.companheiros.instrucao;

  const contador = document.createElement('p');
  contador.className = 'contador';

  const confirmacao = document.createElement('p');
  confirmacao.className = 'confirmacao';

  const grade = document.createElement('div');
  grade.className = 'cartas';

  const cartas = new Map();

  for (const animal of animais) {
    const carta = document.createElement('button');
    carta.type = 'button';
    carta.className = 'carta';
    carta.dataset.id = animal.id;

    const imagem = criarImagem({
      src: caminho(animal.imagem),
      alt: animal.nome,
      classe: 'carta-imagem',
      textoFallback: animal.nome,
    });

    const nome = document.createElement('strong');
    nome.textContent = animal.nome;

    const descricao = document.createElement('span');
    descricao.className = 'carta-descricao';
    descricao.textContent = animal.descricao;

    const habilidade = document.createElement('span');
    habilidade.className = 'carta-habilidade';
    habilidade.textContent = `Habilidade: ${animal.habilidade}`;

    carta.append(imagem, nome, descricao, habilidade);
    carta.addEventListener('click', () => escolher(animal.id));
    cartas.set(animal.id, carta);
    grade.append(carta);
  }

  // Reflete o estado na tela: destaque das escolhas, contador e trava.
  function atualizar() {
    contador.textContent = `${estado.companheiros.length}/${QUANTIDADE_COMPANHEIROS}`;
    const travada = selecaoCompleta(estado);
    for (const [id, carta] of cartas) {
      carta.classList.toggle('selecionada', estado.companheiros.includes(id));
      carta.classList.toggle('travada', travada);
      carta.setAttribute('aria-disabled', String(travada));
    }
  }

  function escolher(id) {
    // Retorna false se o animal já foi escolhido ou se a seleção já está completa.
    if (!escolherCompanheiro(estado, id)) return;
    atualizar();
    if (selecaoCompleta(estado)) travar();
  }

  function travar() {
    const nomes = animais
      .filter((animal) => estado.companheiros.includes(animal.id))
      .map((animal) => animal.nome);
    confirmacao.textContent = `${textos.companheiros.confirmacao} ${nomes.join(' e ')}.`;
    timerTravessia = setTimeout(() => irPara('travessia'), animacoes.pausaAposEscolha);
  }

  secao.append(leo, instrucao, contador, grade, confirmacao);
  container.append(secao);
  atualizar();

  return {
    desmontar() {
      clearTimeout(timerTravessia);
      secao.remove();
    },
  };
}
