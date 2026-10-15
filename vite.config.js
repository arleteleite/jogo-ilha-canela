import { defineConfig } from 'vite';

// base './' faz os caminhos serem relativos, para funcionar no GitHub Pages
// (ex.: usuario.github.io/repositorio/) sem depender do seu computador.
export default defineConfig({
  base: './',
});
