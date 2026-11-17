import { StyleSheet, Text, View } from "react-native";

import { fonts, palette } from "../../../lib/theme";

function TrustStrip({ clients }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Trusted by teams across the region</Text>
      <View style={styles.row}>
        {clients.map((client) => (
          <Text key={client} style={styles.client}>
            {client}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 18,
    paddingVertical: 28,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(14,34,53, 0.08)",
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: fonts.display,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 48,
    rowGap: 14,
    paddingHorizontal: 16,
  },
  client: {
    color: "rgba(14,34,53, 0.42)",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.6,
    fontFamily: fonts.display,
  },
});

export default TrustStrip;
