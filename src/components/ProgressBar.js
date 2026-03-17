import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY } from '../utils/theme';

export default function ProgressBar({ current, total, color = COLORS.primary, showLabel = true }) {
  const progress = Math.min(current / total, 1);

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          {current}/{total}
        </Text>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  track: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});
