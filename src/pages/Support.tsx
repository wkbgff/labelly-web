import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hover } from '../lib/Hover';
import { useMediaQuery } from '../lib/useMediaQuery';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { CATS, FAQS, type Faq } from '../support-data';

export default function Support() {
  useDocumentMeta(
    '라벨리 고객센터 — 자주 묻는 질문과 문의',
    '라벨리 자주 묻는 질문(점수·데이터, 구독·광고, 계정)과 문의 채널을 안내합니다.',
  );
  const isMobile = useMediaQuery('(max-width: 880px)');
  const [tab, setTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);

  const activeCat = CATS[tab];
  const list = FAQS.filter((f) => tab === 0 || f.cat === activeCat);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#111417' }}>
      <Header active="support" isMobile={isMobile} download={{ mode: 'link' }} />

      <section data-screen-label="고객센터 헤더" style={{ maxWidth: 800, margin: '0 auto', padding: '150px 24px 48px 24px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,4.2vw,44px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25 }}>무엇을 도와드릴까요?</h1>
        <div style={{ marginTop: 24, background: '#F7F8F9', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ fontSize: 13, color: '#8A9097' }}>문의 이메일</div>
          <Hover
            as="a"
            href="mailto:labellysupport@gmail.com"
            style={{ display: 'inline-block', fontSize: 17, fontWeight: 700, marginTop: 4, textDecoration: 'underline', textUnderlineOffset: 3 }}
            hoverStyle={{ color: '#087E7A' }}
          >
            labellysupport@gmail.com
          </Hover>
          <div style={{ fontSize: 13, color: '#646B73', marginTop: 6 }}>영업일 기준 1~2일 내 답변드립니다.</div>
        </div>
      </section>

      <section data-screen-label="FAQ" style={{ maxWidth: 800, margin: '0 auto', padding: '16px 24px 72px 24px' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>자주 묻는 질문</div>
        <div data-hide-scrollbar="true" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 16, WebkitOverflowScrolling: 'touch' }}>
          {CATS.map((name, i) => (
            <div
              key={name}
              onClick={() => {
                setTab(i);
                setOpenFaq(-1);
              }}
              style={{
                flex: 'none',
                padding: '9px 16px',
                borderRadius: 9999,
                background: i === tab ? '#111417' : '#EFEFEF',
                color: i === tab ? '#FFFFFF' : '#111417',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 200ms ease, color 200ms ease',
              }}
            >
              {name}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, borderTop: '1px solid #E8EAED' }}>
          {list.map((f, i) => (
            <FaqItem key={f.q} faq={f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </section>

      <section data-screen-label="정책 문서" style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 110px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          <PolicyLink href="https://legal.labelly-app.com/terms" label="이용약관" />
          <PolicyLink href="https://legal.labelly-app.com/privacy" label="개인정보처리방침" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FaqItem({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  const bold = { fontWeight: 600, color: '#111417' } as const;
  return (
    <div style={{ borderBottom: '1px solid #E8EAED' }}>
      <Hover as="div" onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '19px 8px', cursor: 'pointer' }} hoverStyle={{ background: '#FAFBFB' }}>
        <span style={{ flex: 'none', fontSize: 12, fontWeight: 600, color: '#8A9097', background: '#F0F2F3', padding: '4px 10px', borderRadius: 9999 }}>{faq.cat}</span>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{faq.q}</div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 250ms ease' }} aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Hover>
      <div style={{ overflow: 'hidden', maxHeight: open ? 460 : 0, transition: 'max-height 320ms cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 8px 20px 8px', fontSize: 15, color: '#646B73', lineHeight: 1.75, textWrap: 'pretty' }}>
          <span>{faq.t1 ?? ''}</span>
          <span style={bold}>{faq.b1 ?? ''}</span>
          <span>{faq.t2 ?? ''}</span>
          <span style={bold}>{faq.b2 ?? ''}</span>
          <span>{faq.t3 ?? ''}</span>
          <span style={bold}>{faq.b3 ?? ''}</span>
          <span>{faq.t4 ?? ''}</span>
          {faq.deleteLink && (
            <Link to="/delete-account" style={{ color: '#111417', textDecoration: 'underline', fontWeight: 600 }}>
              회원탈퇴 안내
            </Link>
          )}
          {faq.privacyLink && (
            <a href="https://legal.labelly-app.com/privacy" target="_blank" rel="noopener" style={{ color: '#111417', textDecoration: 'underline', fontWeight: 600 }}>
              개인정보처리방침
            </a>
          )}
          <span>{faq.tail ?? ''}</span>
          {faq.caption && <div style={{ marginTop: 12, fontSize: 13, color: '#8A9097', lineHeight: 1.6 }}>{faq.caption}</div>}
        </div>
      </div>
    </div>
  );
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  return (
    <Hover
      as="a"
      href={href}
      target="_blank"
      rel="noopener"
      style={{ border: '1px solid #E8EAED', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, transition: 'background 150ms ease' }}
      hoverStyle={{ background: '#FAFBFB', color: '#111417' }}
    >
      <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </Hover>
  );
}
