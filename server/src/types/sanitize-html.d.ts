declare module 'sanitize-html' {
  interface IOptions {
    allowedTags?: string[] | false;
    allowedAttributes?: Record<string, string[]> | false;
    allowedSchemes?: string[];
    allowedSchemesByTag?: Record<string, string[]>;
    allowProtocolRelative?: boolean;
    selfClosing?: string[];
    parser?: Record<string, any>;
    disallowedTagsModes?: string;
  }

  function sanitizeHtml(dirty: string, options?: IOptions): string;
  namespace sanitizeHtml {
    export type { IOptions };
  }
  export default sanitizeHtml;
}
