// Estado do jogo, mantido só em memória. Ao recarregar a página, a aventura recomeça.
import { QUANTIDADE_COMPANHEIROS } from '../config/animais.js';

export function criarEstado() {
  return {
    companheiros: [],
  };
}

// Adiciona um companheiro, se ainda houver vaga e ele não estiver escolhido.
// Retorna true quando a escolha foi aceita.
export function escolherCompanheiro(estado, id) {
  if (estado.companheiros.includes(id)) return false;
  if (estado.companheiros.length >= QUANTIDADE_COMPANHEIROS) return false;
  estado.companheiros.push(id);
  return true;
}

// A seleção fica travada quando o número de companheiros foi atingido.
export function selecaoCompleta(estado) {
  return estado.companheiros.length === QUANTIDADE_COMPANHEIROS;
}
