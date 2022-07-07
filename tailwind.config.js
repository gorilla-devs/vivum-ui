module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}",
    "./ui/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}",
    "../../libs/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}",
    "./index.html",
  ],
  theme: {
    fontFamily: {
      main: [
        "Ubuntu",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
};
