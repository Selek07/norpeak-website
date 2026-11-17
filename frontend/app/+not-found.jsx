import { Link, Stack } from "expo-router";
import Head from "expo-router/head";
import { StyleSheet, Text, View } from "react-native";

import { palette } from "../lib/theme";

const TITLE = "Page not found | Norpeak";

function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: TITLE }} />
      {/* Stack.Screen's title does not reach the static export — the
          exported 404.html needs a real <title> from Head. */}
      <Head>
        <title>{TITLE}</title>
        <meta content="noindex,follow" name="robots" />
      </Head>

      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text accessibilityRole="header" aria-level={1} style={styles.heading}>
          This page drifted out of orbit.
        </Text>
        <Text style={styles.copy}>
          The address you followed doesn&apos;t exist (anymore).
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to the homepage</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
    backgroundColor: palette.canvas,
  },
  code: {
    color: palette.purple,
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: -2,
  },
  heading: {
    color: palette.navy,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  copy: {
    color: palette.muted,
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: palette.navy,
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

export default NotFoundScreen;
