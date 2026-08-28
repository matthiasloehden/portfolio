interface NavigationItemBase {
  label: string;
  prefix?: string;
  activePath?: string;
}

export type NavigationItem = NavigationItemBase & ({ to: string; href?: never } | { href: string; to?: never });

export interface DisplayHeadingLine {
  text: string;
  accent?: boolean;
  suffix?: string;
}

export interface DisplayHeadingContent {
  titleLines: DisplayHeadingLine[];
}

export interface CaseStudyListItem {
  href: string;
  number: string;
  title: string;
  category: string;
}

export interface CaseStudyOverviewContent extends DisplayHeadingContent {
  id: string;
  titleId: string;
  label: string;
  items: CaseStudyListItem[];
}

export interface Capability {
  number: string;
  layer: string;
  title: string;
  to: string;
  skills: string[];
}

export type HomeAction = {
  label: string;
  symbol?: string;
  variant?: 'primary' | 'text';
} & ({ to: string; href?: never } | { href: string; to?: never });

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

export interface HomeHeroContent extends DisplayHeadingContent {
  kicker: string;
  introduction: string[];
  actions: HomeAction[];
  profile: DeveloperProfile;
  highlights: HomeHighlight[];
}

export interface HomeAboutContent extends DisplayHeadingContent {
  number: string;
  label: string;
  paragraphs: string[];
  principles: string[];
}

export interface HomeCapabilitiesContent extends DisplayHeadingContent {
  number: string;
  label: string;
  introduction: string;
  items: Capability[];
}

export interface CaseNote {
  title: string;
  text: string;
}

export interface CaseStudyIdentityContent extends DisplayHeadingContent {
  id: string;
  number: string;
  listTitle: string;
  listCategory: string;
  category: string;
  type: string;
}

export interface AcademicCaseStudyContent extends CaseStudyIdentityContent {
  lead: string;
  description: string;
  notes: CaseNote[];
}

export interface LabeledValue {
  label: string;
  value: string;
}

export interface PageHeroContent extends DisplayHeadingContent {
  kickerPrefix: string;
  kicker: string;
  introduction: string[];
  facts: LabeledValue[];
  scrollLabel: string;
  scrollHref: string;
}

export type AcademicHeroContent = PageHeroContent;

export type AcademicOverviewContent = CaseStudyOverviewContent;

export type WorkFact = LabeledValue;

export interface WorkCaseStudyContent extends CaseStudyIdentityContent {
  summary: string;
  paragraphs: string[];
  facts: WorkFact[];
}

export type WorkHeroContent = PageHeroContent;

export type WorkOverviewContent = CaseStudyOverviewContent;

export interface WorkContextContent extends DisplayHeadingContent {
  kicker: string;
  stack: Record<string, string[]>;
  highlightsLabel: string;
  highlights: string[];
}

export interface PageClosingContent extends DisplayHeadingContent {
  kickerPrefix: string;
  kicker: string;
  description: string;
  actions: HomeAction[];
}

export type WorkClosingContent = PageClosingContent;

export interface PanelFrameContent {
  title: string;
  meta: string;
}

export interface AppPreviewFeatured {
  title: string;
  description: string;
}

export interface AppPreviewItem extends AppPreviewFeatured {
  symbol: string;
}

export interface WorkLearningPanelContent {
  frame: PanelFrameContent;
  navigation: string[];
  featured: AppPreviewFeatured;
  formats: AppPreviewItem[];
  status: string;
}

export interface WorkRetailPanelContent {
  frame: PanelFrameContent;
  code: string;
  title: string;
  status: string;
  fields: Array<{
    label: string;
    value: string;
  }>;
  sync: {
    label: string;
    source: string;
    target: string;
  };
}

export interface WorkSignagePanelContent {
  frame: PanelFrameContent;
  remote: {
    label: string;
    title: string;
  };
  player: Array<{
    label: string;
    title: string;
  }>;
  outputs: Array<{
    connection: string;
    title: string;
    description: string;
  }>;
}

export interface WorkClientPanelContent {
  frame: PanelFrameContent;
  modules: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  audiences: string[];
}

export interface AcademicStreamingPanelContent {
  frame: PanelFrameContent;
  ariaLabel: string;
  nodes: Array<{
    name: string;
    description: string;
  }>;
}

export interface AcademicAuthenticationPanelContent {
  frame: PanelFrameContent;
  steps: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  status: string;
}

export interface AcademicEngineeringPanelContent {
  frame: PanelFrameContent;
  ariaLabel: string;
  navigation: string[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
  goals: Array<{
    title: string;
    status: string;
  }>;
  schedule: Array<{
    date: string;
    title: string;
  }>;
  facts: LabeledValue[];
  demo: {
    label: string;
    href: string;
  };
  status: string;
}

export interface AcademicServicePanelContent {
  frame: PanelFrameContent;
  stages: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  frameworks: Array<{
    name: string;
    description: string;
  }>;
}

export interface PersonalSectionContent extends CaseStudyIdentityContent {
  lead: string;
  paragraphs: string[];
  tags: string[];
}

export type PersonalHeroContent = PageHeroContent;

export type PersonalOverviewContent = CaseStudyOverviewContent;

export interface OpenSourceContribution {
  status: string;
  category: string;
  title: string;
  description: string;
  href?: string;
}

export interface LearningSource {
  name: string;
  focus: string;
  href: string;
}

export interface LearningGroup {
  category: string;
  sources: LearningSource[];
}

export interface PersonalContributionPanelContent {
  frame: PanelFrameContent;
  ariaLabel: string;
  items: OpenSourceContribution[];
}

export interface PersonalHomelabPanelContent {
  frame: PanelFrameContent;
  ariaLabel: string;
  host: {
    code: string;
    title: string;
    description: string;
  };
  services: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  status: string;
  process: string;
}

export interface PersonalLearningPanelContent {
  frame: PanelFrameContent;
  ariaLabel: string;
  groups: LearningGroup[];
}

export interface PersonalCoolingPanelContent {
  frame: PanelFrameContent;
  ariaLabel: string;
  status: {
    label: string;
    title: string;
  };
  facts: LabeledValue[];
}
