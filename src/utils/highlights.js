export function groupHighlightsByPage(chunks) {
  const grouped = {};
  chunks.forEach((chunk) => {
    const page = chunk.page;
    if (!grouped[page]) grouped[page] = [];
    grouped[page].push(chunk);
  });
  return grouped;
}

export function scalebbox(bbox, pageDims) {
  if (!bbox || !pageDims) return null;
  const scaleX = pageDims.width / (pageDims.origWidth * (200 / 72));
  const scaleY = pageDims.height / (pageDims.origHeight * (200 / 72));
  return {
    left: bbox.x0 * scaleX,
    top: bbox.y0 * scaleY,
    width: (bbox.x1 - bbox.x0) * scaleX,
    height: (bbox.y1 - bbox.y0) * scaleY,
  };
}

export function getHighlightBoxes(chunk, pageDims) {
  if (!pageDims) return [];

  if (chunk.type === 'text') {
    if (chunk.lines && chunk.lines.length > 0) {
      return chunk.lines
        .map((line) => scalebbox(line.bbox, pageDims))
        .filter(Boolean);
    }
    return [scalebbox(chunk.bbox, pageDims)].filter(Boolean);
  }

  if (chunk.type === 'table') {
    return chunk.cells
      .map((cell) => scalebbox(cell.value_bbox, pageDims))
      .filter(Boolean);
  }

  return [];
}
