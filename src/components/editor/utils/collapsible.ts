export function setDomHiddenUntilFound(dom: HTMLElement): void {
  // @ts-ignore
  dom.hidden = "until-found";
}

export function domOnBeforeMatch(dom: HTMLElement, callback: () => void): void {
  // @ts-ignore
  dom.onbeforematch = callback;
}
