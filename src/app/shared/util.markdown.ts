export function extractPageTitleFromMarkdown(markdown: string): string {
  const title = markdown.trim().match(/^##\s*(?<title>.*)/m);

  return title ? title[1] : '';
}
