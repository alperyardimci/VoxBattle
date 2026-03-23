declare module "twemoji-parser" {
  interface ParsedEmoji {
    url: string;
    indices: [number, number];
    text: string;
    type: string;
  }
  export function parse(text: string, options?: object): ParsedEmoji[];
}
