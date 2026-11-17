import { Platform, StyleSheet } from "react-native";

import { fonts, palette } from "../../lib/theme";

export const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "hidden",
    paddingTop: 56,
    paddingBottom: 64,
    minHeight: 560,
    justifyContent: "center",
  },
  wrapperPhone: {
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: 0,
  },
  globeWrap: {
    position: "absolute",
    right: 0,
    top: 28,
    opacity: 0.92,
  },
  globeWrapPhone: {
    right: -60,
    top: "auto",
    bottom: -20,
    opacity: 0.4,
  },
  content: {
    position: "relative",
    zIndex: 1,
    maxWidth: 620,
    gap: 18,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  eyebrowLine: {
    width: 34,
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(42,111,151, 0.45)",
  },
  eyebrow: {
    color: "rgba(42,111,151, 0.72)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
    textTransform: "uppercase",
    fontFamily: fonts.display,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontFamily: fonts.display,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(42,111,151, 0.55)",
  },
  title: {
    color: palette.navy,
    fontSize: 64,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: -2.6,
    fontFamily: fonts.display,
  },
  titleCompact: {
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: -1.8,
  },
  titlePhone: {
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -1.2,
  },
  titleAccent: {
    color: palette.purple,
    fontStyle: "italic",
  },
  dek: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 27,
    maxWidth: 440,
    fontFamily: fonts.display,
  },
  dekPhone: {
    fontSize: 14,
    lineHeight: 24,
    maxWidth: "100%",
  },
  ctaButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: palette.purple,
    ...(Platform.OS === "web"
      ? {
          backgroundImage: "linear-gradient(135deg, #2A6F97 0%, #18435F 100%)",
          boxShadow: "0 18px 40px -14px rgba(42,111,151, 0.5)",
          transitionDuration: "200ms",
          transitionProperty: "transform, box-shadow",
          transitionTimingFunction: "ease-out",
        }
      : {}),
  },
  ctaButtonHovered: {
    transform: [{ translateY: -2 }],
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 24px 50px -14px rgba(42,111,151, 0.6)",
        }
      : {}),
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
    fontFamily: fonts.display,
  },
});
