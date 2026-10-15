// Imagens usadas pelo jogo. Todas são carregadas no início, para as cenas não
// aparecerem pela metade. Caminhos relativos a public/.
import { animais } from './animais.js';

export const IMAGENS_DO_JOGO = [
  'assets/personagens/leo.webp',
  'assets/personagens/leo_prancha.webp',
  'assets/personagens/leo_4.webp',
  'assets/personagens/arlete.webp',
  'assets/cenarios/praia_arnos.webp',
  'assets/cenarios/praia_arnos_2.webp',
  'assets/cenarios/ilha_canela.webp',
  ...animais.map((animal) => animal.imagem),
];

// Tempo máximo de espera pelo carregamento. Depois disso, o jogo abre mesmo assim.
export const TEMPO_MAXIMO_CARREGAMENTO = 10000;
