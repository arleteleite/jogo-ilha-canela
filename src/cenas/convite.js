// Convite final: nome e data do evento, e dois botões de resposta que abrem o
// WhatsApp com a frase pronta. O Leo decide se envia.
import { evento } from '../config/evento.js';
import { textos } from '../config/textos.js';
import { caminho, criarImagem } from '../game/carregador.js';
import { criarLinkWhatsapp } from '../game/whatsapp.js';

export function montar({ container, irPara }) {
  const secao = document.createElement('section');
  secao.className = 'cena cena-tela cena-convite';
  secao.style.backgroundImage = `url('${caminho('assets/cenarios/praia_arnos.webp')}')`;

  // Bloco do convite
  const convite = document.createElement('div');
  convite.className = 'bloco-convite';

  const arlete = criarImagem({
    src: caminho('assets/personagens/arlete.webp'),
    alt: 'Arlete',
    classe: 'personagem personagem-pequeno',
    textoFallback: 'Arlete',
  });

  const missao = document.createElement('p');
  missao.className = 'missao';
  missao.textContent = textos.convite.missaoConcluida;

  const titulo = document.createElement('h1');
  titulo.textContent = evento.nome;

  const dataCidade = document.createElement('p');
  dataCidade.className = 'data-evento';
  dataCidade.textContent = `${evento.data} — ${evento.cidade}`;

  const mensagem = document.createElement('p');
  mensagem.className = 'texto-introducao';
  mensagem.textContent = textos.convite.mensagem;

  const respostas = document.createElement('div');
  respostas.className = 'botoes-resposta';

  const botaoAceito = criarBotaoResposta(textos.convite.botaoAceito, 'botao-aceitar', {
    frase: textos.convite.frasesWhatsapp.aceito,
    agradecimento: textos.convite.agradecimentoAceito,
  });
  const botaoNaoPosso = criarBotaoResposta(textos.convite.botaoNaoPosso, 'botao-recusar', {
    frase: textos.convite.frasesWhatsapp.naoPosso,
    agradecimento: textos.convite.agradecimentoNaoPosso,
  });

  respostas.append(botaoAceito, botaoNaoPosso);
  convite.append(arlete, missao, titulo, dataCidade, mensagem, respostas);

  // Bloco de agradecimento, mostrado depois da escolha
  const agradecimento = document.createElement('div');
  agradecimento.className = 'bloco-convite';
  agradecimento.hidden = true;

  const textoAgradecimento = document.createElement('p');
  textoAgradecimento.className = 'texto-introducao';

  const botaoJogarDeNovo = document.createElement('button');
  botaoJogarDeNovo.type = 'button';
  botaoJogarDeNovo.textContent = textos.convite.botaoJogarDeNovo;
  botaoJogarDeNovo.addEventListener('click', () => irPara('titulo'));

  agradecimento.append(textoAgradecimento, botaoJogarDeNovo);

  // Ao tocar em uma resposta: abre o WhatsApp e troca para o agradecimento.
  function criarBotaoResposta(rotulo, classe, { frase, agradecimento: textoFinal }) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = classe;
    botao.textContent = rotulo;
    botao.addEventListener('click', () => {
      window.open(criarLinkWhatsapp(frase), '_blank', 'noopener');
      textoAgradecimento.textContent = textoFinal;
      convite.hidden = true;
      agradecimento.hidden = false;
    });
    return botao;
  }

  secao.append(convite, agradecimento);
  container.append(secao);

  return {
    desmontar() {
      secao.remove();
    },
  };
}
