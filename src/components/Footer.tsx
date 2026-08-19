import { Link } from 'react-router-dom';
import { LabellyLogo } from './LabellyLogo';
import { Hover } from '../lib/Hover';
import { storeUrls, salesRegNo } from '../site-config';

/** 4개 페이지 공용 푸터 (원본 시안에서 모든 페이지가 동일). 스토어 URL·신고번호는 site-config 참조. */
export function Footer() {
  const storePillStyle = {
    border: '1px solid #E8EAED',
    background: '#FFFFFF',
    borderRadius: 9999,
    padding: '7px 14px',
    fontSize: 12,
    fontWeight: 500,
    color: '#646B73',
    whiteSpace: 'nowrap' as const,
    transition: 'background 150ms ease',
  };
  const storePillHover = { background: '#F0F2F3', color: '#111417' };

  return (
    <div data-screen-label="푸터" style={{ background: '#F7F8F9', borderTop: '1px solid #E8EAED' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 40px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
          <div style={{ flex: '1.4 1 300px', minWidth: 0 }}>
            <LabellyLogo width={81} height={24} />
            <div style={{ fontSize: 14, color: '#646B73', lineHeight: 1.6, marginTop: 12, maxWidth: 300 }}>
              한국 식품을 내 페르소나 기준으로 확인하는 바코드 스캔 앱
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Hover as="a" href={storeUrls.appStore} style={storePillStyle} hoverStyle={storePillHover}>
                App Store
              </Hover>
              <Hover as="a" href={storeUrls.googlePlay} style={storePillStyle} hoverStyle={storePillHover}>
                Google Play
              </Hover>
            </div>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#8A9097' }}>메뉴</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              <Link to="/about" style={{ fontSize: 14, fontWeight: 500 }}>
                라벨리 소개
              </Link>
              <Link to="/support" style={{ fontSize: 14, fontWeight: 500 }}>
                고객센터
              </Link>
              <Link to="/delete-account" style={{ fontSize: 14, fontWeight: 500 }}>
                회원탈퇴
              </Link>
            </div>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#8A9097' }}>법적 고지</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              <a href="https://legal.labelly-app.com/terms" target="_blank" rel="noopener" style={{ fontSize: 14, fontWeight: 500 }}>
                이용약관
              </a>
              <a href="https://legal.labelly-app.com/privacy" target="_blank" rel="noopener" style={{ fontSize: 14, fontWeight: 500 }}>
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #E8EAED', marginTop: 40, paddingTop: 24 }}>
          <div style={{ fontSize: 13, color: '#8A9097', lineHeight: 1.8 }}>
            쓰리스타즈 | 대표 김성태 | 사업자등록번호 227-21-62488 | 주소 경기도 하남시 미사강변한강로 135, 스카이폴리스 가1029호 | 문의{' '}
            <a href="mailto:labellysupport@gmail.com" style={{ color: '#646B73', textDecoration: 'underline' }}>
              labellysupport@gmail.com
            </a>
            {salesRegNo.trim().length > 0 && <span> | 통신판매업신고 {salesRegNo}</span>}
          </div>
          <div style={{ fontSize: 12, color: '#8A9097', lineHeight: 1.7, marginTop: 12 }}>
            라벨리가 제공하는 점수와 정보는 의학적 조언이 아니며, 제품 구매·섭취 전 실제 포장의 표시사항을 반드시 확인하세요.
          </div>
          <div style={{ fontSize: 12, color: '#B4BAC0', marginTop: 12 }}>© 2026 threestars</div>
        </div>
      </div>
    </div>
  );
}
