import { Platform, StyleSheet } from "react-native";

import { fonts, palette, webEffects } from "../../lib/theme";

export const styles = StyleSheet.create({
  footer: {
    width: "100%",
    marginTop: 64,
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: palette.navy,
    ...(Platform.OS === "web" ? webEffects.dottedDark : {}),
  },
  inner: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  innerPhone: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 20,
  },
  brand: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
    fontFamily: fonts.display,
  },
  brandDot: {
    color: palette.pink,
  },
  tagline: {
    marginTop: 6,
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    letterSpacing: 0.2,
    fontFamily: fonts.display,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },
  linkText: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
    fontFamily: fonts.display,
  },
});
