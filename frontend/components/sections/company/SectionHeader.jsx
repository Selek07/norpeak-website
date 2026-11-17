import { StyleSheet, Text, View } from "react-native";

import { fonts, palette } from "../../../lib/theme";

function SectionHeader({ eyebrow, title, intro, align = "left", tone = "light" }) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <View style={[styles.wrap, isCenter && styles.center]}>
      <View style={[styles.eyebrowRow, isCenter && styles.centerRow]}>
        <View style={[styles.tick, isDark && styles.tickDark]} />
        <Text style={[styles.eyebrow, isDark && styles.eyebrowDark]}>{eyebrow}</Text>
      </View>
      <Text
        accessibilityRole="header"
        aria-level={2}
        style={[styles.title, isCenter && styles.textCenter, isDark && styles.titleDark]}
      >
        {title}
      </Text>
      {intro ? (
        <Text style={[styles.intro, isCenter && styles.textCenter, isDark && styles.introDark]}>
          {intro}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14, maxWidth: 720 },
  center: { alignSelf: "center", alignItems: "center" },
  centerRow: { justifyContent: "center" },
  textCenter: { textAlign: "center" },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  tick: { width: 28, height: 2, borderRadius: 2, backgroundColor: palette.purple },
  tickDark: { backgroundColor: palette.pink },
  eyebrow: {
    color: palette.purple,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    fontFamily: fonts.display,
  },
  eyebrowDark: { color: palette.pink },
  title: {
    color: palette.navy,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: "900",
    letterSpacing: -1.6,
    fontFamily: fonts.display,
  },
  titleDark: { color: "#FFFFFF" },
  intro: { color: palette.muted, fontSize: 17, lineHeight: 28, fontFamily: fonts.display },
  introDark: { color: "rgba(255,255,255,0.72)" },
});

export default SectionHeader;
