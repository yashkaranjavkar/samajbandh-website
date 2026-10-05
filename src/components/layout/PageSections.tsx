import React, { Fragment } from 'react';
import { SITE_LAYOUT, PageKey } from '../../config/siteLayout';

interface PageSectionsProps {
  page: PageKey;
  sections: Record<string, React.ReactNode>;
}

/**
 * Renders a page's sections in the order and visibility set in `src/config/siteLayout.ts`.
 */
export const PageSections: React.FC<PageSectionsProps> = ({ page, sections }) => {
  if (import.meta.env.DEV) {
    for (const s of SITE_LAYOUT[page]) {
      if (!(s.id in sections)) {
        console.warn(`[siteLayout] "${page}" lists unknown section id "${s.id}". Check src/config/siteLayout.ts.`);
      }
    }
  }

  return (
    <>
      {SITE_LAYOUT[page]
        .filter(s => s.show)
        .map(s => <Fragment key={s.id}>{sections[s.id]}</Fragment>)}
    </>
  );
};
