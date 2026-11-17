import { Platform } from "react-native";

export const palette = {
  navy: "#0E2235",
  purple: "#2A6F97",
  pink: "#86CFE0",
  mist: "#E7EEF3",
  canvas: "#F4F7FA",
  white: "#FAFCFE",
  text: "#14263A",
  muted: "#5B6B7D",
  line: "rgba(14,34,53, 0.12)",
  panel: "rgba(250,252,254, 0.96)",
};

export const shadow = Platform.select({
  web: {
    boxShadow: "0 24px 64px rgba(14,34,53, 0.12)"
  },
  default: {
    shadowColor: "#0E2235",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    elevation: 6,
  },
});

export const surface = {
  backgroundColor: palette.panel,
  borderWidth: 1,
  borderColor: palette.line,
  borderRadius: 28,
  ...(Platform.OS === "web"
    ? {
        backdropFilter: "blur(14px)"
      }
    : {}),
  ...shadow,
};

export const fonts = {
  display: Platform.OS === "web" ? "Space Grotesk, sans-serif" : undefined,
};

export const webEffects = {
  meshBackground:
    Platform.OS === "web"
      ? {
          backgroundImage:
            "radial-gradient(at 0% 0%, rgba(134,207,224,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(42,111,151,0.1) 0px, transparent 50%)"
        }
      : {},
  dottedDark:
    Platform.OS === "web"
      ? {
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.16) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }
      : {},
};
