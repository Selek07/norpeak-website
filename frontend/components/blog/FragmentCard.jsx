import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "../common";
import { META_ICON_COLOR, styles } from "./FragmentCard.style";

function FragmentCard({ isPhone, onPress, post }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      style={[
        styles.card,
        isPhone && styles.cardPhone,
        hovered && styles.cardHovered,
      ]}
    >
      <View style={[styles.thumb, isPhone && styles.thumbPhone]} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {post.title}
          </Text>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{post.topic}</Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.excerpt}>
          {post.excerpt}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AppIcon color={META_ICON_COLOR} name="calendar-blank-outline" size={13} />
            <Text style={styles.metaText}>{post.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <AppIcon color={META_ICON_COLOR} name="clock-outline" size={13} />
            <Text style={styles.metaText}>{post.readTime}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default FragmentCard;
