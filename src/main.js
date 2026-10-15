import './estilos/base.css';
import './estilos/cenas.css';
import { criarGerenciador } from './game/gerenciador-cenas.js';
import { criarEstado } from './game/estado.js';
import { caminho, preCarregar } from './game/carregador.js';
import { IMAGENS_DO_JOGO, TEMPO_MAXIMO_CARREGAMENTO } from './config/recursos.js';
import { textos } from './config/textos.js';
import * as titulo from './cenas/titulo.js';
import * as companheiros from './cenas/companheiros.js';
import * as travessia from './cenas/travessia.js';
import * as ilha from './cenas/ilha.js';
import * as semente from './cenas/semente.js';
import * as convite from './cenas/convite.js';

const container = document.getElementById('jogo');
const estado = criarEstado();

// Botão de reinício: fica visível em todas as cenas, exceto no título.
const botaoReiniciar = document.createElement('button');
botaoReiniciar.type = 'button';
botaoReiniciar.className = 'botao-reiniciar';
botaoReiniciar.textContent = textos.geral.botaoReiniciar;
botaoReiniciar.hidden = true;
document.body.append(botaoReiniciar);

const gerenciador = criarGerenciador(container, {
  estado,
  aoMudarCena: (nome) => {
    botaoReiniciar.hidden = nome === 'titulo';
  },
});

gerenciador.registrar({
  titulo: titulo.montar,
  companheiros: companheiros.montar,
  travessia: travessia.montar,
  ilha: ilha.montar,
  semente: semente.montar,
  convite: convite.montar,
});

// Reinício: zera a escolha e volta ao título. Cada cena limpa seus temporizadores ao sair.
botaoReiniciar.addEventListener('click', () => {
  estado.companheiros = [];
  gerenciador.irPara('titulo');
});

// Tela de carregamento: some quando as imagens estão prontas (ou quando o tempo acaba).
const telaCarregamento = document.createElement('div');
telaCarregamento.className = 'tela-carregamento';
const textoCarregamento = document.createElement('p');
textoCarregamento.textContent = textos.geral.carregando;
const barraCarregamento = document.createElement('div');
barraCarregamento.className = 'barra-progresso';
const preenchimentoCarregamento = document.createElement('div');
preenchimentoCarregamento.className = 'barra-preenchimento';
barraCarregamento.append(preenchimentoCarregamento);
telaCarregamento.append(textoCarregamento, barraCarregamento);
document.body.append(telaCarregamento);

preCarregar(IMAGENS_DO_JOGO.map(caminho), {
  aoProgredir: (proporcao) => {
    preenchimentoCarregamento.style.width = `${Math.round(proporcao * 100)}%`;
  },
  tempoMaximo: TEMPO_MAXIMO_CARREGAMENTO,
}).then(() => {
  telaCarregamento.remove();
  gerenciador.irPara('titulo');
});
