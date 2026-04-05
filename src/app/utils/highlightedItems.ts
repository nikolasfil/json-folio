type HighlightableItem = {
  highlight?: boolean;
};

export function getHighlightedItems<T extends HighlightableItem>(items: T[]): T[] {
  const highlightedItems = items.filter((item) => item.highlight);

  if (highlightedItems.length > 0) {
    return highlightedItems;
  }

  return items.length > 0 ? [items[0]] : [];
}
