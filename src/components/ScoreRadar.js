import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, TYPOGRAPHY } from '../utils/theme';

const toCartesian = (angle, radius, cx, cy) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
};

export default function ScoreRadar({ scores, size = 200 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const n = scores.length;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = scores.map((s, i) => {
    const angle = (360 / n) * i;
    const ratio = s.score / s.maxScore;
    return toCartesian(angle, maxRadius * ratio, cx, cy);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Grid rings */}
        {gridLevels.map((level, li) => {
          const ringPoints = scores
            .map((_, i) => {
              const angle = (360 / n) * i;
              const p = toCartesian(angle, maxRadius * level, cx, cy);
              return `${p.x},${p.y}`;
            })
            .join(' ');
          return (
            <Polygon
              key={li}
              points={ringPoints}
              fill="none"
              stroke={COLORS.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {scores.map((_, i) => {
          const angle = (360 / n) * i;
          const end = toCartesian(angle, maxRadius, cx, cy);
          return (
            <Line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke={COLORS.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={dataPolygon}
          fill={COLORS.primary + '33'}
          stroke={COLORS.primary}
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={COLORS.primary} />
        ))}

        {/* Labels */}
        {scores.map((s, i) => {
          const angle = (360 / n) * i;
          const labelPos = toCartesian(angle, maxRadius + 20, cx, cy);
          return (
            <SvgText
              key={i}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={10}
              fill={COLORS.textSecondary}
            >
              {s.emoji}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
