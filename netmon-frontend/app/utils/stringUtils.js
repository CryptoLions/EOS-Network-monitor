export const stripHtml = html => {
  if (!html) {
    return html;
  }

  const htmlElement = document.createRange().createContextualFragment(html);
  return htmlElement.textContent;
};
