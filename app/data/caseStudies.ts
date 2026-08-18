import type { CaseStudyIdentityContent, CaseStudyListItem } from '@/types/content';

export function createCaseStudyListItems(cases: readonly CaseStudyIdentityContent[]): CaseStudyListItem[] {
  return cases.map(({ id, number, listTitle, listCategory }) => ({
    href: `#${id}`,
    number,
    title: listTitle,
    category: listCategory,
  }));
}
