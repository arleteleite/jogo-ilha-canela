// Troca de cenas. Cada cena exporta `montar(container, contexto)` e
// devolve um objeto com `desmontar()`, que limpa o que a cena criou.

export function criarGerenciador(container, contexto) {
  let cenaAtual = null;
  let mapa = {};

  function registrar(cenas) {
    mapa = cenas;
  }

  // Monta a cena pelo nome. Desmonta a anterior antes, para não deixar
  // listeners ou temporizadores ativos.
  function irPara(nome) {
    if (!(nome in mapa)) {
      throw new Error(`Cena desconhecida: ${nome}`);
    }
    if (cenaAtual) {
      cenaAtual.desmontar();
    }
    container.innerHTML = '';
    cenaAtual = mapa[nome]({
      container,
      contexto,
      irPara,
    });
    contexto.aoMudarCena?.(nome);
  }

  return { registrar, irPara };
}
