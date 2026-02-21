// Utility to resolve section index
const resolveIndex = (value?: number) =>
  typeof value === "number" ? value : Number.MAX_SAFE_INTEGER;

/**
 * Adds a section to the provided array if enabled.
 * @param args Section config
 * @param sectionsToRender Array to push section into
 */
export function addSectionGlobal(
  {
    enabled,
    id,
    index,
    element,
  }: {
    enabled: boolean;
    id: string;
    index?: number;
    element: React.ReactNode;
  },
  sectionsToRender: Array<{
    id: string;
    index: number;
    element: React.ReactNode;
  }>,
) {
  if (!enabled) return;
  sectionsToRender.push({
    id,
    index: resolveIndex(index),
    element,
  });
}
