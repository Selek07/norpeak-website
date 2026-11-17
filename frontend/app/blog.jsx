import { Stack, useRouter } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BlogFooter, BlogHero, FragmentCard } from "../components/blog";
import { AppIcon } from "../components/common";
import { SectionNav } from "../components/navigation";
import blogContent from "../data/blogContent";
import { palette, webEffects } from "../lib/theme";

const SEO = {
  url: "https://nortpeak.com/blog",
  title: "Lab — Nortpeak | Notes on engineering & AI systems",
  description:
    "Field notes and long-form writing from Nortpeak on full-stack engineering, AI systems, and applied product work.",
};

function BlogScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;
  const isPhone = width < 640;
  const router = useRouter();

  // The blog reuses the homepage nav; section links route back home and the
  // homepage scrolls to the requested section via the ?section= param.
  const handleNavigate = useCallback(
    (key) => {
      if (key === "blog") {
        return;
      }

      router.push({ pathname: "/", params: { section: key } });
    },
    [router]
  );

  return (
    <>
      <Stack.Screen options={{ title: SEO.title }} />
      <Head>
        <title>{SEO.title}</title>
        <meta content={SEO.description} name="description" />
        <meta content="Nortpeak" name="author" />
        <meta content="index,follow" name="robots" />
        <link href={SEO.url} rel="canonical" />
        <meta content="website" property="og:type" />
        <meta content={SEO.title} property="og:title" />
        <meta content={SEO.description} property="og:description" />
        <meta content={SEO.url} property="og:url" />
      </Head>

      <SafeAreaView style={[styles.safeArea, webEffects.meshBackground]}>
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          <View style={styles.navWrapper}>
            <SectionNav isWide={isWide} onNavigate={handleNavigate} />
          </View>

          <View style={[styles.page, isPhone && styles.pagePhone]}>
            <BlogHero
              featured={blogContent.featured}
              isPhone={isPhone}
              isWide={isWide}
              onReadPress={() => {}}
            />

            <View style={styles.sectionHeaderRow}>
              <Text
                accessibilityRole="header"
                aria-level={2}
                style={styles.sectionTitle}
              >
                Latest Fragments
              </Text>
              <Pressable style={styles.topicsChip}>
                <AppIcon color="rgba(14,34,53, 0.55)" name="tune-variant" size={15} />
                <Text style={styles.topicsText}>{blogContent.topicsLabel}</Text>
              </Pressable>
            </View>

            <View style={styles.cardsList}>
              {blogContent.fragments.map((post) => (
                <FragmentCard
                  isPhone={isPhone}
                  key={post.slug}
                  onPress={() => {}}
                  post={post}
                />
              ))}
            </View>

            <Pressable style={styles.loadMoreBtn}>
              <Text style={styles.loadMoreText}>Load more fragments</Text>
              <AppIcon color={palette.navy} name="chevron-down" size={16} />
            </Pressable>
          </View>

          <BlogFooter isPhone={isPhone} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
    backgroundColor: palette.canvas,
  },
  scrollContent: {
    position: "relative",
    zIndex: 1,
    paddingBottom: 0,
  },
  navWrapper: {
    paddingHorizontal: 18,
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(42,111,151, 0.08)",
    ...(Platform.OS === "web"
      ? {
          backdropFilter: "blur(14px)",
        }
      : {}),
  },
  page: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  pagePhone: {
    paddingHorizontal: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 8,
    marginBottom: 22,
  },
  sectionTitle: {
    color: palette.navy,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.9,
    fontFamily: Platform.OS === "web" ? "Space Grotesk, sans-serif" : undefined,
  },
  topicsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topicsText: {
    color: "rgba(14,34,53, 0.55)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "web" ? "Space Grotesk, sans-serif" : undefined,
  },
  cardsList: {
    gap: 18,
  },
  loadMoreBtn: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 30,
    paddingHorizontal: 26,
    paddingVertical: 15,
    borderRadius: 999,
    backgroundColor: "rgba(250,252,254, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(14,34,53, 0.08)",
    ...(Platform.OS === "web"
      ? {
          backdropFilter: "blur(10px)",
          boxShadow: "0 14px 30px rgba(14,34,53, 0.06)",
        }
      : {}),
  },
  loadMoreText: {
    color: palette.navy,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "web" ? "Space Grotesk, sans-serif" : undefined,
  },
});

export default BlogScreen;
