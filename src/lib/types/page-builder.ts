import React from "react";

export type SectionComponent<Props = any> = (
  props: Props,
) => React.ReactElement | null;

export interface SectionRegistry {
  [key: string]: SectionComponent<any>;
}

export interface SectionConfig {
  enabled: boolean;
  index?: number;
  [key: string]: any;
}

export interface BuildPageParams {
  data: any; // Replace with PortfolioData when available
  sectionRegistry: SectionRegistry;
  pageType: string;
  customSectionFilter?: (section: any, pageType: string) => boolean;
  layoutOverride?: any;
}
