// Companheiros de jornada. A etapa 2 usa esta lista para montar as cartas.
// `imagem` aponta para public/assets/animais/. Enquanto o arquivo não existir,
// a tela mostra um marcador provisório com o nome do animal.
export const animais = [
  {
    id: 'capivara',
    nome: 'Capivara',
    descricao: 'Especialista em manter a calma em situações difíceis.',
    habilidade: 'Calma',
    imagem: 'assets/animais/capivara.webp',
  },
  {
    id: 'tucano',
    nome: 'Tucano-toco',
    descricao: 'Excelente observador e navegador.',
    habilidade: 'Navegador',
    imagem: 'assets/animais/tucano.webp',
  },
  {
    id: 'tamandua',
    nome: 'Tamanduá-bandeira',
    descricao: 'Farejador de pistas e tesouros.',
    habilidade: 'Farejador',
    imagem: 'assets/animais/tamandua.webp',
  },
  {
    id: 'tuiuiu',
    nome: 'Tuiuiú',
    descricao: 'Especialista em reconhecimento aéreo e localização de caminhos.',
    habilidade: 'Reconhecimento aéreo',
    imagem: 'assets/animais/tuiuiu.webp',
  },
];

// Quantos companheiros o jogador precisa escolher.
export const QUANTIDADE_COMPANHEIROS = 2;
