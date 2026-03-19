import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { PARENTING_QUESTIONS, PARENTING_STYLES } from '../../data/parentingStyleData';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { saveTestResult, markTestCompleted } from '../../utils/storage';

export default function ParentingTestScreen({ navigation }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const question = PARENTING_QUESTIONS[currentQ];
  const isLast = currentQ === PARENTING_QUESTIONS.length - 1;

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = async () => {
    if (!selected) return;

    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      const result = calculateResult(newAnswers);
      await saveTestResult('parenting', result);
      await markTestCompleted('parenting');
      navigation.navigate('ParentingResult', { result });
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
      setSelected(answers[PARENTING_QUESTIONS[currentQ - 1].id] || null);
    }
  };

  const calculateResult = (allAnswers) => {
    const scores = { authoritative: 0, authoritarian: 0, permissive: 0, uninvolved: 0 };
    Object.values(allAnswers).forEach((answer) => {
      if (answer && answer.style) {
        scores[answer.style] = (scores[answer.style] || 0) + (answer.score || 1);
      }
    });

    const primaryStyleId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const percentages = {};
    Object.entries(scores).forEach(([key, val]) => {
      percentages[key] = Math.round((val / totalScore) * 100);
    });

    return {
      scores,
      percentages,
      primaryStyleId,
      primaryStyle: PARENTING_STYLES[primaryStyleId],
      totalQuestions: PARENTING_QUESTIONS.length,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Parenting Style</Text>
          <Text style={styles.headerSub}>
            Q{currentQ + 1}/{PARENTING_QUESTIONS.length}
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
          total={PARENTING_QUESTIONS.length}
          color={COLORS.primary}
          showLabel={false}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionCard}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>Q{currentQ + 1}</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const isSelectedOpt = selected?.text === option.text;
            const styleInfo = PARENTING_STYLES[option.style];
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.optionCard, isSelectedOpt && styles.optionCardSelected]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.8}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionDot,
                      isSelectedOpt && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                    ]}
                  >
                    {isSelectedOpt && <View style={styles.optionDotInner} />}
                  </View>
                </View>
                <Text
                  style={[styles.optionText, isSelectedOpt && { color: COLORS.primary }]}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLast ? 'View Results' : 'Next'}
          onPress={handleNext}
          disabled={!selected}
          style={styles.nextBtn}
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
  progressContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  questionBadge: {
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  questionBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  questionText: { ...TYPOGRAPHY.h3, color: COLORS.text, lineHeight: 28 },
  optionsContainer: { gap: SPACING.sm },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionLeft: { paddingTop: 2 },
  optionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textInverse,
  },
  optionText: { ...TYPOGRAPHY.body, color: COLORS.text, flex: 1, lineHeight: 22 },
  footer: {
    padding: SPACING.lg,
    paddingBottom: 34,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextBtn: { borderRadius: RADIUS.lg },
  bottomPad: { height: SPACING.xl },
});
