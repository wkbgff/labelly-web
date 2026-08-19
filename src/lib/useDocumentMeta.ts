import { useEffect } from 'react';

/** 페이지별 <title>/<meta name="description"> (원본 <helmet>)를 문서에 반영합니다. */
export function useDocumentMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);
}
