// Monta o link wa.me com a frase já preenchida. Não envia nada sozinho: abre a
// conversa com o número da Arlete e a mensagem pronta, e o Leo decide enviar.
import { evento } from '../config/evento.js';

export function criarLinkWhatsapp(frase) {
  return `https://wa.me/${evento.whatsapp}?text=${encodeURIComponent(frase)}`;
}
