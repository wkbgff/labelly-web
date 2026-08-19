import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LabellyLogo } from './LabellyLogo';
import { Hover } from '../lib/Hover';

/**
 * 4개 페이지 공용 헤더. 페이지별 차이만 props 로 받습니다.
 * - active: 데스크톱/모바일 내비에서 굵게 표시할 현재 메뉴 (없으면 홈·회원탈퇴처럼 강조 없음)
 * - isMobile: 각 페이지가 소유한 breakpoint (홈 980px / 그 외 880px) 결과
 * - download: 홈은 같은 페이지 스크롤(scroll), 그 외는 홈 #download 로 이동(link)
 * 스크롤 상태와 모바일 메뉴 토글은 헤더 내부 상태입니다 (원본과 동일).
 */
type DownloadConfig = { mode: 'scroll'; onClick: () => void } | { mode: 'link' };

interface HeaderProps {
  active?: 'about' | 'support';
  isMobile: boolean;
  download: DownloadConfig;
}

export function Header({ active, isMobile, download }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setScrolled(window.scrollY > 8);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const opaque = scrolled || menuOpen;
  const headerBg = opaque ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0)';
  const headerBlur = opaque ? 'saturate(1.4) blur(14px)' : 'none';
  const headerLine = opaque ? '#E8EAED' : 'rgba(232,234,237,0)';
  const isDesktop = !isMobile;

  const onDownloadClick = () => {
    if (download.mode === 'scroll') {
      setMenuOpen(false);
      download.onClick();
    }
  };

  return (
    <div
      data-screen-label="헤더"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: headerBg,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
        borderBottom: `1px solid ${headerLine}`,
        transition: 'background 250ms ease, border-color 250ms ease',
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" aria-label="라벨리 홈" style={{ display: 'flex', alignItems: 'center' }}>
          <LabellyLogo width={88} height={26} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 12 }}>
              <NavLink to="/about" label="라벨리 소개" isActive={active === 'about'} />
              <NavLink to="/support" label="고객센터" isActive={active === 'support'} />
            </div>
          )}
          {download.mode === 'scroll' ? (
            <Hover
              as="div"
              onClick={onDownloadClick}
              style={{
                background: '#0BC2BC',
                color: '#111417',
                fontSize: 15,
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: 9999,
                cursor: 'pointer',
                transition: 'background 150ms ease',
                whiteSpace: 'nowrap',
                flex: 'none',
              }}
              hoverStyle={{ background: '#0AAFAA' }}
            >
              앱 다운로드
            </Hover>
          ) : (
            <Hover
              as={Link}
              to="/#download"
              style={{
                background: '#0BC2BC',
                color: '#111417',
                fontSize: 15,
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: 9999,
                transition: 'background 150ms ease',
                whiteSpace: 'nowrap',
                flex: 'none',
              }}
              hoverStyle={{ background: '#0AAFAA', color: '#111417' }}
            >
              앱 다운로드
            </Hover>
          )}
          {isMobile && (
            <Hover
              as="div"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="메뉴"
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 9999,
                flex: 'none',
              }}
              hoverStyle={{ background: '#F7F8F9' }}
            >
              {!menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111417" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111417" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              )}
            </Hover>
          )}
        </div>
      </div>
      {menuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E8EAED',
            padding: '8px 24px 16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: 16, fontWeight: active === 'about' ? 700 : 600, padding: '12px 4px' }}
          >
            라벨리 소개
          </Link>
          <Link
            to="/support"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: 16, fontWeight: active === 'support' ? 700 : 600, padding: '12px 4px' }}
          >
            고객센터
          </Link>
        </div>
      )}
    </div>
  );
}

function NavLink({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  if (isActive) {
    return (
      <Link
        to={to}
        style={{
          fontSize: 15,
          fontWeight: 700,
          padding: '8px 12px',
          borderRadius: 9999,
          background: '#F7F8F9',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Link>
    );
  }
  return (
    <Hover
      as={Link}
      to={to}
      style={{ fontSize: 15, fontWeight: 500, padding: '8px 12px', borderRadius: 9999, whiteSpace: 'nowrap' }}
      hoverStyle={{ background: '#F7F8F9' }}
    >
      {label}
    </Hover>
  );
}
