import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { flags } from '../constants/flags';

export default function FlagGame() {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedFlags, setUsedFlags] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    loadNewFlag();
  }, []);

  const loadNewFlag = () => {
    const availableFlags = flags.filter(f => !usedFlags.includes(f.name));
    
    if (availableFlags.length === 0) {
      return;
    }

    const randomFlag = availableFlags[Math.floor(Math.random() * availableFlags.length)];
    setOptions(getRandomNames(flags, randomFlag.name));
    setCurrentFlag(randomFlag);
    setFeedback('');
    setSelectedAnswer(null);
  };

  const getRandomNames = (arr, correctName) => {
    const filtered = arr.filter(item => item.name !== correctName);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
    const names = shuffled.map(item => item.name);

    const correctNamePos = Math.floor(Math.random() * (names.length + 1));
    names.splice(correctNamePos, 0, correctName);

    return names;
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setQuestionsAsked(prev => prev + 1);
    setUsedFlags(prev => [...prev, currentFlag.name]);

    if (answer === currentFlag.name) {
      setScore(prev => prev + 1);
    } else {
      setFeedback(`Wrong! It was ${currentFlag.name}`);
      setCurrentFlag(null);
      return;
    }

    setTimeout(() => {
      if (usedFlags.length + 1 >= flags.length) {
        return;
      }
      loadNewFlag();
    }, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAsked(0);
    setUsedFlags([]);
    setFeedback('');
    setSelectedAnswer(null);
    loadNewFlag();
  };

  const getButtonStyle = (option) => {
    if (selectedAnswer === null) {
      return styles.optionButton;
    }
    if (selectedAnswer === option) {
      return option === currentFlag.name
        ? styles.optionButtonCorrect
        : styles.optionButtonWrong;
    }
    if (option === currentFlag.name) {
      return styles.optionButtonReveal;
    }
    return styles.optionButtonDisabled;
  };

  const getButtonTextStyle = (option) => {
    if (selectedAnswer === null) {
      return styles.optionText;
    }
    if (selectedAnswer === option) {
      return option === currentFlag.name
        ? styles.optionTextWhite
        : styles.optionTextWhite;
    }
    if (option === currentFlag.name) {
      return styles.optionTextReveal;
    }
    return styles.optionTextDisabled;
  };

  if (!currentFlag) {
    const percentage = questionsAsked > 0 ? score / questionsAsked : 0;
    const message = score === questionsAsked ? 'Perfect score! 🏆' : 
                    percentage >= 0.7 ? 'Great job! 🌟' : 
                    'Keep practicing! 💪';

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <Text style={styles.titleComplete}>Game Complete! 🎊</Text>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={resetGame}
            >
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.flagContainer}>
            <Text style={styles.flagEmoji}>{currentFlag.emoji}</Text>
            {feedback ? (
              <Text style={feedback.includes('Correct') ? styles.feedbackCorrect : styles.feedbackWrong}>
                {feedback}
              </Text>
            ) : null}
          </View>

          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                style={getButtonStyle(option)}
              >
                <Text style={getButtonTextStyle(option)}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.questionCounter}>
            Question {Math.min(questionsAsked + 1, flags.length)} of {flags.length}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7c3aed',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 448,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  flagContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  flagEmoji: {
    fontSize: 120,
    marginBottom: 16,
  },
  feedbackCorrect: {
    fontSize: 20,
    fontWeight: '600',
    color: '#16a34a',
  },
  feedbackWrong: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc2626',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionButtonCorrect: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionButtonWrong: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionButtonReveal: {
    backgroundColor: '#bbf7d0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionButtonDisabled: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  optionTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  optionTextReveal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
  },
  optionTextDisabled: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    textAlign: 'center',
  },
  questionCounter: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
  titleComplete: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  finalScore: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  playAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});