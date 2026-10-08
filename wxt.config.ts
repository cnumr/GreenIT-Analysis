import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "GreenIT-Analysis",
    homepage_url: "https://github.com/cnumr/GreenIT-Analysis",
    icons: {
      48: "icons/logo-48.png",
      128: "icons/logo-128.png",
    },
    permissions: ["activeTab", "tabs", "browsingData", "scripting"],
    host_permissions: ["*://*/*"],
    default_locale: "en",
  },
});
