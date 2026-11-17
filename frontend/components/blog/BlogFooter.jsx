import { Pressable, Text, View } from "react-native";

import { externalLinkProps } from "../../lib/linking";
import { styles } from "./BlogFooter.style";

const LINKS = [
  { label: "GitHub", href: "https://github.com/Selek07" },
  // TODO: replace with the real LinkedIn profile URL — this is a placeholder.
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Source", href: "https://github.com/Selek07" },
];

function BlogFooter({ isPhone }) {
  return (
    <View style={styles.footer}>
      <View style={[styles.inner, isPhone && styles.innerPhone]}>
        <View>
          <Text style={styles.brand}>
            Nortpeak <Text style={styles.brandDot}>.</Text>
          </Text>
          <Text style={styles.tagline}>
            © {new Date().getFullYear()} Nortpeak · Engineered for the
            future.
          </Text>
        </View>

        <View style={styles.links}>
          {LINKS.map((link) => (
            <Pressable key={link.label} {...externalLinkProps(link.href)}>
              <Text style={styles.linkText}>{link.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

export default BlogFooter;
