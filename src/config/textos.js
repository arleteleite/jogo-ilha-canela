// Textos da narrativa e das telas. Todas as frases do jogo ficam aqui.
export const textos = {
  titulo: {
    nomeJogo: "A Aventura até a Ilha do Canela",
    introducao:
      "Existe um tesouro escondido na Ilha do Canela. Para encontrá-lo, será preciso atravessar o Lago de Palmas.",
    botaoComecar: "Começar",
  },
  companheiros: {
    instrucao: "Escolha dois companheiros para a travessia.",
    confirmacao: "Dupla escolhida:",
  },
  travessia: {
    inicio: "Vamos lá! O lago está esperando.",
    batida: "Opa, bati em alguma coisa!",
    capivara: "Calma, calma. Passou!",
    alerta: "Atenção, tem coisa à frente!",
    tesouro: "Um tesouro! Isso me dá um impulso.",
    guia: "Daqui de cima vejo o caminho livre!",
    chegada: "Chegamos à Ilha do Canela!",
    // Comentário de cada dupla. A chave são os ids de animais.js, na ordem da lista.
    duplas: {
      "capivara+tucano":
        "Capivara calma e tucano atento: essa dupla não erra o caminho.",
      "capivara+tamandua":
        "Capivara calma e tamanduá farejador: vamos com cuidado e atrás dos tesouros.",
      "capivara+tuiuiu":
        "Capivara calma e tuiuiú lá do alto: a travessia vai ser tranquila.",
      "tucano+tamandua":
        "Tucano observador e tamanduá farejador: nada escapa da nossa dupla.",
      "tucano+tuiuiu":
        "Tucano e tuiuiú: dois olhos bons e um caminho bem traçado.",
      "tamandua+tuiuiu":
        "Tamanduá e tuiuiú: um fareja tesouros, o outro enxerga o caminho.",
    },
  },
  ilha: {
    chegada: "Chegamos! A ilha do tesouro está bem na nossa frente.",
    piada: "Vamos visitar só a Ilha do Canela, porque a gente quer só canela.",
    botaoPlantar: "Plantar Canela",
  },
  semente: {
    instrucao: "Uma semente misteriosa brilha no chão.",
    revelacao: "Olá! Eu tenho um presente para você.",
    botaoConvite: "Ver o presente",
  },
  convite: {
    missaoConcluida: "Missão concluída!",
    mensagem:
      "Você desbloqueou dois ingressos. E aí, aceita embarcar nessa aventura comigo?",
    // Frases enviadas pelo WhatsApp. O Leo confirma o envio.
    frasesWhatsapp: {
      aceito:
        "Missão cumprida! Encontrei os ingressos na Ilha do Canela. Aceito embarcar nessa aventura com você: Os Melhores do Mundo, 7 de novembro, em Palmas! 🎟️",
      naoPosso:
        "Cheguei à Ilha do Canela e adorei a aventura, mas dessa vez não vou conseguir ir ao espetáculo. Vamos combinar outra?",
    },
    botaoAceito: "Aceito",
    botaoNaoPosso: "Não posso",
    botaoJogarDeNovo: "Jogar de novo",
    // Mensagem depois do clique em um dos botões (rascunho, pode ajustar).
    agradecimentoAceito:
      "Que alegria! Agora é só enviar a mensagem no WhatsApp.",
    agradecimentoNaoPosso:
      "Tudo bem! Obrigado por ter jogado. Quem sabe na próxima aventura.",
  },
  geral: {
    botaoReiniciar: "Reiniciar",
    carregando: "Carregando a aventura…",
  },
};
