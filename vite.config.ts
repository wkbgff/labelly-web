import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// GitHub Pages는 SPA 히스토리 라우팅을 기본 지원하지 않아, 각 경로로 "직접 접근"하면
// 매칭 파일이 없어 404가 난다. 404.html 폴백만으로는 SPA가 부팅돼도 HTTP 상태가 404라,
// 심사자가 URL을 직접 열고 200을 기대하는 케이스(스토어 심사 직결)를 만족하지 못한다.
// → 빌드 후 각 라우트에 index.html 사본을 정적 파일({route}.html)로 깐다. Pages는
// /about → about.html 을 리다이렉트 없이 200으로 서빙하고, 부팅된 동일 SPA를 React
// Router가 해당 경로로 렌더한다(index.html 자산 참조는 절대경로 /assets/... 라 어느
// 경로에서 서빙돼도 로드됨). 그 외 알 수 없는 경로 대비로 404.html(SPA 사본)도 유지.
const SPA_ROUTES = ['about', 'support', 'delete-account']; // src/App.tsx의 라우트(홈 '/' 제외)

function spaStaticRoutes(): Plugin {
  return {
    name: 'spa-static-routes',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      const index = resolve(dist, 'index.html');
      try {
        for (const route of SPA_ROUTES) {
          copyFileSync(index, resolve(dist, `${route}.html`));
        }
        copyFileSync(index, resolve(dist, '404.html'));
      } catch {
        /* index.html이 없으면(라이브러리 빌드 등) 무시 */
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/', // apex 커스텀 도메인(labelly-app.com) 기준
  plugins: [react(), spaStaticRoutes()],
});
