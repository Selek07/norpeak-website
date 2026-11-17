import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SectionNav } from "../components/navigation";
import {
  ContactSection,
  ExperienceSection,
  HeroSection,
  HighlightsSection,
  PhotoRingSection,
  SkillsSection
} from "../components/sections";
import portfolioContent from "../data/portfolioContent";
import { palette, webEffects } from "../lib/theme";

// Poll for the target section's layout offset instead of guessing a delay.
const SCROLL_RETRY_MS = 50;
const MAX_SCROLL_ATTEMPTS = 40; // ~2s before giving up

const SEO = {
  url: "https://norpeak.com/",
  title: "Norpeak | Digital Product Studio",
  description:
    "Norpeak is a digital product studio designing and building web platforms, AI tools, and brand systems.",
  keywords:
    "Norpeak, digital product studio, web development, AI systems, brand design, React, Node.js"
};

function HomeScreen() {
  const scrollViewRef = useRef(null);
  const sectionOffsets = useRef({});
  const router = useRouter();
  const { section } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;
  const isPhone = width < 640;

  const registerSection = useCallback((key, y) => {
    sectionOffsets.current[key] = Math.max(0, y - 12);
  }, []);

  const handleNavigate = useCallback(
    (key) => {
      if (key === "blog") {
        router.push("/blog");
        return;
      }

      scrollViewRef.current?.scrollTo({
        y: sectionOffsets.current[key] ?? sectionOffsets.current.top ?? 0,
        animated: true
      });
    },
    [router]
  );

  // Arriving from the blog with /?section=<key>: wait for onLayout to register
  // the target offset rather than guessing a delay, then drop the param so a
  // reload doesn't yank the user back down the page.
  //
  // The param is cleared with history.replaceState rather than router.replace:
  // a router navigation re-renders the screen and resets the ScrollView back to
  // the top, which cancels the scroll we just started.
  useEffect(() => {
    if (typeof section !== "string" || !section) {
      return undefined;
    }

    let timer;
    let attempts = 0;
    let cancelled = false;

    const clearSectionParam = () => {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname
        );
      }
    };

    const attemptScroll = () => {
      if (cancelled) {
        return;
      }

      const isRegistered = sectionOffsets.current[section] != null;

      if (isRegistered) {
        handleNavigate(section);
        clearSectionParam();
        return;
      }

      if (attempts >= MAX_SCROLL_ATTEMPTS) {
        clearSectionParam();
        return;
      }

      attempts += 1;
      timer = setTimeout(attemptScroll, SCROLL_RETRY_MS);
    };

    timer = setTimeout(attemptScroll, SCROLL_RETRY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [section, handleNavigate]);

  return (
    <>
      <Stack.Screen options={{ title: SEO.title }} />
      <Head>
        <title>{SEO.title}</title>
        <meta content={SEO.description} name="description" />
        <meta content="Norpeak" name="author" />
        <meta content={SEO.keywords} name="keywords" />
        <meta content="index,follow" name="robots" />
        <link href={SEO.url} rel="canonical" />
        <meta content="website" property="og:type" />
        <meta content="Norpeak" property="og:site_name" />
        <meta content={SEO.title} property="og:title" />
        <meta content={SEO.description} property="og:description" />
        <meta content={SEO.url} property="og:url" />
        <meta content="summary" name="twitter:card" />
        <meta content={SEO.title} name="twitter:title" />
        <meta content={SEO.description} name="twitter:description" />
      </Head>

      <SafeAreaView style={[styles.safeArea, webEffects.meshBackground]}>
        <StatusBar style="dark" />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          <View style={styles.navWrapper}>
            <SectionNav isWide={isWide} onNavigate={handleNavigate} />
          </View>

          <View style={[styles.page, isPhone && styles.pagePhone]}>
            <View
              onLayout={(event) => {
                registerSection("top", event.nativeEvent.layout.y);
                registerSection("orbit", event.nativeEvent.layout.y);
              }}
            >
              <HeroSection
                hero={portfolioContent.hero}
                isPhone={isPhone}
                isWide={isWide}
                onJourneyPress={() => handleNavigate("experience")}
                onTalkPress={() => handleNavigate("contact")}
                projects={portfolioContent.projects}
              />
            </View>

            <View style={styles.memoryGap}>
              <PhotoRingSection />
            </View>

            <View
              onLayout={(event) =>
                registerSection("experience", event.nativeEvent.layout.y)
              }
              style={[styles.photoRingExitGap, isPhone && styles.photoRingExitGapPhone]}
            >
              <ExperienceSection experience={portfolioContent.experience} />
            </View>

            <View
              onLayout={(event) =>
                registerSection("skills", event.nativeEvent.layout.y)
              }
              style={[styles.sectionGap, isPhone && styles.sectionGapPhone]}
            >
              <SkillsSection isWide={isWide} skills={portfolioContent.skills} />
            </View>

            <View
              onLayout={(event) =>
                registerSection("education", event.nativeEvent.layout.y)
              }
              style={[styles.sectionGap, isPhone && styles.sectionGapPhone]}
            >
              <HighlightsSection education={portfolioContent.education} />
            </View>

            <View
              onLayout={(event) =>
                registerSection("contact", event.nativeEvent.layout.y)
              }
              style={[styles.sectionGap, isPhone && styles.sectionGapPhone]}
            >
              <ContactSection contact={portfolioContent.contact} isPhone={isPhone} isWide={isWide} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Norpeak. Built for the summit.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
    backgroundColor: palette.canvas
  },
  scrollContent: {
    position: "relative",
    zIndex: 1,
    paddingBottom: 48
  },
  navWrapper: {
    paddingHorizontal: 18,
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(42,111,151, 0.08)",
    ...(Platform.OS === "web"
      ? {
          backdropFilter: "blur(14px)"
        }
      : {})
  },
  page: {
    width: "100%",
    maxWidth: 1480,
    alignSelf: "center",
    paddingHorizontal: 8
  },
  pagePhone: {
    paddingHorizontal: 16
  },
  sectionGap: {
    marginTop: 110
  },
  sectionGapPhone: {
    marginTop: 64
  },
  photoRingExitGap: {
    marginTop: 72
  },
  photoRingExitGapPhone: {
    marginTop: 48
  },
  memoryGap: {
    marginTop: 2
  },
  footer: {
    paddingTop: 24,
    alignItems: "center"
  },
  footerText: {
    // >= 4.5:1 on the canvas background for WCAG AA small text
    color: "rgba(14,34,53, 0.64)",
    fontSize: 12
  }
});

export default HomeScreen;
