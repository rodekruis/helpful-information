import { Parser } from 'marked';
import type { MarkedOptions } from 'ngx-markdown';
import { MarkdownModule, MARKED_OPTIONS, MarkedRenderer } from 'ngx-markdown';

function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.heading = ({ text, depth }): string => {
    let level = depth;
    const baseLevel = 3;
    const maxLevel = 6;
    level = level < baseLevel ? baseLevel : level;
    level = level > maxLevel ? maxLevel : level;

    return `<h${level}>${text}</h${level}>`;
  };

  renderer.link = ({ href, title, tokens }): string => {
    const text = Parser.parseInline(tokens);
    const isExternal = !(
      href.startsWith(window.location.origin) || href.startsWith('/')
    );
    const isPlainUrl = href.includes(text);
    const rel = `external noopener noreferrer ${
      isPlainUrl ? `x-plain-url` : ''
    }`;

    return `<a href="${href}"
     ${isExternal ? `target="_blank" rel="${rel}"` : ''}
     ${title ? ` title="${title}"` : ''}
     >${text}</a>`;
  };

  renderer.html = ({ text }): string => {
    return text.replaceAll(
      /(?<raw_a_href>href=[\s"']*(?:http|\/\/))/gi,
      ` target="_blank" rel="external noopener noreferrer" $<raw_a_href>`,
    );
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
  };
}

export function ngxMarkdownModuleFactory() {
  return MarkdownModule.forRoot({
    markedOptions: {
      provide: MARKED_OPTIONS,
      useFactory: markedOptionsFactory,
    },
  });
}
