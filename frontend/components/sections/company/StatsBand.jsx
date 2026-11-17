import { Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { fonts, palette, webEffects } from "../../../lib/theme";

function StatsBand({ stats, quote }) {
  const { width } = useWindowDimensions();
  const isPhone = width < 700;

  return (
    <View style={[styles.band, webEffects.dottedDark, isPhone && styles.bandPhone]}>
      <View style={[styles.row, isPhone && styles.rowPhone]}>
        {stats.map((stat) => (
          <View key={stat.label} style={[styles.stat, isPhone && styles.statPhone]}>
            <Text style={[styles.value, isPhone && styles.valuePhone]}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
      {quote ? (
        <View style={styles.quoteWrap}>
          <Text style={[styles.quote, isPhone && styles.quotePhone]}>&ldquo;{quote.text}&rdquo;</Text>
          <Text style={styles.cite}>{quote.author}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    marginHorizontal: 8,
    paddingVertical: 64,
    paddingHorizontal: 48,
    borderRadius: 36,
    backgroundColor: palette.navy,
    gap: 48,
    overflow: "hidden",
    ...(Platform.OS === "web"
      ? {
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.12) 1px, transparent 0), radial-gradient(at 100% 0%, rgba(134,207,224,0.22) 0px, transparent 55%), linear-gradient(140deg, #163049 0%, #0A1A29 100%)",
          backgroundSize: "40px 40px, auto, auto",
        }
      : {}),
  },
  bandPhone: { paddingVertical: 40, paddingHorizontal: 24, borderRadius: 28 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 24 },
  rowPhone: { flexWrap: "wrap" },
  stat: { flex: 1, gap: 6, borderLeftWidth: 1, borderLeftColor: "rgba(134,207,224,0.3)", paddingLeft: 20 },
  statPhone: { flexBasis: "42%" },
  value: {
    color: "#FFFFFF",
    fontSize: 56,
    lineHeight: 60,
    fontWeight: "900",
    letterSpacing: -2,
    fontFamily: fonts.display,
  },
  valuePhone: { fontSize: 40, lineHeight: 44 },
  label: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontFamily: fonts.display,
  },
  quoteWrap: { gap: 12, maxWidth: 860 },
  quote: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 40,
    fontWeight: "500",
    letterSpacing: -0.6,
    fontFamily: fonts.display,
  },
  quotePhone: { fontSize: 20, lineHeight: 30 },
  cite: { color: palette.pink, fontSize: 14, fontWeight: "700", fontFamily: fonts.display },
});

export default StatsBand;
