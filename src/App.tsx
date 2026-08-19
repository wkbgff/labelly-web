import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Support from './pages/Support';
import DeleteAccount from './pages/DeleteAccount';

/**
 * 라우트 이동 시 스크롤을 최상단으로 되돌립니다(원본은 페이지마다 별도 HTML이라 항상 최상단에서 시작).
 * 단, 해시(#download)가 있으면 각 페이지가 해당 위치로 스크롤을 처리하도록 건드리지 않습니다.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        {/* 알 수 없는 경로는 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
