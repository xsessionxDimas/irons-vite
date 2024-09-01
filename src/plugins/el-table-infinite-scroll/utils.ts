/**
 * sync element attrs
 */
export function syncAttrs(
  sourceElem: HTMLElement,
  targetElem: HTMLElement,
  attrsKeys: string[]
) {
  let value;
  attrsKeys.forEach((name) => {
    value = sourceElem.getAttribute(name);
    if (value !== null) {
      targetElem.setAttribute(name, value);
    } else {
      targetElem.removeAttribute(name);
    }
  });
}

export function syncOptions(sourceElem: HTMLElement, targetElem: HTMLElement) {
  syncAttrs(sourceElem, targetElem, [
    'infinite-scroll-disabled',
    'infinite-scroll-delay',
    'infinite-scroll-immediate',
    'infinite-scroll-distance',
  ]);

  // fix: windows/chrome `scrollTop + clientHeight` is difference with `scrollHeight`
  const name = 'infinite-scroll-distance';
  const value = +(sourceElem.getAttribute(name) || 0);
  targetElem.setAttribute(name, (value < 1 ? 1 : value) + '');
}
