declare module "@metagptx/vite-plugin-source-locator" {
  import { Plugin } from "vite";
  export function viteSourceLocator(options?: { prefix?: string }): Plugin;
  export default viteSourceLocator;
}

declare module "tailwindcss-animate" {
  import { Plugin } from "postcss";
  const plugin: any;
  export default plugin;
}

declare module "@tailwindcss/aspect-ratio" {
  const plugin: any;
  export default plugin;
}
