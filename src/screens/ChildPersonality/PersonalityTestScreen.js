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
import { AGE_GROUPS, PERSONALITY_QUESTIONS_BY_AGE, PERSONALITY_TYPES } from '../../data/childPersonalityData';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { saveTestResult, markTestCompleted } from '../../utils/storage';

export default function PersonalityTestScreen({ navigation }) {
  const [step, setStep] = useState('ageSelect'); // 'ageSelect' | 'questions'
  const [selectedAge, setSelectedAge] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const questions = selectedAge ? PERSONALITY_QUESTIONS_BY_AGE[selectedAge.id] || [] : [];
  const isLast = currentQ === questions.length - 1;

  const handleAgeSelect = (ageGroup) => {
    setSelectedAge(ageGroup);
  };

  const handleStartTest = () => {
    if (!selectedAge) return;
    setStep('questions');
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  };

  const handleSelect = (option) => setSelected(option);

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = { ...answers, [currentQ]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      const result = calculateResult(newAnswers);
      await saveTestResult('personality', result);
      await markTestCompleted('personality');
      navigation.navigate('PersonalityResult', { result, ageGroup: selectedAge });
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    }
  };

  const handleBack = () => {
    if (step === 'ageSelect') {
      navigation.goBack();
    } else if (currentQ === 0) {
      setStep('ageSelect');
    } else {
      setCurrentQ(currentQ - 1);
      setSelected(answers[currentQ - 1] || null);
    }
  };

  const calculateResult = (allAnswers) => {
    const scores = {};
    Object.values(allAnswers).forEach((answer) => {
      if (answer?.type) {
        scores[answer.type] = (scores[answer.type] || 0) + (answer.score || 1);
      }
    });

    const primaryTypeId =
      Object.keys(scores).length > 0
        ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
        : 'explorer';

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const percentages = {};
    Object.entries(scores).forEach(([key, val]) => {
      percentages[key] = Math.round((val / totalScore) * 100);
    });

    return {
      scores,
      percentages,
      primaryTypeId,
      primaryType: PERSONALITY_TYPES[primaryTypeId],
      ageGroupId: selectedAge?.id,
      totalQuestions: questions.length,
    };
  };

  if (step === 'ageSelect') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Child Personality</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.ageTitle}>How old is your child?</Text>
          <Text style={styles.ageSubtitle}>
            Select an age group to get questions tailored to your child's stage of development
          </Text>

          <View style={styles.ageGrid}>
            {AGE_GROUPS.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.ageCard,
                  { backgroundColor: group.color },
                  selectedAge?.id === group.id && styles.ageCardSelected,
                ]}
                onPress={() => handleAgeSelect(group)}
                activeOpacity={0.8}
              >
                {selectedAge?.id === group.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
                <Text style={styles.ageEmoji}>{group.emoji}</Text>
                <Text style={styles.ageLabel}>{group.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.ageNote}>
            <Text style={styles.ageNoteText}>
              💡 Questions are specifically designed for each stage of child development
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Start Test"
            onPress={handleStartTest}
            disabled={!selectedAge}
          />
        </View>
      </View>
    );
  }

  // Questions step
  const question = questions[currentQ];
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Child Personality</Text>
          <Text style={styles.headerSub}>
            {selectedAge?.emoji} {selectedAge?.label} · Q{currentQ + 1}/{questions.length}
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
        <ProgressBar current={currentQ + 1} total={questions.length} color="#FF6B35" showLabel={false} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.questionCard, { borderTopColor: '#FF6B35' }]}>
          <View style={[styles.questionBadge, { backgroundColor: '#FFF0EB' }]}>
            <Text style={[styles.questionBadgeText, { color: '#FF6B35' }]}>Q{currentQ + 1}</Text>
          </View>
          <Text style={styles.questionText}>{question?.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question?.options.map((option, idx) => {
            const isSelectedOpt = selected?.text === option.text;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.optionCard, isSelectedOpt && styles.optionCardSelectedOrange]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.8}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionDot,
                      isSelectedOpt && { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
                    ]}
                  >
                    {isSelectedOpt && <View style={styles.optionDotInner} />}
                  </View>
                </View>
                <Text style={[styles.optionText, isSelectedOpt && { color: '#FF6B35' }]}>
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
          style={{ backgroundColor: '#FF6B35' }}
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
  ageTitle: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: 8, marginTop: SPACING.sm },
  ageSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  ageCard: {
    width: '47%',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
    position: 'relative',
  },
  ageCardSelected: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    backgroundColor: '#FF6B35',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { color: COLORS.textInverse, fontSize: 12, fontWeight: '700' },
  ageEmoji: { fontSize: 36, marginBottom: 8 },
  ageLabel: { ...TYPOGRAPHY.h4, color: COLORS.text },
  ageNote: {
    backgroundColor: COLORS.warningLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  ageNoteText: { ...TYPOGRAPHY.bodySmall, color: COLORS.text },
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
    alignItems: 'flex-start',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  optionCardSelectedOrange: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF0EB',
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
  bottomPad: { height: SPACING.xl },
});
