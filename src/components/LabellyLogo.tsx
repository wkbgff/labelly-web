import { useId } from 'react';

interface LabellyLogoProps {
  width?: number;
  height?: number;
}

/** 라벨리 워드마크 로고 (헤더·푸터 공용). mask id는 인스턴스마다 고유하게 생성해 id 충돌을 피합니다. */
export function LabellyLogo({ width = 88, height = 26 }: LabellyLogoProps) {
  const maskId = 'lb-' + useId().replace(/:/g, '');
  return (
    <svg width={width} height={height} viewBox="0 0 161.3 48" role="img" aria-label="라벨리">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
          <rect width="48" height="48" rx="11.5" fill="#fff" />
          <path
            d="M14 14H34V24H14V34H34"
            fill="none"
            stroke="#000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <rect width="48" height="48" rx="11.5" fill="#1A1A1A" mask={`url(#${maskId})`} />
      <path d="M14 24H34" fill="none" stroke="#0BC2BC" strokeWidth="5" strokeLinecap="round" />
      <g fill="#1A1A1A">
        <path
          transform="translate(62 34.5) scale(0.03223 -0.03223)"
          d="M709 -92L709 876L857 876L857 506L995 506L995 364L857 364L857 -92L709 -92ZM108 79L108 503L430 503L430 675L105 675L105 798L568 798L568 382L245 382L245 203L267 203Q461 203 661 226L661 111Q533 95 377.5 87Q222 79 148 79L108 79Z"
        />
        <path
          transform="translate(94.76 34.5) scale(0.03223 -0.03223)"
          d="M212 -81L212 174L776 174L776 222L208 222L208 333L919 333L919 80L355 80L355 30L936 30L936 -81L212 -81ZM782 365L782 876L919 876L919 365L782 365ZM457 555L457 683L596 683L596 868L724 868L724 373L596 373L596 555L457 555ZM97 393L97 844L236 844L236 732L379 732L379 844L517 844L517 393L97 393ZM236 506L379 506L379 621L236 621L236 506Z"
        />
        <path
          transform="translate(127.52 34.5) scale(0.03223 -0.03223)"
          d="M759 -92L759 876L906 876L906 -92L759 -92ZM127 83L127 506L466 506L466 677L123 677L123 799L603 799L603 385L264 385L264 207L288 207Q501 207 718 231L718 116Q586 99 419 91Q252 83 171 83L127 83Z"
        />
      </g>
    </svg>
  );
}
