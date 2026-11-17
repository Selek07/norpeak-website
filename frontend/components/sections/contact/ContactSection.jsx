import { memo, useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, TextInput, useWindowDimensions, View } from "react-native";

import { AppIcon } from "../../common";
import { submitContact, warmUpApi } from "../../../lib/api";
import { externalLinkProps } from "../../../lib/linking";
import { webEffects } from "../../../lib/theme";
import { styles } from "./ContactSection.style";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// Kept in sync with the backend route and ContactMessage schema limits.
const FIELD_LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
};

// A cold Render instance can take ~30-50s to answer. Explain the wait rather
// than leaving the visitor staring at an unchanging "Sending message...".
const WAKE_HINT_DELAY_MS = 8000;

function ContactSection({ contact, isPhone: isPhoneProp, isWide }) {
  const { width } = useWindowDimensions();
  const isPhone = isPhoneProp ?? width < 640;
  const isTablet = width >= 768 && !isWide;
  const [form, setForm] = useState(initialForm);
  const [messageHeight, setMessageHeight] = useState(168);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    state: "idle",
    message: "Tell me about your vision.",
  });
  const wakeHintTimer = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(wakeHintTimer.current);
    },
    []
  );

  const setField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const payload = sanitizeContactForm(form);
    const validationMessage = validateContactForm(payload);

    if (validationMessage) {
      setStatus({
        state: "error",
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      state: "loading",
      message: "Sending message...",
    });

    wakeHintTimer.current = setTimeout(() => {
      setStatus({
        state: "loading",
        message: "Still sending — the server is waking up. This can take a minute.",
      });
    }, WAKE_HINT_DELAY_MS);

    try {
      const response = await submitContact(payload);

      setStatus({
        state: response.delivered === false ? "warning" : "success",
        message: response.message,
      });
      setForm(initialForm);
      setMessageHeight(168);
    } catch (error) {
      setStatus({
        state: "error",
        message: error.message,
      });
    } finally {
      clearTimeout(wakeHintTimer.current);
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.shell}>
      <View style={[styles.patternLayer, webEffects.dottedDark]} />

      <View style={[styles.layout, isTablet && styles.layoutTablet, !isWide && !isTablet && styles.layoutCompact]}>
        <View style={styles.infoColumn}>
          <Text
            accessibilityRole="header"
            aria-level={2}
            style={[styles.heading, isTablet && styles.headingTablet, isPhone && styles.headingPhone]}
          >
            Ready to reach your peak?
          </Text>
          <Text style={styles.copy}>
            Whether it&apos;s a new product, an AI tool, or a full rebrand,
            let&apos;s map the route and get you to the summit.
          </Text>

          <View style={styles.contactList}>
            <ContactLink
              href={`mailto:${contact.email}`}
              icon="email-outline"
              label="Email"
              value={contact.email}
            />
            <ContactLink
              href={contact.phoneHref || `tel:${contact.phone}`}
              icon="phone-outline"
              label="Phone"
              value={contact.phone}
            />
            <ContactLink icon="map-marker-outline" label="Base" value={contact.location} />
          </View>
        </View>

        <View style={[styles.formCard, isTablet && styles.formCardTablet]}>
          <View style={[styles.row, !isWide && styles.rowCompact]}>
            <Field
              id="contact-name"
              label="Name"
              maxLength={FIELD_LIMITS.name}
              name="name"
              onChangeText={(value) => setField("name", value)}
              placeholder="John Doe"
              readOnly={isSubmitting}
              shellStyle={styles.rowFieldShell}
              value={form.name}
            />
            <Field
              id="contact-subject"
              label="Subject"
              maxLength={FIELD_LIMITS.subject}
              name="subject"
              onChangeText={(value) => setField("subject", value)}
              placeholder="New Project"
              readOnly={isSubmitting}
              shellStyle={styles.rowFieldShell}
              value={form.subject}
            />
          </View>

          <Field
            id="contact-email"
            keyboardType="email-address"
            label="Email"
            maxLength={FIELD_LIMITS.email}
            name="email"
            onChangeText={(value) => setField("email", value)}
            placeholder="you@company.com"
            readOnly={isSubmitting}
            value={form.email}
          />

          <Field
            id="contact-message"
            label="Message"
            maxLength={FIELD_LIMITS.message}
            multiline
            name="message"
            numberOfLines={4}
            onContentSizeChange={(event) => {
              const nextHeight = event?.nativeEvent?.contentSize?.height;
              if (typeof nextHeight === "number") {
                setMessageHeight(Math.max(168, Math.min(nextHeight + 20, 288)));
              }
            }}
            onChangeText={(value) => setField("message", value)}
            placeholder="Tell me about your vision..."
            readOnly={isSubmitting}
            scrollEnabled={false}
            style={[
              styles.messageField,
              { height: messageHeight },
              Platform.OS === "web" ? styles.messageFieldWeb : null,
            ]}
            value={form.message}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Text>
            <AppIcon
              color="#FFFFFF"
              name="send-outline"
              size={20}
              style={styles.submitIcon}
            />
          </Pressable>

          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.statusText,
              status.state === "warning" && styles.statusTextWarning,
              status.state === "error" && styles.statusTextError,
            ]}
          >
            {status.message}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ContactLink({ href, icon, label, value }) {
  const content = (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>
        <AppIcon color="#FFFFFF" name={icon} size={22} />
      </View>
      <View style={styles.contactTextColumn}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </View>
  );

  if (href) {
    return (
      <Pressable
        accessibilityLabel={`${label}: ${value}`}
        {...externalLinkProps(href, { newTab: false })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

function Field({
  id,
  keyboardType,
  label,
  maxLength,
  multiline,
  name,
  numberOfLines,
  onContentSizeChange,
  onChangeText,
  placeholder,
  readOnly,
  scrollEnabled,
  shellStyle,
  style,
  value,
}) {
  return (
    <View style={[styles.fieldShell, shellStyle]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        editable={!readOnly}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        nativeID={id}
        name={name}
        numberOfLines={numberOfLines}
        onContentSizeChange={onContentSizeChange}
        onChangeText={onChangeText}
        // Wake the sleeping Render instance while the visitor is still typing.
        onFocus={warmUpApi}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.55)"
        scrollEnabled={scrollEnabled}
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline, style]}
        value={value}
      />
    </View>
  );
}

function sanitizeContactForm(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    subject: form.subject.trim(),
    message: form.message.trim(),
  };
}

function validateContactForm(form) {
  if (!form.name || !form.email || !form.message) {
    return "Name, email, and message are required.";
  }

  // Same pattern as the backend so nothing passes locally but fails remotely.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.toLowerCase())) {
    return "Please provide a valid email.";
  }

  return "";
}

export default memo(ContactSection);
