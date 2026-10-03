import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';

export default function App() {
  const [cards, setCards] = useState([
    {
      id: 1,
      question: 'What does CPU stand for?',
      answer: 'Central Processing Unit',
    },
    {
      id: 2,
      question: 'What does RAM stand for?',
      answer: 'Random Access Memory',
    },
    {
      id: 3,
      question: 'What does HTML stand for?',
      answer: 'HyperText Markup Language',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Animation value
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const currentCard = cards[currentIndex];

  // Flip card
  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: flipAnimation.__getValue() === 0 ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  // Question rotation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Answer rotation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: frontInterpolate },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: backInterpolate },
    ],
  };

  // Reset card position
  const resetFlip = () => {
    flipAnimation.stopAnimation();
    flipAnimation.setValue(0);
  };

  // Next
  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      resetFlip();
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Previous
  const previousCard = () => {
    if (currentIndex > 0) {
      resetFlip();
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Add / Edit
  const saveCard = () => {
    if (question.trim() === '' || answer.trim() === '') {
      Alert.alert(
        'Missing Information',
        'Please enter both question and answer.'
      );
      return;
    }

    if (editingId !== null) {
      const updatedCards = cards.map((card) => {
        if (card.id === editingId) {
          return {
            ...card,
            question: question.trim(),
            answer: answer.trim(),
          };
        }

        return card;
      });

      setCards(updatedCards);
      setEditingId(null);
    } else {
      const newCard = {
        id: Date.now(),
        question: question.trim(),
        answer: answer.trim(),
      };

      setCards([...cards, newCard]);
      setCurrentIndex(cards.length);
    }

    setQuestion('');
    setAnswer('');
    resetFlip();
  };

  // Edit
  const editCard = () => {
    setEditingId(currentCard.id);
    setQuestion(currentCard.question);
    setAnswer(currentCard.answer);
  };

  // Delete
  const deleteCard = () => {
    Alert.alert(
      'Delete Flashcard',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newCards = cards.filter(
              (card) => card.id !== currentCard.id
            );

            if (newCards.length === 0) {
              setCards([]);
              setCurrentIndex(0);
              return;
            }

            let newIndex = currentIndex;

            if (newIndex >= newCards.length) {
              newIndex = newCards.length - 1;
            }

            setCards(newCards);
            setCurrentIndex(newIndex);
            resetFlip();
          },
        },
      ]
    );
  };

  // If no cards
  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>FLASHCARD QUIZ</Text>

          <Text style={styles.emptyText}>
            No flashcards available.
          </Text>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Add Your First Flashcard
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter question"
              placeholderTextColor="#888"
              value={question}
              onChangeText={setQuestion}
            />

            <TextInput
              style={[styles.input, styles.answerInput]}
              placeholder="Enter answer"
              placeholderTextColor="#888"
              value={answer}
              onChangeText={setAnswer}
              multiline
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={saveCard}
            >
              <Text style={styles.addButtonText}>
                + Add Flashcard
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const progress =
    ((currentIndex + 1) / cards.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FLASHCARD QUIZ</Text>

          <Text style={styles.subtitle}>
            STUDY • LEARN • REMEMBER
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              Card {currentIndex + 1} of {cards.length}
            </Text>

            <Text style={styles.progressText}>
              {Math.round(progress)}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* 3D FLIP CARD */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={flipCard}
          style={styles.cardContainer}
        >
          {/* FRONT */}
          <Animated.View
            style={[
              styles.card,
              styles.frontCard,
              frontAnimatedStyle,
            ]}
          >
            <Text style={styles.cardLabel}>
              QUESTION
            </Text>

            <Text style={styles.question}>
              {currentCard.question}
            </Text>

            <View style={styles.flipHint}>
              <Text style={styles.flipIcon}>↻</Text>

              <Text style={styles.flipHintText}>
                Tap to flip
              </Text>
            </View>
          </Animated.View>

          {/* BACK */}
          <Animated.View
            style={[
              styles.card,
              styles.backCard,
              backAnimatedStyle,
            ]}
          >
            <Text style={styles.cardLabel}>
              ANSWER
            </Text>

            <Text style={styles.answer}>
              {currentCard.answer}
            </Text>

            <View style={styles.flipHint}>
              <Text style={styles.flipIcon}>↻</Text>

              <Text style={styles.flipHintText}>
                Tap to flip back
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.disabledButton,
            ]}
            onPress={previousCard}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navText}>
              ← Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === cards.length - 1 &&
                styles.disabledButton,
            ]}
            onPress={nextCard}
            disabled={currentIndex === cards.length - 1}
          >
            <Text style={styles.navText}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Edit / Delete */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={editCard}
          >
            <Text style={styles.actionText}>
              ✎ Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteCard}
          >
            <Text style={styles.actionText}>
              ✕ Delete
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add / Edit Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingId !== null
              ? 'Edit Flashcard'
              : 'Add New Flashcard'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter question"
            placeholderTextColor="#888"
            value={question}
            onChangeText={setQuestion}
          />

          <TextInput
            style={[styles.input, styles.answerInput]}
            placeholder="Enter answer"
            placeholderTextColor="#888"
            value={answer}
            onChangeText={setAnswer}
            multiline
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={saveCard}
          >
            <Text style={styles.addButtonText}>
              {editingId !== null
                ? '✓ Update Flashcard'
                : '+ Add Flashcard'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditingId(null);
                setQuestion('');
                setAnswer('');
              }}
            >
              <Text style={styles.cancelText}>
                Cancel Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            💡 How to use
          </Text>

          <Text style={styles.infoText}>
            • Tap the flashcard to rotate it.
          </Text>

          <Text style={styles.infoText}>
            • The answer appears on the back.
          </Text>

          <Text style={styles.infoText}>
            • Tap again to return to question.
          </Text>

          <Text style={styles.infoText}>
            • Use Next and Previous to navigate.
          </Text>

          <Text style={styles.infoText}>
            • Add, edit and delete cards anytime.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF',
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    alignItems: 'center',
    marginBottom: 22,
  },

  title: {
    fontSize: 29,
    fontWeight: '900',
    color: '#5B35C5',
    letterSpacing: 2,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
    letterSpacing: 2,
  },

  progressContainer: {
    marginBottom: 20,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#555',
  },

  progressBar: {
    height: 9,
    backgroundColor: '#DDD7F5',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#7048D8',
    borderRadius: 10,
  },

  /*
    CARD CONTAINER
    This is important for the 3D flip.
  */
  cardContainer: {
    height: 340,
    marginBottom: 22,
  },

  card: {
    position: 'absolute',
    width: '100%',
    height: 340,
    borderRadius: 28,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',

    backfaceVisibility: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  frontCard: {
    backgroundColor: '#7048D8',
  },

  backCard: {
    backgroundColor: '#24213A',
  },

  cardLabel: {
    position: 'absolute',
    top: 30,
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    opacity: 0.8,
  },

  question: {
    fontSize: 27,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
  },

  answer: {
    fontSize: 25,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
  },

  flipHint: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
  },

  flipIcon: {
    fontSize: 23,
    color: '#FFFFFF',
    marginBottom: 3,
  },

  flipHintText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.75,
  },

  navigation: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  navButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.35,
  },

  navText: {
    color: '#5B35C5',
    fontSize: 15,
    fontWeight: '800',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#E5DEFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#FFE1E1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  actionText: {
    fontWeight: '800',
    color: '#444',
  },

  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 22,
    marginBottom: 20,
    elevation: 3,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
    marginBottom: 15,
  },

  input: {
    backgroundColor: '#F6F4FC',
    borderWidth: 1,
    borderColor: '#E0DBF1',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
  },

  answerInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  addButton: {
    backgroundColor: '#7048D8',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  cancelText: {
    color: '#777',
    fontWeight: '700',
  },

  infoBox: {
    backgroundColor: '#E9E3FF',
    padding: 18,
    borderRadius: 18,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#4F32A9',
    marginBottom: 10,
  },

  infoText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginVertical: 30,
  },
});
