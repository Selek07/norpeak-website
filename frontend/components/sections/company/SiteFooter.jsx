import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AppIcon } from "../../common";
import { fonts, palette } from "../../../lib/theme";

function SiteFooter({ contact, onNavigate }) {
  const { width } = useWindowDimensions();
  const isPhone = width < 700;
  const sitemap = [
    { key: "work", label: "Work" },
    { key: "services", label: "Services" },
    { key: "process", label: "Process" },
    { key: "studio", label: "Studio" },
    { key: "blog", label: "Journal" },
  ];

  return (
    <View style={[styles.footer, isPhone && styles.footerPhone]}>
      <View style={[styles.cols, isPhone && styles.colsPhone]}>
        <View style={[styles.brandCol, isPhone && styles.colPhone]}>
          <View style={styles.brandRow}>
            <View style={styles.mark}>
              <AppIcon color="#FFFFFF" name="terrain" size={18} />
            </View>
            <Text style={styles.brand}>Nortpeak</Text>
          </View>
          <Text style={styles.tagline}>
            A digital studio building web platforms, AI tools and brands that last.
          </Text>
        </View>

        <View style={[styles.col, isPhone && styles.colPhone]}>
          <Text style={styles.colTitle}>Explore</Text>
          {sitemap.map((link) => (
            <Pressable key={link.key} onPress={() => onNavigate(link.key)}>
              <Text style={styles.link}>{link.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.col, isPhone && styles.colPhone]}>
          <Text style={styles.colTitle}>Contact</Text>
          <Pressable onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
            <Text style={styles.link}>{contact.email}</Text>
          </Pressable>
          <Text style={styles.linkStatic}>{contact.location}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.small}>© {new Date().getFullYear()} Nortpeak. Built for the summit.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 96,
    paddingTop: 56,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(14,34,53, 0.1)",
    gap: 40,
  },
  footerPhone: { marginTop: 64, paddingHorizontal: 8 },
  cols: { flexDirection: "row", gap: 48 },
  colsPhone: { flexDirection: "column", gap: 32 },
  brandCol: { flex: 2, gap: 14, maxWidth: 420 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.navy,
  },
  brand: { color: palette.navy, fontSize: 22, fontWeight: "900", letterSpacing: -0.6, fontFamily: fonts.display },
  tagline: { color: palette.muted, fontSize: 15, lineHeight: 24, fontFamily: fonts.display },
  col: { flex: 1, gap: 10 },
  colPhone: { flex: 0, flexGrow: 0, flexShrink: 0, flexBasis: "auto" },
  colTitle: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: fonts.display,
  },
  link: { color: palette.text, fontSize: 15, fontFamily: fonts.display },
  linkStatic: { color: palette.muted, fontSize: 15, fontFamily: fonts.display },
  bottom: { borderTopWidth: 1, borderTopColor: "rgba(14,34,53, 0.08)", paddingVertical: 20 },
  small: { color: "rgba(14,34,53, 0.64)", fontSize: 12, fontFamily: fonts.display },
});

export default SiteFooter;
