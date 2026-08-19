# 라벨리 공식 웹사이트 (labelly-web)

라벨리(labelly-app.com) 공식 웹사이트입니다. Claude Design 시안을 Vite + React + TypeScript 앱으로 이관했습니다.

## 기술 스택

- **Vite + React 19 + TypeScript**
- **react-router-dom** (BrowserRouter)
- **Tailwind CSS v3** — 시안이 전부 인라인 스타일 기반이라 시안 픽셀을 그대로 보존하기 위해 **preflight(전역 리셋)를 비활성화**했습니다 (`tailwind.config.js`의 `corePlugins.preflight = false`).
- 폰트: **Pretendard** (jsDelivr CDN, `index.html`에서 로드)

## 시작하기

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크(tsc -b) + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 라우팅

| 경로 | 페이지 | 원본 시안 |
| --- | --- | --- |
| `/` | 홈 | `라벨리 웹 홈.dc.html` |
| `/about` | 라벨리 소개 | `라벨리 웹 소개.dc.html` |
| `/support` | 고객센터 | `라벨리 웹 고객센터.dc.html` |
| `/delete-account` | 회원탈퇴 안내 | `라벨리 웹 회원탈퇴.dc.html` |

알 수 없는 경로는 홈(`/`)으로 리다이렉트됩니다.

## 구조

```
src/
  main.tsx          # 엔트리 (BrowserRouter)
  App.tsx           # 라우트 정의 + 라우트 변경 시 스크롤 상단 이동
  index.css         # 전역 스타일(시안 <helmet><style> 이관) + Tailwind 지시자
  site-config.ts    # 공용 상수 단일 소스: stats / storeUrls / DEMO / salesRegNo
  support-data.ts   # 고객센터 FAQ 데이터 (CATS / FAQS)
  components/        # Header, Footer, LabellyLogo (4개 페이지 공용)
  lib/               # useMediaQuery, useReveal, Hover 등 시안 동작 재현 헬퍼
  pages/             # Home, About, Support, DeleteAccount
public/logos/        # 파비콘
```

## 이관 원칙

- 디자인·문구·애니메이션·레이아웃은 원본 시안을 **임의로 바꾸지 않고 그대로** 이관했습니다.
- 다음을 보존했습니다:
  - 접근성 속성 — 회원탈퇴 아코디언의 `<button>` / `aria-expanded` / `aria-controls` / `role="region"`
  - `prefers-reduced-motion` 분기 (JS 애니메이션 + 전역 CSS)
  - `word-break: keep-all` 전역 적용
  - 카운트업, 스크롤 스태거, 호버 스포트라이트, 히어로 스캔 사이클, 스티키 스크롤 페르소나 데모 등 모든 인터랙션
- **회원탈퇴 페이지 아코디언의 접힌 콘텐츠는 조건부 렌더링 없이 항상 DOM에 유지**하고, CSS(`grid-template-rows` 0fr↔1fr)로만 접습니다. (Google Play 심사자·크롤러가 읽을 수 있도록)
- 사이트 공용 상수(`stats` / `storeUrls` / `DEMO`)는 `src/site-config.ts` 한 곳에서만 관리하며 4개 페이지가 모두 이를 참조합니다.
