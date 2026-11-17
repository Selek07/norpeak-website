// EXPO_BASE_URL lets the static export live under a sub-path, e.g.
// "/norpeak-website" for GitHub Pages at selek07.github.io/norpeak-website.
// Leave it unset for a custom domain served from the root.
const baseUrl = process.env.EXPO_BASE_URL || "";

module.exports = {
  expo: {
    name: "Nortpeak",
    slug: "norpeak-website",
    scheme: "norpeak",
    orientation: "portrait",
    userInterfaceStyle: "light",
    plugins: [["expo-router", { sitemap: false }]],
    experiments: {
      typedRoutes: false,
      ...(baseUrl ? { baseUrl } : {}),
    },
    web: {
      bundler: "metro",
      output: "static",
    },
  },
};
