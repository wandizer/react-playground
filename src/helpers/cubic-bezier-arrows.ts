export const getCenter = (el: HTMLElement | Element) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 + window.scrollX,
    y: rect.top + rect.height / 2 + window.scrollY,
  };
};

/**
 *
 * @param startSelector
 * @param endSelector
 * @param bendItensity = 0.75, (1 makes the middle section perfectly vertical)
 */
export const drawDynamicCurvedArrow = (
  startSelector: string,
  endSelector: string,
  bendIntensity = 0.75,
  direction = "horizontal",
  label = "",
) => {
  const svg = document.getElementById("arrowSvg");
  const elFrom = document.querySelector(startSelector);
  const elTo = document.querySelector(endSelector);

  if (!elFrom || !elTo || !svg) {
    console.warn(`Could not find element(s): ${startSelector}, ${endSelector}`);
    return;
  }

  const p1 = getCenter(elFrom);
  const p2 = getCenter(elTo);

  let c1, c2; // control points

  if (direction === "horizontal") {
    const dx = (p2.x - p1.x) * bendIntensity;
    c1 = { x: p1.x + dx, y: p1.y };
    c2 = { x: p2.x - dx, y: p2.y };
  } else if (direction === "vertical") {
    const dy = (p2.y - p1.y) * bendIntensity;
    c1 = { x: p1.x, y: p1.y + dy };
    c2 = { x: p2.x, y: p2.y - dy };
  } else {
    console.warn(
      `Unknown direction "${direction}". Using horizontal as fallback.`,
    );
    const dx = (p2.x - p1.x) * bendIntensity;
    c1 = { x: p1.x + dx, y: p1.y };
    c2 = { x: p2.x - dx, y: p2.y };
  }

  const pathData = `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;

  // Create path element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "white");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("marker-end", "url(#arrowhead)");
  path.setAttribute("stroke-dasharray", "10 5");
  path.setAttribute("style", "animation: dashMove 1s linear infinite;");
  path.setAttribute("d", pathData);
  svg.appendChild(path);

  // If label provided, add text at midpoint of Bezier curve
  if (label) {
    // Cubic Bezier midpoint calculation
    const t = 0.5;
    const x =
      Math.pow(1 - t, 3) * p1.x +
      3 * Math.pow(1 - t, 2) * t * c1.x +
      3 * (1 - t) * Math.pow(t, 2) * c2.x +
      Math.pow(t, 3) * p2.x;
    const y =
      Math.pow(1 - t, 3) * p1.y +
      3 * Math.pow(1 - t, 2) * t * c1.y +
      3 * (1 - t) * Math.pow(t, 2) * c2.y +
      Math.pow(t, 3) * p2.y;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y));
    text.setAttribute("fill", "black");
    text.setAttribute("font-size", "14");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = label;
    svg.appendChild(text);

    // Get text size after appending to SVG
    const bbox = text.getBBox();

    // Create background rectangle
    const padding = 4;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(bbox.x - padding));
    rect.setAttribute("y", String(bbox.y - padding));
    rect.setAttribute("width", String(bbox.width + padding * 2));
    rect.setAttribute("height", String(bbox.height + padding * 2));
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("rx", String(3)); // rounded corners
    rect.setAttribute("ry", String(3)); // rounded corners

    // Insert rect before the text, so background is behind the label
    svg.insertBefore(rect, text);
  }

  return path;
};
