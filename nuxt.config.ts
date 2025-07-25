// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-i18n-micro"],
  ui: {
    colorMode: true,
  },
  colorMode: {
    preference: "dark",
  },
  css: ["~/assets/main.css"],
  i18n: {
    locales: [
      { code: "en", iso: "en-US", dir: "ltr" },
      { code: "kh", iso: "km-KH", dir: "ltr" },
    ],
    defaultLocale: "en",
    translationDir: "lang",
    meta: true,
  },
  vite: {
    server: {
      hmr: {
        overlay: true,
        port: 24678,
      },
    },
    plugins: [
      {
        name: "test-nuxt4-hmr-fix",
        configureServer(server) {
          const originalInvalidateModule = server.moduleGraph.invalidateModule;
          server.moduleGraph.invalidateModule = function (
            mod,
            invalidatedModules = new Set(),
            timestamp = Date.now()
          ) {
            if (mod?.file?.includes("pages/")) {
              console.log("🔥 Force reload for page file:", mod.file);
              server.ws.send({
                type: "full-reload",
              });
              return;
            }
            return originalInvalidateModule.call(
              this,
              mod,
              invalidatedModules,
              timestamp
            );
          };
        },
        handleHotUpdate(ctx) {
          if (ctx.file.includes("pages/")) {
            console.log("🔥 Page file changed, forcing full reload:", ctx.file);
            ctx.server.ws.send({
              type: "full-reload",
            });
            return [];
          }
          return ctx.modules;
        },
      },
    ],
  },
});