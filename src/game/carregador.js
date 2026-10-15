// Auxiliares para imagens. Os caminhos são relativos (base './'), então o jogo
// funciona no GitHub Pages sem depender do computador local.

// Converte um caminho de public/ (ex.: 'assets/animais/tucano.webp') no caminho
// real que o navegador deve buscar.
export function caminho(relativo) {
  return `${import.meta.env.BASE_URL}${relativo}`;
}

// Carrega uma lista de imagens antes de começar. Erro ou demora não travam o jogo:
// cada imagem conta como concluída quando termina (com sucesso ou não), e o
// conjunto encerra no máximo após `tempoMaximo` ms.
export function preCarregar(caminhos, { aoProgredir, tempoMaximo }) {
  let concluidas = 0;

  const carregamentos = caminhos.map(
    (src) =>
      new Promise((resolver) => {
        const imagem = new Image();
        const concluir = () => {
          concluidas += 1;
          aoProgredir?.(concluidas / caminhos.length);
          resolver();
        };
        imagem.onload = concluir;
        imagem.onerror = concluir;
        imagem.src = src;
      }),
  );

  const limite = new Promise((resolver) => setTimeout(resolver, tempoMaximo));
  return Promise.race([Promise.all(carregamentos), limite]);
}

// Cria uma <img>. Se o arquivo não carregar, troca por um marcador com o texto
// de fallback, para a tela continuar usável.
export function criarImagem({ src, alt, classe = '', textoFallback = alt }) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.className = classe;
  img.decoding = 'async';

  img.addEventListener('error', () => {
    if (!img.parentNode) return;
    const marcador = document.createElement('div');
    marcador.className = `marcador ${classe}`.trim();
    marcador.textContent = textoFallback;
    img.replaceWith(marcador);
  });

  return img;
}
