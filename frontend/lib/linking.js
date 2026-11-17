import * as Linking from "expo-linking";
import { Platform } from "react-native";

// Real anchor semantics on web — search engines, middle-click, and
// copy-link-address all need an actual href. Native falls back to
// Linking.openURL. Omitting onPress on web avoids double-opening (anchor
// navigation + window.open would both fire).
export function externalLinkProps(href, { newTab = true } = {}) {
  if (Platform.OS === "web") {
    return {
      accessibilityRole: "link",
      href,
      hrefAttrs: newTab ? { rel: "noreferrer", target: "_blank" } : undefined,
    };
  }

  return {
    accessibilityRole: "link",
    onPress: () => Linking.openURL(href),
  };
}
