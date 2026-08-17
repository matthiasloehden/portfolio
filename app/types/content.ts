export interface NavigationItem {
  label: string;
  prefix?: string;
  to?: string;
  href?: string;
  activePath?: string;
}

export interface CaseStudyListItem {
  href: string;
  number: string;
  title: string;
  category: string;
}

export interface Capability {
  number: string;
  layer: string;
  title: string;
  to: string;
  skills: string[];
}

export interface HomeAction {
  label: string;
  symbol?: string;
  to?: string;
  href?: string;
  variant?: 'primary' | 'text';
}

export interface HomeHighlight {
  number: string;
  title: string;
  description: string;
}

export interface DeveloperProfile {
  filename: string;
  name: string;
  role: string;
  focus: string[];
  status: string;
  location: string;
}

export interface HomeHeroContent {
  kicker: string;
  title: string;
  titleAccent: string;
  introduction: string;
  actions: HomeAction[];
  profile: DeveloperProfile;
  highlights: HomeHighlight[];
}

export interface HomeAboutContent {
  number: string;
  label: string;
  title: string;
  titleAccent: string;
  paragraphs: string[];
  principles: string[];
}

export interface HomeCapabilitiesContent {
  number: string;
  label: string;
  title: string;
  titleAccent: string;
  introduction: string;
  items: Capability[];
}

export interface CaseNote {
  title: string;
  text: string;
}

export interface AcademicCaseStudyContent {
  id: string;
  number: string;
  category: string;
  type: string;
  title: string;
  lead: string;
  description: string;
  notes: CaseNote[];
}

export interface WorkFact {
  label: string;
  value: string;
}

export interface WorkCaseStudyContent {
  id: string;
  number: string;
  category: string;
  type: string;
  title: string;
  summary: string;
  paragraphs: string[];
  facts: WorkFact[];
}

export interface PersonalSectionContent {
  id: string;
  number: string;
  category: string;
  type: string;
  title: string;
  lead: string;
  paragraphs: string[];
  tags: string[];
}

export interface OpenSourceContribution {
  status: string;
  category: string;
  title: string;
  description: string;
}

export interface LearningSource {
  name: string;
  focus: string;
}

export interface LearningGroup {
  category: string;
  description: string;
  sources: LearningSource[];
}
