import { Platform, StyleSheet } from "react-native";

import { fonts, palette, webEffects } from "../../lib/theme";

export const META_ICON_COLOR = "rgba(91,107,125, 0.85)";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 28,
    backgroundColor: "rgba(250,252,254, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    ...(Platform.OS === "web"
      ? {
          backdropFilter: "blur(14px)",
          boxShadow: "0 18px 50px rgba(14,34,53, 0.06)",
          transitionDuration: "220ms",
          transitionProperty: "transform, box-shadow, border-color",
          transitionTimingFunction: "ease-out",
        }
      : {}),
  },
  cardPhone: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 16,
  },
  cardHovered: {
    transform: [{ translateY: -3 }],
    borderColor: "rgba(42,111,151, 0.16)",
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 26px 60px rgba(42,111,151, 0.13)",
        }
      : {}),
  },
  thumb: {
    width: 92,
    height: 92,
    borderRadius: 18,
    flexShrink: 0,
    backgroundColor: palette.navy,
    overflow: "hidden",
    ...(Platform.OS === "web" ? webEffects.dottedDark : {}),
  },
  thumbPhone: {
    width: "100%",
    height: 150,
  },
  body: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  title: {
    flexShrink: 1,
    color: palette.navy,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
    letterSpacing: -0.4,
    fontFamily: fonts.display,
  },
  chip: {
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(134,207,224, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(134,207,224, 0.22)",
  },
  chipText: {
    color: "#25628A",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontFamily: fonts.display,
  },
  excerpt: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 580,
    fontFamily: fonts.display,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "rgba(91,107,125, 0.92)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    fontFamily: fonts.display,
  },
});
