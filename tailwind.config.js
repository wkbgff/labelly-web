/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // 시안은 전부 인라인 스타일 기반입니다. Tailwind의 preflight(전역 리셋: box-sizing,
  // margin 초기화 등)를 켜면 픽셀 단위 레이아웃이 바뀌므로, 시안 보존을 위해 비활성화합니다.
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
