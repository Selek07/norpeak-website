import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "../common";
import WireframeGlobe from "./WireframeGlobe";
import { styles } from "./BlogHero.style";

function BlogHero({ featured, isPhone, isWide, onReadPress }) {
  const [hovered, setHovered] = useState(false);

  return (
    <View style={[styles.wrapper, isPhone && styles.wrapperPhone]}>
      <View
        pointerEvents="none"
        style={[styles.globeWrap, isPhone && styles.globeWrapPhone]}
      >
        <WireframeGlobe size={isWide ? 500 : isPhone ? 340 : 420} />
      </View>

      <View style={styles.content}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrow}>{featured.eyebrow}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{featured.date}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{featured.readTime}</Text>
        </View>

        <Text
          accessibilityRole="header"
          aria-level={1}
          style={[
            styles.title,
            !isWide && styles.titleCompact,
            isPhone && styles.titlePhone,
          ]}
        >
          {featured.titleLead}
          {"\n"}
          <Text style={styles.titleAccent}>{featured.titleAccent}</Text>
          <Text>{featured.titleTrail}</Text>
        </Text>

        <Text style={[styles.dek, isPhone && styles.dekPhone]}>{featured.dek}</Text>

        <Pressable
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          onPress={onReadPress}
          style={[styles.ctaButton, hovered && styles.ctaButtonHovered]}
        >
          <Text style={styles.ctaText}>{featured.cta}</Text>
          <AppIcon color="#FFFFFF" name="arrow-top-right" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

export default BlogHero;
