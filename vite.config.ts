import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// GitHub Pages SPA 폴백: 빌드 후 dist/index.html → dist/404.html 로 복사.
// Pages는 매칭되는 파일이 없는 경로(예: /delete-account 직접 접근)에 404.html을 주는데,
// 그게 index.html과 동일하면 같은 SPA가 부팅되어 React Router가 해당 경로를 렌더한다.
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      try {
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
      } catch {
        /* index.html이 없으면(라이브러리 빌드 등) 무시 */
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/', // apex 커스텀 도메인(labelly-app.com) 기준
  plugins: [react(), spaFallback404()],
});
