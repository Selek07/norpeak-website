import { memo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { AppIcon } from "../common";
import { styles } from "./SectionNav.style";

const links = [
  { key: "work", label: "Work" },
  { key: "services", label: "Services" },
  { key: "process", label: "Process" },
  { key: "studio", label: "Studio" },
  { key: "blog", label: "Journal" },
];

function SectionNav({ isWide, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavPress = (key) => {
    setMenuOpen(false);
    onNavigate(key);
  };

  return (
    <View style={[styles.wrapper, !isWide && styles.wrapperCompact]}>
      <View style={styles.brandRow}>
        {!isWide ? (
          <Pressable
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
            onPress={() => setMenuOpen(true)}
            style={styles.hamburgerBtn}
          >
            <AppIcon color="rgba(42,111,151, 0.9)" name="menu" size={22} />
          </Pressable>
        ) : (
          <View style={styles.brandMark}>
            <AppIcon color="#FFFFFF" name="terrain" size={18} />
          </View>
        )}

        <Text style={styles.brandText}>
          Nortpeak<Text style={styles.brandDot}>.</Text>
        </Text>
      </View>

      {isWide ? (
        <View style={styles.linkRow}>
          {links.map((link) => (
            <Pressable
              accessibilityRole="button"
              key={link.key}
              onPress={() => onNavigate(link.key)}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>{link.label}</Text>
              <View style={styles.linkUnderline} />
            </Pressable>
          ))}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => onNavigate("contact")}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaText}>START A PROJECT</Text>
        <AppIcon color="#FFFFFF" name="arrow-right" size={14} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
        transparent
        visible={menuOpen}
      >
        <Pressable onPress={() => setMenuOpen(false)} style={styles.menuOverlay}>
          <View style={styles.menuSheet}>
            {links.map((link, index) => (
              <View key={link.key}>
                {index > 0 ? <View style={styles.menuDivider} /> : null}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleNavPress(link.key)}
                  style={styles.menuLink}
                >
                  <Text style={styles.menuLinkText}>{link.label}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default memo(SectionNav);
