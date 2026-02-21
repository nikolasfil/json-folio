import React from "react";
import {
  SectionRegistry,
  BuildPageParams,
  SectionProps,
} from "../types/page-builder";

export function buildPageSections({
  data,
  sectionRegistry,
  pageType,
  customSectionFilter,
  layoutOverride,
}: BuildPageParams): React.ReactNode[] {
  if (!data) return [];
  const sectionsToRender: Array<{
    id: string;
    index: number;
    element: React.ReactNode;
  }> = [];

  // Helper to resolve index
  const resolveIndex = (value?: number) =>
    typeof value === "number" ? value : Number.MAX_SAFE_INTEGER;

  // Standard sections
  Object.entries(sectionRegistry).forEach(([id, SectionComponent]) => {
    const sectionData = data[id];
    if (!sectionData || !sectionData.enabled) return;
    const index = sectionData.index;
    const props: SectionProps = {
      ...sectionData,
      data,
      pageType,
      layoutOverride,
    };
    sectionsToRender.push({
      id,
      index: resolveIndex(index),
      element: React.createElement(SectionComponent, props),
    });
  });

  // Custom sections
  if (data.customSections) {
    data.customSections
      .filter(
        (section: any) =>
          section.enabled &&
          (!customSectionFilter || customSectionFilter(section, pageType)),
      )
      .forEach((section: any) => {
        const CustomSectionComponent = sectionRegistry["custom"];
        if (!CustomSectionComponent) return;
        sectionsToRender.push({
          id: section.id,
          index: resolveIndex(section.index),
          element: React.createElement(CustomSectionComponent, {
            section,
            data,
            pageType,
            layoutOverride,
          }),
        });
      });
  }

  // Sort by index
  return sectionsToRender
    .sort((a, b) => a.index - b.index)
    .map((s) => s.element);
}
