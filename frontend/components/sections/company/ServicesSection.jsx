import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AppIcon } from "../../common";
import { fonts, palette, shadow } from "../../../lib/theme";
import SectionHeader from "./SectionHeader";

function ServicesSection({ services }) {
  const { width } = useWindowDimensions();
  const columns = width >= 1100 ? 4 : width >= 700 ? 2 : 1;
  const [hovered, setHovered] = useState(null);

  return (
    <View style={styles.section}>
      <View style={[styles.top, columns === 1 && styles.topStack]}>
        <SectionHeader
          eyebrow="What we do"
          intro="Four disciplines, one small team. We cover the whole climb, so you never have to coordinate five agencies."
          title="Services"
        />
      </View>

      <View style={styles.grid}>
        {services.map((service, index) => {
          const isFeatured = index === 0;
          const isHover = hovered === service.title;
          return (
            <Pressable
              key={service.title}
              onHoverIn={() => setHovered(service.title)}
              onHoverOut={() => setHovered(null)}
              style={[
                styles.card,
                { width: columns === 1 ? "100%" : `${100 / columns - 2}%` },
                isFeatured && styles.cardFeatured,
                isHover && styles.cardHover,
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconTile, isFeatured && styles.iconTileFeatured]}>
                  <AppIcon color={isFeatured ? "#FFFFFF" : palette.purple} name={service.icon} size={22} />
                </View>
                <Text style={[styles.index, isFeatured && styles.textOnDarkMuted]}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>
              <Text style={[styles.cardTitle, isFeatured && styles.textOnDark]}>{service.title}</Text>
              <Text style={[styles.cardText, isFeatured && styles.textOnDarkMuted]}>{service.text}</Text>
              <View style={styles.list}>
                {service.items.map((item) => (
                  <View key={item} style={styles.listRow}>
                    <View style={[styles.dot, isFeatured && styles.dotFeatured]} />
                    <Text style={[styles.listText, isFeatured && styles.textOnDark]}>{item}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 40, paddingHorizontal: 16 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  topStack: { flexDirection: "column", alignItems: "flex-start" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 20, justifyContent: "space-between" },
  card: {
    minHeight: 340,
    padding: 28,
    borderRadius: 24,
    backgroundColor: "rgba(250,252,254, 0.86)",
    borderWidth: 1,
    borderColor: "rgba(14,34,53, 0.08)",
    gap: 14,
    ...(Platform.OS === "web" ? { transition: "transform 220ms ease, box-shadow 220ms ease" } : {}),
  },
  cardFeatured: {
    backgroundColor: palette.navy,
    borderColor: palette.navy,
    ...(Platform.OS === "web"
      ? { backgroundImage: "linear-gradient(160deg, #163049 0%, #0A1A29 100%)" }
      : {}),
  },
  cardHover: {
    ...shadow,
    ...(Platform.OS === "web" ? { transform: [{ translateY: -6 }] } : {}),
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(42,111,151, 0.1)",
  },
  iconTileFeatured: { backgroundColor: "rgba(255,255,255,0.12)" },
  index: { color: "rgba(14,34,53, 0.3)", fontSize: 14, fontWeight: "800", fontFamily: fonts.display },
  cardTitle: {
    marginTop: 8,
    color: palette.navy,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.6,
    fontFamily: fonts.display,
  },
  cardText: { color: palette.muted, fontSize: 15, lineHeight: 24, fontFamily: fonts.display },
  list: { gap: 8, marginTop: "auto", paddingTop: 8 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.purple },
  dotFeatured: { backgroundColor: palette.pink },
  listText: { color: palette.text, fontSize: 14, fontWeight: "600", fontFamily: fonts.display },
  textOnDark: { color: "#FFFFFF" },
  textOnDarkMuted: { color: "rgba(255,255,255,0.7)" },
});

export default ServicesSection;
