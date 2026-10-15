# A Aventura até a Ilha do Canela

Jogo web curto e personalizado, feito como convite para o espetáculo *Os Melhores do Mundo*.
Funciona no navegador, sem backend e sem cadastro.

## Rodar localmente

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

Para testar no celular na mesma rede Wi-Fi: `npm run dev -- --host` e abra o endereço de rede que aparecer.

## Gerar a versão de publicação

```bash
npm run build      # gera a pasta dist/
npm run preview    # testa a versão gerada
```

## Onde mudar o quê

| Quer mudar | Arquivo |
|---|---|
| Frases, falas e textos das telas | `src/config/textos.js` |
| Nome, data, cidade e número do WhatsApp | `src/config/evento.js` |
| Animais, descrições e habilidades | `src/config/animais.js` |
| Duração das animações e da travessia | `src/config/animacoes.js` |
| Imagens usadas no carregamento | `src/config/recursos.js` |
| Imagens do jogo | `public/assets/` (formato WebP) |

## Imagens

As imagens do jogo ficam em `public/assets/`, no formato WebP, com transparência.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie este projeto para a branch `main`.
2. No repositório, vá em **Settings → Pages** e escolha **GitHub Actions** como fonte.
3. A cada push para `main`, o workflow `.github/workflows/deploy.yml` roda o build e publica.
4. O link fica no formato `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

Os caminhos são relativos (`base: './'` em `vite.config.js`), então o jogo funciona nesse endereço sem ajustes.
