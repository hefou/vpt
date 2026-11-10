import { defineConfig } from "vitepress";
import type { UserConfig } from "vitepress";
type VPConfig = UserConfig & {
  vite?: UserConfig["vite"];
};

function uniq(items: string[]) {
  return Array.from(new Set(items));
}

function mergeNoExternal(value: unknown): true | (string | RegExp)[] {
  if (value === true) return true;
  if (Array.isArray(value)) {
    const hasNonString = value.some((item) => typeof item !== "string");
    if (hasNonString) {
      const exists = value.some((item) => item === "@hefou/dux");
      return exists ? value.slice() : [...value, "@hefou/dux"];
    }
    return uniq([...value, "@hefou/dux"]);
  }
  if (typeof value === "string") return uniq([value, "@hefou/dux"]);
  if (value instanceof RegExp) return [value, "@hefou/dux"];
  return ["@hefou/dux"];
}

function mergeExclude(value?: string[]) {
  const list = Array.isArray(value) ? value : [];
  return uniq([...list, "@hefou/dux"]);
}

function mergeAlias(value?: any): any[] {
  const aliasList: any[] = [
    {
      find: /^dayjs$/,
      replacement: "@hefou/dux/shims/dayjs",
    },
    {
      find: /^dayjs\/plugin\//,
      replacement: "dayjs/plugin/",
    },
    {
      find: /^dayjs\/esm\/index\.js\/plugin\//,
      replacement: "dayjs/plugin/",
    },
  ];

  if (Array.isArray(value)) {
    aliasList.push(...value);
  } else if (value && typeof value === "object") {
    for (const [find, replacement] of Object.entries(value)) {
      aliasList.push({ find, replacement });
    }
  }

  const hasSanitizeAlias = aliasList.some((item) => {
    if (item.find instanceof RegExp)
      return item.find.test("@braintree/sanitize-url");
    return item.find === "@braintree/sanitize-url";
  });

  if (!hasSanitizeAlias) {
    aliasList.push({
      find: /^@braintree\/sanitize-url$/,
      replacement: "@hefou/dux/shims/sanitize-url",
    });
  }

  return aliasList;
}

export function VPTheme(config: VPConfig): UserConfig {
  const vite = config.vite ?? {};
  const ssr = {
    ...(vite.ssr ?? {}),
    noExternal: mergeNoExternal(vite.ssr?.noExternal),
  };
  const optimizeDeps = {
    ...(vite.optimizeDeps ?? {}),
    exclude: mergeExclude(vite.optimizeDeps?.exclude),
  };
  const resolve = {
    ...(vite.resolve ?? {}),
    alias: mergeAlias(vite.resolve?.alias),
  };

  return defineConfig({
    ...config,
    vite: {
      ...vite,
      ssr,
      optimizeDeps,
      resolve,
    },
  });
}
