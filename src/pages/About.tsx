import { useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hover } from '../lib/Hover';
import { useMediaQuery } from '../lib/useMediaQuery';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useReveal } from '../lib/useReveal';
import { useSiteStats } from '../lib/useSiteStats';
import { storeUrls } from '../site-config';

// 페르소나는 앱에서 고르는 나의 건강 관심사 (소개 페이지)
const PERSONAS = [
  { name: '체중감량', pre: '', bold: '섭취 열량', post: '을 관리하고 싶다면' },
  { name: '근육증가', pre: '', bold: '단백질', post: ' 섭취를 챙기고 싶다면' },
  { name: '혈당관리', pre: '', bold: '당류', post: ' 섭취가 신경 쓰인다면' },
  { name: '저염식단', pre: '', bold: '나트륨', post: ' 섭취를 줄이고 싶다면' },
  { name: '저탄고지', pre: '', bold: '탄수화물', post: '을 제한하는 식단이라면' },
  { name: '시니어', pre: '본인이나 ', bold: '부모님의 먹거리', post: '를 살핀다면' },
];

const personaChipStyle = {
  display: 'inline-block',
  background: '#EFEFEF',
  color: '#111417',
  fontSize: 14,
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: 9999,
  whiteSpace: 'nowrap' as const,
  transition: 'background 180ms cubic-bezier(0.16,1,0.3,1), color 180ms cubic-bezier(0.16,1,0.3,1)',
};

export default function About() {
  useDocumentMeta(
    '라벨리 소개 — 점수의 원칙과 데이터',
    '라벨리 점수의 원칙, 7가지 페르소나, 데이터 출처를 소개합니다. 한국 식품 전문 바코드 스캔 앱.',
  );
  const isMobile = useMediaQuery('(max-width: 880px)');
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);
  const stats = useSiteStats();

  return (
    <div ref={rootRef} style={{ minHeight: '100vh', background: '#FFFFFF', color: '#111417' }}>
      <Header active="about" isMobile={isMobile} download={{ mode: 'link' }} />

      <section data-screen-label="소개 히어로" style={{ maxWidth: 1080, margin: '0 auto', padding: '150px 24px 88px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>라벨리 소개</div>
        <h1 style={{ margin: '14px 0 0 0', fontSize: 'clamp(34px,4.6vw,52px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 900 }}>
          점수에 스폰서는 없습니다.
        </h1>
        <p style={{ margin: '22px 0 0 0', fontSize: 17, lineHeight: 1.7, color: '#646B73', maxWidth: 640 }}>
          라벨리는 광고나 협찬이 점수를 바꿀 수 없는 구조로 설계되었습니다.
          <br />
          무엇을 보는지, 그리고 무엇을 약속할 수 없는지까지 정직하게 보여줍니다.
        </p>
      </section>

      <section data-screen-label="점수 산출 원칙" style={{ background: '#F7F8F9' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>점수 산출 원칙</div>
          <h2 style={{ margin: '10px 0 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>무엇을 보고 점수를 매기나요</h2>
          <p style={{ margin: '16px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7, maxWidth: 800 }}>
            라벨리는 제품의 <strong style={{ fontWeight: 600, color: '#111417' }}>영양성분</strong>, <strong style={{ fontWeight: 600, color: '#111417' }}>첨가물</strong>, <strong style={{ fontWeight: 600, color: '#111417' }}>가공 수준</strong> 같은 항목을 전체적으로 확인합니다. 페르소나별 세부 가중치와 계산식은 악용 방지를 위해 공개하지 않습니다.
          </p>
          <div data-reveal={0} style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {[
              { title: '영양성분', desc: '나트륨·당류·단백질·지방 등 표시된 핵심 수치를 확인합니다.' },
              { title: '첨가물', desc: '원재료명에 표시된 정보를 기준으로 확인합니다.' },
              { title: '가공 수준', desc: '카테고리 특성을 반영해 같은 기준으로 비교합니다.' },
            ].map((c) => (
              <div key={c.title} style={{ background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{c.title}</div>
                <div style={{ fontSize: 14, color: '#646B73', lineHeight: 1.65, marginTop: 6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
            <div data-reveal={0} style={{ background: '#111417', color: '#FFFFFF', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0BC2BC' }}>검증 가능한 약속</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10, lineHeight: 1.4 }}>
                같은 입력이면,
                <br />
                언제나 같은 출력
              </div>
              <div style={{ fontSize: 14, color: '#A5ABB3', lineHeight: 1.7, marginTop: 10 }}>점수는 정해진 기준의 코드로만 계산합니다. 언제 누가 스캔해도, 같은 제품·같은 페르소나라면 같은 점수입니다.</div>
            </div>
            <div data-reveal={60} style={{ background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>개인화</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10, lineHeight: 1.4 }}>
                개개인마다 중요하게
                <br />
                보는 것이 다릅니다
              </div>
              <div style={{ fontSize: 14, color: '#646B73', lineHeight: 1.7, marginTop: 10 }}>개개인마다 무엇을 중요하게 볼지가 다르기 때문에, 라벨리는 7가지 페르소나로 나누어 같은 제품이라도 당신이 고른 페르소나에 따라 각각 다른 점수를 매깁니다.</div>
            </div>
          </div>
        </div>
      </section>

      <section data-screen-label="페르소나 7종" style={{ maxWidth: 1080, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>7가지 페르소나</div>
        <h2 style={{ margin: '10px 0 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>페르소나를 고르면, 기준이 바뀝니다</h2>
        <p style={{ margin: '14px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7, maxWidth: 620 }}>페르소나는 앱에서 고르는 나의 건강 관심사입니다. 무엇을 고르느냐에 따라 점수 기준이 달라집니다.</p>

        <div data-persona-list="true" style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div data-reveal={0}>
            <div data-persona-card="true" style={{ border: '1px solid #E8EAED', borderRadius: 16, padding: '24px 26px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, transition: 'opacity 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms cubic-bezier(0.16,1,0.3,1)' }}>
              <span data-persona-chip="true" style={{ flex: 'none', background: '#EFEFEF', color: '#111417', fontSize: 15, fontWeight: 500, padding: '10px 18px', borderRadius: 9999, whiteSpace: 'nowrap', transition: 'background 180ms cubic-bezier(0.16,1,0.3,1), color 180ms cubic-bezier(0.16,1,0.3,1)' }}>종합건강관리</span>
              <span data-persona-desc="true" style={{ flex: '1 1 240px', minWidth: 0, fontSize: 16, lineHeight: 1.6, color: '#646B73', transition: 'color 180ms cubic-bezier(0.16,1,0.3,1)' }}>
                <strong style={{ fontWeight: 600, color: '#111417' }}>전반적인 균형</strong>을 보고 싶다면
              </span>
              <span style={{ flex: 'none', background: '#F0F2F3', color: '#646B73', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 9999, whiteSpace: 'nowrap' }}>기본값</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(232px,1fr))', gap: 12 }}>
            {PERSONAS.map((p, i) => (
              <div key={p.name} data-reveal={i * 60} style={{ display: 'flex' }}>
                <div data-persona-card="true" style={{ flex: 1, border: '1px solid #E8EAED', borderRadius: 16, padding: 22, boxSizing: 'border-box', transition: 'opacity 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms cubic-bezier(0.16,1,0.3,1)' }}>
                  <span data-persona-chip="true" style={personaChipStyle}>{p.name}</span>
                  <div data-persona-desc="true" style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6, color: '#646B73', transition: 'color 180ms cubic-bezier(0.16,1,0.3,1)' }}>
                    {p.pre}
                    <strong style={{ fontWeight: 600, color: '#111417' }}>{p.bold}</strong>
                    {p.post}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, fontSize: 15, color: '#646B73', lineHeight: 1.7, maxWidth: 720 }}>페르소나마다 기준이 다르기 때문에, 같은 제품도 선택한 페르소나에 따라 다른 점수를 받습니다.</div>
      </section>

      <section data-screen-label="데이터 출처" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 100px 24px' }}>
        <div style={{ background: '#F7F8F9', borderRadius: 20, padding: '48px 40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: '1.4 1 360px', minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>데이터 출처</div>
            <h2 style={{ margin: '10px 0 0 0', fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 }}>출처가 분명한 데이터만 씁니다</h2>
            <p style={{ margin: '14px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7 }}>라벨리의 상품 데이터는 한국식품안전관리인증원(HACCP)과 식품의약품안전처(푸드QR)가 제공하는 공공데이터, 그리고 사용자 제보를 기반으로 합니다.</p>
            <Link to="/support" style={{ display: 'inline-block', marginTop: 16, fontSize: 14, fontWeight: 600, color: '#646B73', textDecoration: 'underline' }}>
              데이터 오류 제보하기
            </Link>
          </div>
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DataRow label="등록 상품" valueStyle={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }} value={stats.productCountLabel} />
            <DataRow label="공공데이터 소스" valueStyle={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }} value="HACCP · 푸드QR" />
            <DataRow label="사용자 제보" valueStyle={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }} value="검토 후 반영" />
          </div>
        </div>
      </section>

      <section data-screen-label="알레르기 원칙" style={{ background: '#111417', color: '#FFFFFF' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '110px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0BC2BC' }}>알레르기 처리 원칙</div>
          <div style={{ marginTop: 18, fontSize: 'clamp(24px,3.4vw,34px)', fontWeight: 700, lineHeight: 1.45, letterSpacing: '-0.01em' }}>
            "잘못 안심시키는 것이
            <br />
            가장 위험하다고 생각합니다."
          </div>
          <p style={{ margin: '20px auto 0 auto', fontSize: 16, color: '#A5ABB3', lineHeight: 1.75, maxWidth: 560 }}>법정 알레르기 21종을 표준명칭 기준으로만 확인하고, 확실하지 않으면 표시하지 않습니다. 그리고 항상 실제 포장의 표시사항을 함께 확인하시길 권합니다.</p>
        </div>
      </section>

      <section data-screen-label="한계와 약속" style={{ maxWidth: 1080, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>한계와 약속</div>
        <h2 style={{ margin: '10px 0 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>못 하는 것부터 말씀드립니다</h2>
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
          <div data-reveal={0} style={{ border: '1px solid #E8EAED', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>의학적 조언이 아닙니다</div>
            <div style={{ fontSize: 15, color: '#646B73', lineHeight: 1.7, marginTop: 8 }}>라벨리의 점수와 정보는 선택한 페르소나 기준의 상대 평가입니다. 질병의 진단·치료와는 무관하며, 건강과 관련된 결정은 전문가와 상의하세요.</div>
          </div>
          <div data-reveal={60} style={{ border: '1px solid #E8EAED', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>오류는 바로잡습니다</div>
            <div style={{ fontSize: 15, color: '#646B73', lineHeight: 1.7, marginTop: 8 }}>데이터 오류나 잘못된 표시를 발견하시면 알려주세요. 확인 후 바로잡습니다. 문의는 영업일 기준 1~2일 내 답변드립니다.</div>
            <Link to="/support" style={{ display: 'inline-block', marginTop: 14, fontSize: 14, fontWeight: 600, color: '#646B73', textDecoration: 'underline' }}>
              고객센터로 제보하기
            </Link>
          </div>
        </div>
      </section>

      <section data-screen-label="소개 CTA" style={{ background: '#EFFBFA' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '88px 24px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px,3.6vw,38px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>다음 장보기부터, 스캔하고 고르세요.</h2>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            <StoreButton href={storeUrls.appStore} kind="appstore" />
            <StoreButton href={storeUrls.googlePlay} kind="googleplay" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DataRow({ label, value, valueStyle }: { label: string; value: string; valueStyle: CSSProperties }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 12, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

/** 소개 CTA 스토어 버튼 (홈 CTA와 동일 스타일: 흰 배경 · 연한 테두리) */
function StoreButton({ href, kind }: { href: string; kind: 'appstore' | 'googleplay' }) {
  return (
    <Hover
      as="a"
      href={href}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', border: '1px solid #DCE5E4', borderRadius: 12, background: '#FFFFFF', transition: 'background 150ms ease' }}
      hoverStyle={{ background: '#F5FBFA', color: '#111417' }}
    >
      {kind === 'appstore' ? (
        <svg width="21" height="21" viewBox="0 0 384 512" fill="#111417" aria-hidden="true">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.7-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#111417" aria-hidden="true">
          <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
        </svg>
      )}
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 10, color: '#8A9097', lineHeight: 1.2, whiteSpace: 'nowrap' }}>다운로드</div>
        <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{kind === 'appstore' ? 'App Store' : 'Google Play'}</div>
      </div>
    </Hover>
  );
}
