import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../utils/theme';

export default function Card({ children, style, elevated = false, colored = null }) {
  return (
    <View
      style={[
        styles.card,
        elevated && SHADOWS.md,
        colored && { backgroundColor: colored, borderColor: 'transparent' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
});
