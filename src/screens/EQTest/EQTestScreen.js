import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { EQ_QUESTIONS, EQ_DIMENSIONS, EQ_LEVELS } from '../../data/eqTestData';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { saveTestResult, markTestCompleted } from '../../utils/storage';

export default function EQTestScreen({ navigation }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const question = EQ_QUESTIONS[currentQ];
  const dimension = EQ_DIMENSIONS[question?.dimension];
  const isLast = currentQ === EQ_QUESTIONS.length - 1;

  const handleSelect = (option) => setSelected(option);

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: { ...selected, dimension: question.dimension } };
    setAnswers(newAnswers);

    if (isLast) {
      const result = calculateResult(newAnswers);
      await saveTestResult('eq', result);
      await markTestCompleted('eq');
      navigation.navigate('EQResult', { result });
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    }
  };

  const handleBack = () => {
    if (currentQ === 0) {
      Alert.alert('Exit test?', 'Progress will not be saved.', [
        { text: 'Continue', style: 'cancel' },
        { text: 'Exit', onPress: () => navigation.goBack() },
      ]);
    } else {
      setCurrentQ(currentQ - 1);
      setSelected(answers[EQ_QUESTIONS[currentQ - 1].id] || null);
    }
  };

  const calculateResult = (allAnswers) => {
    const dimScores = {};
    const dimCounts = {};

    Object.values(allAnswers).forEach(({ score, dimension: dim }) => {
      dimScores[dim] = (dimScores[dim] || 0) + score;
      dimCounts[dim] = (dimCounts[dim] || 0) + 1;
    });

    const dimensionScores = {};
    Object.entries(dimScores).forEach(([dim, score]) => {
      const maxScore = dimCounts[dim] * 4;
      dimensionScores[dim] = {
        ...EQ_DIMENSIONS[dim],
        score,
        maxScore,
        percentage: Math.round((score / maxScore) * 100),
      };
    });

    const totalScore = Object.values(dimScores).reduce((a, b) => a + b, 0);
    const maxTotal = EQ_QUESTIONS.length * 4;
    const level = EQ_LEVELS.find((l) => totalScore >= l.min && totalScore <= l.max) || EQ_LEVELS[0];

    return {
      dimensionScores,
      totalScore,
      maxTotal,
      level,
      percentage: Math.round((totalScore / maxTotal) * 100),
      totalQuestions: EQ_QUESTIONS.length,
    };
  };

  if (!question) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>EQ Score</Text>
          <Text style={styles.headerSub}>
            {dimension?.emoji} {dimension?.name} · {currentQ + 1}/{EQ_QUESTIONS.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.quitBtn}
          onPress={() =>
            Alert.alert('Quit Test?', 'Your progress will not be saved.', [
              { text: 'Continue', style: 'cancel' },
              { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
            ])
          }
        >
          <Text style={styles.quitBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          current={currentQ + 1}
          total={EQ_QUESTIONS.length}
          color="#FF69B4"
          showLabel={false}
        />
      </View>

      {/* Dimension indicator */}
      <View style={[styles.dimBar, { backgroundColor: dimension?.color + '22' }]}>
        <Text style={styles.dimEmoji}>{dimension?.emoji}</Text>
        <View>
          <Text style={[styles.dimName, { color: dimension?.color }]}>{dimension?.name}</Text>
          <Text style={styles.dimDesc}>{dimension?.description}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.questionCard, { borderTopColor: dimension?.color || '#FF69B4' }]}>
          <View style={[styles.questionBadge, { backgroundColor: (dimension?.color || '#FF69B4') + '22' }]}>
            <Text style={[styles.questionBadgeText, { color: dimension?.color }]}>
              Q{currentQ + 1}
            </Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const isSelectedOpt = selected?.text === option.text;
            const scoreColors = ['#FF6B6B', '#FFB347', '#4ECDC4', '#6C63FF'];
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.optionCard,
                  isSelectedOpt && {
                    borderColor: dimension?.color,
                    backgroundColor: (dimension?.color || '#FF69B4') + '15',
                  },
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.8}
              >
                <View style={[styles.scoreIndicator, { backgroundColor: scoreColors[option.score - 1] }]}>
                  <Text style={styles.scoreText}>{option.score}</Text>
                </View>
                <Text style={[styles.optionText, isSelectedOpt && { color: dimension?.color }]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.scaleNote}>
          <Text style={styles.scaleNoteText}>📊 Scale: 1 (Rarely) → 4 (Always)</Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLast ? 'View EQ Results' : 'Next'}
          onPress={handleNext}
          disabled={!selected}
          style={{ backgroundColor: '#FF69B4' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  backBtnText: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  quitBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: RADIUS.md,
  },
  quitBtnText: { fontSize: 16, color: '#FF6B6B', fontWeight: '700' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.text },
  headerSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  progressContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  dimBar: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dimEmoji: { fontSize: 28 },
  dimName: { ...TYPOGRAPHY.h4 },
  dimDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
    borderTopWidth: 4,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  questionBadgeText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
  questionText: { ...TYPOGRAPHY.h3, color: COLORS.text, lineHeight: 28 },
  optionsContainer: { gap: SPACING.sm },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  scoreIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '700' },
  optionText: { ...TYPOGRAPHY.body, color: COLORS.text, flex: 1, lineHeight: 22 },
  scaleNote: {
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  scaleNoteText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  footer: {
    padding: SPACING.lg,
    paddingBottom: 34,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomPad: { height: SPACING.xl },
});
