// Parâmetros de tempo e movimento. Ajuste aqui para deixar as animações mais
// rápidas ou mais lentas. Todos os valores estão em milissegundos, salvo indicação.
export const animacoes = {
  // Duração de cada transição entre cenas.
  transicaoCena: 600,
  // Pausa depois de escolher os dois companheiros, antes de sair para a travessia.
  pausaAposEscolha: 1200,
  // Tempo máximo da travessia; depois disso o barco chega sozinho.
  travessiaTempoMaximo: 40000,
  // Tempo que a travessia leva sem nenhuma batida.
  travessiaDuracao: 30000,
  // Velocidade de descida dos obstáculos, em alturas da tela por segundo.
  velocidadeObstaculo: 0.32,
  // Intervalo entre obstáculos (ms).
  intervaloObstaculo: 1100,
  // Intervalo entre tesouros, só com o tamanduá (ms).
  intervaloTesouro: 4500,
  // Intervalo entre as ajudas do tuiuiú e duração de cada uma (ms).
  intervaloGuia: 12000,
  duracaoGuia: 2500,
  // Tremor da tela ao bater: duração (ms) e tamanho máximo do deslocamento (px).
  duracaoTremor: 400,
  intensidadeTremor: 10,
  // Quanto a batida desacelera o barco, e por quanto tempo (ms).
  fatorLentidao: 0.5,
  duracaoLentidao: 1500,
  // Quanto cada tesouro adianta a travessia (fração do trajeto).
  bonusTesouro: 0.025,
  // Linha do tempo da semente, em ms desde o início da cena.
  sementeBrilho: 900,
  sementeRaizes: 1900,
  sementeCresce: 3000,
  sementeClarao: 5000,
  sementeArlete: 5400,
  sementeRevelacao: 6000,
  // Redução do tempo quando o sistema pede menos movimento (1 = tempo normal).
  fatorTempoReduzido: 0.35,
};
