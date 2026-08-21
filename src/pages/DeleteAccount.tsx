import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hover } from '../lib/Hover';
import { useMediaQuery } from '../lib/useMediaQuery';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/**
 * 회원탈퇴 안내 페이지.
 * 접근성 요건: 아코디언 헤더는 <button> + aria-expanded + aria-controls, 패널은 role="region".
 * 접힌 콘텐츠는 조건부 렌더링하지 않고 항상 DOM에 두되 grid-template-rows(1fr/0fr)로만 접습니다
 * (Google Play 심사자·크롤러가 읽을 수 있도록).
 */
export default function DeleteAccount() {
  useDocumentMeta(
    '라벨리 회원탈퇴 안내',
    '라벨리 계정 삭제(회원탈퇴) 방법을 안내합니다. 앱 내 삭제 경로와 이메일 요청 절차, 삭제되는 데이터 항목.',
  );
  const isMobile = useMediaQuery('(max-width: 880px)');
  const [openApp, setOpenApp] = useState(false);
  const [openMail, setOpenMail] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#111417' }}>
      <Header isMobile={isMobile} download={{ mode: 'link' }} />

      <section data-screen-label="탈퇴 안내 헤더" style={{ maxWidth: 760, margin: '0 auto', padding: '150px 24px 40px 24px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,4.2vw,42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          회원탈퇴 안내
        </h1>
        <p style={{ margin: '16px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7, textWrap: 'pretty' }}>
          라벨리 계정 삭제 방법을 안내합니다. 계정을 삭제하면 아래 데이터가 함께 삭제되며, 복구할 수 없습니다.
        </p>
      </section>

      <section data-screen-label="구독 안내" style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: '#FDF6E7', border: '1px solid #EFE0BC', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 22, height: 22, borderRadius: 9999, background: '#9A6B10', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="7" r="0.5" fill="#FFFFFF" />
              <line x1="12" y1="11" x2="12" y2="17.5" />
            </svg>
          </div>
          <div style={{ fontSize: 14, color: '#6E4E0C', lineHeight: 1.65 }}>
            <span style={{ fontWeight: 700 }}>계정을 삭제해도 구독은 자동으로 해지되지 않습니다.</span> App Store와 Google Play의 구독은 스토어에서 관리되기 때문에, 계정 삭제와 별개로 처리됩니다. 구독 중이시라면 탈퇴 전에 스토어에서 구독을 먼저 해지해 주세요.
          </div>
        </div>
      </section>

      <section data-screen-label="탈퇴 방법" style={{ maxWidth: 760, margin: '0 auto', padding: '44px 24px 0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 방법 1 · 권장 — 앱에서 직접 삭제 */}
        <div style={{ border: '1px solid #E8EAED', borderRadius: 20, overflow: 'hidden', background: '#FFFFFF' }}>
          <Hover
            as="button"
            type="button"
            id="acc-app-header"
            aria-controls="acc-app-panel"
            aria-expanded={openApp}
            onClick={() => setOpenApp((v) => !v)}
            style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 0, margin: 0, padding: '22px 22px 22px 24px', display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: '#111417', transition: 'background 150ms ease' }}
            hoverStyle={{ background: '#FAFBFB' }}
          >
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ background: '#111417', color: '#FFFFFF', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 9999 }}>방법 1 · 권장</span>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>앱에서 직접 삭제하기</span>
              </span>
              <span style={{ fontSize: 14, color: '#646B73', lineHeight: 1.6 }}>마이페이지에서 3단계로 즉시 처리됩니다</span>
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', transform: openApp ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Hover>
          <div id="acc-app-panel" role="region" aria-labelledby="acc-app-header" style={{ display: 'grid', gridTemplateRows: openApp ? '1fr' : '0fr', transition: 'grid-template-rows 250ms ease' }}>
            <div style={{ overflow: 'hidden', minHeight: 0 }}>
              <div style={{ padding: '0 24px 26px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Step n="1">
                    라벨리 앱에서 <span style={{ fontWeight: 700 }}>마이페이지</span> 탭을 엽니다.
                  </Step>
                  <Step n="2">
                    화면 아래의 <span style={{ fontWeight: 700 }}>회원 탈퇴</span>를 선택합니다.
                  </Step>
                  <Step n="3">
                    안내를 확인한 뒤 <span style={{ fontWeight: 700 }}>탈퇴하기</span>를 누르면 즉시 처리됩니다.
                  </Step>
                </div>
                <div style={{ marginTop: 28, background: '#F7F8F9', borderRadius: 20, padding: 28, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                  {/* 마이페이지 목업 */}
                  <div style={{ width: 230, background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 16, boxSizing: 'border-box' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>마이페이지</div>
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
                      {['알레르기 설정', '구독 관리', '이용약관'].map((label) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 2px', borderBottom: '1px solid #EFEFEF' }}>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, border: '2px solid #0BC2BC', borderRadius: 10, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>회원 탈퇴</span>
                        <span style={{ background: '#0BC2BC', color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999 }}>2단계</span>
                      </div>
                    </div>
                  </div>
                  {/* 회원 탈퇴 확인 목업 */}
                  <div style={{ width: 230, background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 16, boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111417" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>회원 탈퇴</span>
                    </div>
                    <div style={{ marginTop: 12, background: '#FBEAEA', border: '1px solid #f3c6c6', borderRadius: 10, padding: 10, fontSize: 11, fontWeight: 700, color: '#B3121C', lineHeight: 1.5 }}>
                      정말 탈퇴하시겠어요? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없어요
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700 }}>탈퇴하시는 이유를 알려주세요</div>
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {['더 이상 사용하지 않아요', '원하는 상품이 없어요'].map((reason) => (
                        <div key={reason} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 12, height: 12, borderRadius: 9999, border: '1.5px solid #D5DADF' }} />
                          <span style={{ fontSize: 11, color: '#5e5e5e' }}>{reason}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                      <div style={{ flex: 1, background: '#EFEFEF', borderRadius: 9999, padding: 9, textAlign: 'center', fontSize: 11, fontWeight: 700 }}>취소</div>
                      <div style={{ flex: 1, background: '#E5484D', borderRadius: 9999, padding: 9, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <span>탈퇴하기</span>
                        <span style={{ background: 'rgba(255,255,255,0.25)', fontSize: 9, padding: '1px 6px', borderRadius: 9999 }}>3단계</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 방법 2 — 이메일 요청 */}
        <div style={{ border: '1px solid #E8EAED', borderRadius: 20, overflow: 'hidden', background: '#FFFFFF' }}>
          <Hover
            as="button"
            type="button"
            id="acc-mail-header"
            aria-controls="acc-mail-panel"
            aria-expanded={openMail}
            onClick={() => setOpenMail((v) => !v)}
            style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 0, margin: 0, padding: '22px 22px 22px 24px', display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: '#111417', transition: 'background 150ms ease' }}
            hoverStyle={{ background: '#FAFBFB' }}
          >
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ background: '#EFEFEF', color: '#111417', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 9999 }}>방법 2</span>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>앱에 접근할 수 없을 때</span>
              </span>
              <span style={{ fontSize: 14, color: '#646B73', lineHeight: 1.6 }}>이메일로 탈퇴를 요청할 수 있습니다</span>
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', transform: openMail ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Hover>
          <div id="acc-mail-panel" role="region" aria-labelledby="acc-mail-header" style={{ display: 'grid', gridTemplateRows: openMail ? '1fr' : '0fr', transition: 'grid-template-rows 250ms ease' }}>
            <div style={{ overflow: 'hidden', minHeight: 0 }}>
              <div style={{ padding: '0 24px 26px 24px' }}>
                <p style={{ margin: '0 0 18px 0', fontSize: 15, color: '#646B73', lineHeight: 1.7, textWrap: 'pretty' }}>
                  앱을 삭제했거나 기기를 사용할 수 없는 경우, 이메일로 탈퇴를 요청할 수 있습니다.
                </p>
                <div style={{ background: '#F7F8F9', borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <StepDot n="1" />
                      <div style={{ fontSize: 15, lineHeight: 1.65, paddingTop: 2 }}>
                        <span style={{ fontWeight: 700 }}>가입한 이메일 주소에서</span>{' '}
                        <a href="mailto:labellysupport@gmail.com?subject=회원탈퇴 요청" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                          labellysupport@gmail.com
                        </a>
                        으로 "회원탈퇴 요청" 메일을 보냅니다.
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <StepDot n="2" />
                      <div style={{ fontSize: 15, lineHeight: 1.65, paddingTop: 2 }}>본인 확인을 위해 가입 이메일 주소와 일치하는지 확인합니다.</div>
                    </div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <StepDot n="3" />
                      <div style={{ fontSize: 15, lineHeight: 1.65, paddingTop: 2 }}>확인이 완료되면 지체 없이 삭제 처리하고, 완료 사실을 회신해 드립니다.</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, fontSize: 13, color: '#8A9097', lineHeight: 1.6 }}>
                    가입 이메일이 아닌 주소로 요청하시는 경우, 본인 확인을 위한 추가 절차가 필요할 수 있습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-screen-label="삭제 항목" style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
          <div style={{ background: '#F7F8F9', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>삭제되는 정보</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['계정 정보', '스캔 기록과 즐겨찾기', '페르소나·알레르기 설정', '자가등록 시 업로드한 상품 사진'].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B3121C" strokeWidth="2.4" strokeLinecap="round" style={{ flex: 'none', marginTop: 3 }} aria-hidden="true">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                  <span style={{ fontSize: 14, color: '#111417', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: '1px solid #E8EAED', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>유지될 수 있는 정보</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 14, color: '#646B73', lineHeight: 1.65 }}>회원님이 자가등록(제보)하신 상품 정보와 제보 이력은 삭제되지 않고, 제보자를 알 수 없도록 익명 처리된 뒤 서비스 운영을 위해 유지될 수 있습니다. (업로드하신 원본 사진은 위와 같이 삭제됩니다.)</div>
              <div style={{ fontSize: 14, color: '#646B73', lineHeight: 1.65 }}>법령에 따라 보존 의무가 있는 정보는 해당 법령이 정한 기간 동안 보관됩니다.</div>
            </div>
            <div style={{ marginTop: 14, fontSize: 13, color: '#8A9097', lineHeight: 1.6 }}>
              자세한 내용은{' '}
              <a href="https://legal.labelly-app.com/privacy" target="_blank" rel="noopener" style={{ color: '#646B73', textDecoration: 'underline' }}>
                개인정보처리방침
              </a>
              을 확인하세요.
            </div>
          </div>
        </div>
      </section>

      <section data-screen-label="탈퇴 문의" style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 110px 24px' }}>
        <div style={{ borderTop: '1px solid #E8EAED', paddingTop: 24, fontSize: 14, color: '#646B73', lineHeight: 1.7 }}>
          처리 과정에서 궁금한 점이 있다면{' '}
          <Link to="/support" style={{ color: '#111417', textDecoration: 'underline', fontWeight: 600 }}>
            고객센터
          </Link>
          로 문의해 주세요.
        </div>
      </section>

      <Footer />
    </div>
  );
}

/** 번호 뱃지(회색 원) + 본문 한 줄 (앱 방법 단계) */
function Step({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 9999, background: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{n}</span>
      <div style={{ fontSize: 15, lineHeight: 1.65, color: '#111417', paddingTop: 2 }}>{children}</div>
    </div>
  );
}

/** 번호 뱃지만 (이메일 방법 단계 — 본문은 호출부에서 직접 구성) */
function StepDot({ n }: { n: string }) {
  return (
    <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 9999, background: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{n}</span>
  );
}
