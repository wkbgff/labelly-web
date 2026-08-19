import {
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementType,
} from 'react';

/*
 * 시안의 `style-hover="..."`(마우스 오버 시 인라인 스타일 병합)를 그대로 재현하는 헬퍼.
 * hover 시 base style 위에 hoverStyle 을 얕게 병합합니다 (원본과 동일하게 마우스 전용).
 * `as` 로 태그/컴포넌트(예: react-router Link)를 지정할 수 있습니다.
 */
type HoverProps<T extends ElementType> = {
  as?: T;
  hoverStyle?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'hoverStyle'>;

export function Hover<T extends ElementType = 'div'>(props: HoverProps<T>) {
  const { as, hoverStyle, style, onMouseEnter, onMouseLeave, ...rest } = props as HoverProps<T> & {
    style?: CSSProperties;
    onMouseEnter?: (e: unknown) => void;
    onMouseLeave?: (e: unknown) => void;
  };
  const [hovered, setHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = as ?? 'div';

  return (
    <Tag
      {...rest}
      style={hovered && hoverStyle ? { ...style, ...hoverStyle } : style}
      onMouseEnter={(e: unknown) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e: unknown) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
    />
  );
}
