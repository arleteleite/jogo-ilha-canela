// Travessia do Lago de Palmas na prancha do Leo, com os dois companheiros ao lado.
// Três faixas: o jogador troca de faixa para desviar dos obstáculos e pegar tesouros.
// Não há game over: bater só desacelera. Sem batidas, a travessia dura o tempo
// previsto. Com o tempo máximo, o barco chega sozinho.
import { animais } from '../config/animais.js';
import { animacoes } from '../config/animacoes.js';
import { textos } from '../config/textos.js';
import { caminho } from '../game/carregador.js';

const FAIXAS = 3;
// Altura da linha da prancha, como fração da altura do canvas. Obstáculos
// colidem quando chegam a esta linha.
const LINHA_BARCO = 0.74;
// Proporção da imagem da prancha (840 × 1125).
const PROPORCAO_PRANCHA = 840 / 1125;
// Tempo, em ms, para a primeira fala de dupla aparecer.
const ATRASO_FALA_DUPLA = 3000;
// Tempo, em ms, que cada fala fica na tela.
const DURACAO_FALA = 2500;
// Intervalo mínimo entre alertas do tucano, para não encher a tela.
const INTERVALO_ALERTA = 2500;
const ESCALA_PASSO = 1 / 1000;

export function montar({ container, contexto, irPara }) {
  const { estado } = contexto;
  const companheiros = animais.filter((animal) => estado.companheiros.includes(animal.id));
  const temCapivara = estado.companheiros.includes('capivara');
  const temTucano = estado.companheiros.includes('tucano');
  const temTamandua = estado.companheiros.includes('tamandua');
  const temTuiuiu = estado.companheiros.includes('tuiuiu');
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chaveDupla = companheiros.map((animal) => animal.id).join('+');

  // Elementos da tela
  const secao = document.createElement('section');
  secao.className = 'cena cena-travessia';

  const barra = document.createElement('div');
  barra.className = 'barra-progresso';
  const preenchimento = document.createElement('div');
  preenchimento.className = 'barra-preenchimento';
  barra.append(preenchimento);

  const fala = document.createElement('p');
  fala.className = 'fala-travessia';
  fala.setAttribute('aria-live', 'polite');

  const canvas = document.createElement('canvas');
  canvas.className = 'canvas-travessia';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Travessia do lago na prancha');

  const dica = document.createElement('p');
  dica.className = 'dica';
  dica.textContent = 'Toque na metade esquerda ou direita da tela para mudar de faixa.';

  secao.append(barra, fala, canvas, dica);
  container.append(secao);

  const ctx = canvas.getContext('2d');

  // Imagens: a prancha do Leo e os dois companheiros escolhidos.
  const imagemPrancha = carregarImagem(caminho('assets/personagens/leo_prancha.webp'));
  const imagensCompanheiros = new Map(
    companheiros.map((animal) => [animal.id, carregarImagem(caminho(animal.imagem))]),
  );

  // Estado da travessia
  let largura = 0;
  let altura = 0;
  let dpr = 1;
  let faixaAlvo = 1;
  let xBarco = 0;
  let tempo = 0;
  let progresso = 0;
  let lentidao = 0;
  let capivaraAbsorveu = false;
  let duplaFalou = false;
  let ultimoAlerta = -Infinity;
  let tremorTempo = 0;
  let guiaFaixa = null;
  let guiaTempo = 0;
  let cronoObstaculo = 0;
  let cronoTesouro = 0;
  let cronoGuia = 9000; // a primeira ajuda do tuiuiú aparece cedo
  let falaExpira = 0;
  let encerrada = false;
  let quadroId = null;
  let timerChegada = null;
  let ultimoQuadro = performance.now();
  const obstaculos = [];
  const tesouros = [];

  // Canvas com resolução real da tela (dpr), para ficar nítido no celular.
  function redimensionar() {
    dpr = window.devicePixelRatio || 1;
    largura = canvas.clientWidth;
    altura = canvas.clientHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
    xBarco = xFaixa(faixaAlvo);
  }

  function xFaixa(indice) {
    return (largura * (indice + 0.5)) / FAIXAS;
  }

  function falar(texto) {
    fala.textContent = texto;
    falaExpira = tempo + DURACAO_FALA;
  }

  function mudarFaixa(delta) {
    if (encerrada) return;
    faixaAlvo = Math.min(FAIXAS - 1, Math.max(0, faixaAlvo + delta));
  }

  function aoToque(evento) {
    const retangulo = canvas.getBoundingClientRect();
    const x = evento.clientX - retangulo.left;
    mudarFaixa(x < retangulo.width / 2 ? -1 : 1);
  }

  function aoTecla(evento) {
    if (evento.key === 'ArrowLeft') mudarFaixa(-1);
    if (evento.key === 'ArrowRight') mudarFaixa(1);
  }

  function criarObstaculo() {
    const tipos = ['aguape', 'tronco', 'pedra'];
    obstaculos.push({
      faixa: Math.floor(Math.random() * FAIXAS),
      y: -40,
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      atingido: false,
      alertado: false,
    });
  }

  function criarTesouro() {
    tesouros.push({ faixa: Math.floor(Math.random() * FAIXAS), y: -30, coletado: false });
  }

  // Tuiuiú: destaca por um tempo a faixa com menos obstáculos à frente.
  function escolherFaixaLivre() {
    const limite = altura * LINHA_BARCO;
    const contagem = Array.from({ length: FAIXAS }, () => 0);
    for (const obstaculo of obstaculos) {
      if (obstaculo.y < limite) contagem[obstaculo.faixa] += 1;
    }
    return contagem.indexOf(Math.min(...contagem));
  }

  // Treme a tela por um instante. Com redução de movimento, não treme.
  function tremer() {
    if (reduzirMovimento) return;
    tremorTempo = animacoes.duracaoTremor;
  }

  function chegar() {
    encerrada = true;
    progresso = 1;
    falar(textos.travessia.chegada);
    timerChegada = setTimeout(() => irPara('ilha'), 1500);
  }

  function atualizar(dt) {
    tempo += dt;
    const passo = altura * animacoes.velocidadeObstaculo * dt * ESCALA_PASSO;
    const linha = altura * LINHA_BARCO;

    // Desliza o barco até a faixa escolhida
    xBarco += (xFaixa(faixaAlvo) - xBarco) * Math.min(1, dt / 90);

    // Geração de obstáculos, tesouros e ajudas
    cronoObstaculo += dt;
    if (cronoObstaculo >= animacoes.intervaloObstaculo) {
      cronoObstaculo = 0;
      criarObstaculo();
    }
    if (temTamandua) {
      cronoTesouro += dt;
      if (cronoTesouro >= animacoes.intervaloTesouro) {
        cronoTesouro = 0;
        criarTesouro();
      }
    }
    if (temTuiuiu) {
      cronoGuia += dt;
      if (cronoGuia >= animacoes.intervaloGuia && guiaFaixa === null) {
        cronoGuia = 0;
        guiaFaixa = escolherFaixaLivre();
        guiaTempo = animacoes.duracaoGuia;
        falar(textos.travessia.guia);
      }
    }
    if (guiaFaixa !== null) {
      guiaTempo -= dt;
      if (guiaTempo <= 0) guiaFaixa = null;
    }

    // Movimento e colisões
    for (const obstaculo of obstaculos) {
      obstaculo.y += passo;

      if (temTucano && !obstaculo.alertado && obstaculo.y >= altura * 0.35 && obstaculo.y < linha) {
        obstaculo.alertado = true;
        if (tempo - ultimoAlerta > INTERVALO_ALERTA) {
          ultimoAlerta = tempo;
          falar(textos.travessia.alerta);
        }
      }

      if (!obstaculo.atingido && obstaculo.y >= linha) {
        obstaculo.atingido = true;
        if (obstaculo.faixa === faixaAlvo) {
          tremer();
          if (temCapivara && !capivaraAbsorveu) {
            capivaraAbsorveu = true;
            falar(textos.travessia.capivara);
          } else {
            lentidao = animacoes.duracaoLentidao;
            falar(textos.travessia.batida);
          }
        }
      }
    }

    for (const tesouro of tesouros) {
      tesouro.y += passo;
      if (!tesouro.coletado && tesouro.y >= linha && tesouro.faixa === faixaAlvo) {
        tesouro.coletado = true;
        progresso += animacoes.bonusTesouro;
        falar(textos.travessia.tesouro);
      }
    }

    // Remove o que já saiu da tela
    removerForaDaTela(obstaculos, altura);
    removerForaDaTela(tesouros, altura);

    tremorTempo = Math.max(0, tremorTempo - dt);

    // Progresso: a lentidão reduz a velocidade do barco
    const fator = lentidao > 0 ? animacoes.fatorLentidao : 1;
    lentidao = Math.max(0, lentidao - dt);
    progresso += (dt / animacoes.travessiaDuracao) * fator;

    if (!duplaFalou && tempo >= ATRASO_FALA_DUPLA) {
      duplaFalou = true;
      falar(textos.travessia.duplas[chaveDupla] ?? textos.travessia.inicio);
    }

    if (tempo > falaExpira && !encerrada) {
      fala.textContent = '';
    }

    preenchimento.style.width = `${Math.min(100, progresso * 100)}%`;

    if (!encerrada && (progresso >= 1 || tempo >= animacoes.travessiaTempoMaximo)) {
      chegar();
    }
  }

  function desenhar() {
    // Pinta o fundo inteiro antes de tremer, para não aparecer borda vazia.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#14506a';
    ctx.fillRect(-20, -20, largura + 40, altura + 40);


    // O tremor desloca tudo aleatoriamente, e a força diminui até zerar.
    const forca = animacoes.intensidadeTremor * (tremorTempo / animacoes.duracaoTremor);
    const deslocamentoX = forca > 0 ? (Math.random() * 2 - 1) * forca : 0;
    const deslocamentoY = forca > 0 ? (Math.random() * 2 - 1) * forca : 0;
    ctx.setTransform(dpr, 0, 0, dpr, deslocamentoX * dpr, deslocamentoY * dpr);

    desenharAgua();
    desenharFaixas();
    desenharGuia();
    for (const tesouro of tesouros) desenharTesouro(tesouro);
    for (const obstaculo of obstaculos) desenharObstaculo(obstaculo);
    desenharBarco();
  }

  function desenharAgua() {
    const gradiente = ctx.createLinearGradient(0, 0, 0, altura);
    gradiente.addColorStop(0, '#2a8aa6');
    gradiente.addColorStop(1, '#14506a');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, largura, altura);

    // Ondas: correm mais devagar quando o sistema pede menos movimento.
    const velocidadeOnda = reduzirMovimento ? 0.25 : 1;
    ctx.strokeStyle = 'rgba(220, 245, 250, 0.35)';
    ctx.lineWidth = 2;
    for (let linhaOnda = 0; linhaOnda < 12; linhaOnda += 1) {
      const y = (linhaOnda / 12) * altura;
      const deslocamento = (tempo * 0.03 * velocidadeOnda + linhaOnda * 37) % largura;
      ctx.beginPath();
      for (let x = -largura; x < largura * 2; x += 60) {
        const px = x + deslocamento;
        ctx.moveTo(px, y);
        ctx.lineTo(px + 26, y);
      }
      ctx.stroke();
    }
  }

  function desenharFaixas() {
    ctx.setLineDash([10, 12]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    for (let i = 1; i < FAIXAS; i += 1) {
      const x = (largura * i) / FAIXAS;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, altura);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  function desenharGuia() {
    if (guiaFaixa === null) return;
    const pulso = 0.2 + 0.1 * Math.sin(tempo / 120);
    ctx.fillStyle = `rgba(242, 193, 78, ${pulso})`;
    ctx.fillRect((largura * guiaFaixa) / FAIXAS, 0, largura / FAIXAS, altura * LINHA_BARCO);
  }

  function desenharObstaculo({ faixa, y, tipo, atingido, alertado }) {
    const cx = xFaixa(faixa);
    const largo = (largura / FAIXAS) * 0.6;

    if (tipo === 'aguape') {
      ctx.fillStyle = '#3f8f3a';
      for (const [dx, dy] of [[-12, 0], [12, 4], [0, -8]]) {
        ctx.beginPath();
        ctx.ellipse(cx + dx, y + dy, largo * 0.28, largo * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (tipo === 'tronco') {
      ctx.fillStyle = '#7a4e2a';
      ctx.beginPath();
      ctx.roundRect(cx - largo / 2, y - 12, largo, 24, 12);
      ctx.fill();
    } else {
      ctx.fillStyle = '#7d8790';
      ctx.beginPath();
      ctx.ellipse(cx, y, largo * 0.35, largo * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Alerta do tucano: um ponto de exclamação acima do obstáculo ainda não batido.
    if (temTucano && alertado && !atingido) {
      ctx.fillStyle = '#f2c14e';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', cx, y - 22);
    }
  }

  function desenharTesouro({ faixa, y, coletado }) {
    if (coletado) return;
    const cx = xFaixa(faixa);
    ctx.fillStyle = '#f2c14e';
    ctx.beginPath();
    ctx.arc(cx, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff3c4';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function desenharBarco() {
    const linha = altura * LINHA_BARCO;
    const alturaPrancha = altura * 0.36;
    const larguraPrancha = alturaPrancha * PROPORCAO_PRANCHA;
    const sobe = Math.sin(tempo / 400) * 3;
    const topo = linha - alturaPrancha * 0.85 + sobe;

    if (imagemPrancha.complete && imagemPrancha.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(imagemPrancha, xBarco - larguraPrancha / 2, topo, larguraPrancha, alturaPrancha);
    }

    // Companheiros nas laterais da prancha, sempre dentro da tela.
    const tamanho = alturaPrancha * 0.42;
    const posicoes = [-larguraPrancha * 0.42, larguraPrancha * 0.42];
    companheiros.forEach((animal, indice) => {
      const imagem = imagensCompanheiros.get(animal.id);
      if (!imagem || !imagem.complete || imagem.naturalWidth === 0) return;
      const proporcao = imagem.naturalWidth / imagem.naturalHeight;
      const larguraAnimal = tamanho * proporcao;
      const x = clamp(xBarco + (posicoes[indice] ?? 0) - larguraAnimal / 2, 0, largura - larguraAnimal);
      ctx.drawImage(imagem, x, linha - tamanho + sobe, larguraAnimal, tamanho);
    });
  }

  function quadro(agora) {
    const dt = Math.min(agora - ultimoQuadro, 50);
    ultimoQuadro = agora;
    if (!encerrada) atualizar(dt);
    desenhar();
    quadroId = requestAnimationFrame(quadro);
  }

  canvas.addEventListener('pointerdown', aoToque);
  window.addEventListener('keydown', aoTecla);
  window.addEventListener('resize', redimensionar);

  redimensionar();
  falar(textos.travessia.inicio);
  quadroId = requestAnimationFrame(quadro);

  return {
    desmontar() {
      cancelAnimationFrame(quadroId);
      clearTimeout(timerChegada);
      window.removeEventListener('keydown', aoTecla);
      window.removeEventListener('resize', redimensionar);
      secao.remove();
    },
  };
}

function carregarImagem(src) {
  const imagem = new Image();
  imagem.src = src;
  return imagem;
}

function clamp(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

// Remove itens que já passaram da parte de baixo da tela.
function removerForaDaTela(lista, altura) {
  for (let i = lista.length - 1; i >= 0; i -= 1) {
    if (lista[i].y > altura + 60) lista.splice(i, 1);
  }
}
