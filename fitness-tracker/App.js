import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function App() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      exercise: 'Walking',
      duration: 30,
      calories: 120,
      steps: 3500,
    },
  ]);

  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState('');

  const totalSteps = activities.reduce(
    (sum, item) => sum + Number(item.steps),
    0
  );

  const totalCalories = activities.reduce(
    (sum, item) => sum + Number(item.calories),
    0
  );

  const totalMinutes = activities.reduce(
    (sum, item) => sum + Number(item.duration),
    0
  );

  const addActivity = () => {
    if (!exercise || !duration || !calories || !steps) {
      Alert.alert('Missing Information', 'Please fill all fields.');
      return;
    }

    const newActivity = {
      id: Date.now(),
      exercise: exercise,
      duration: Number(duration),
      calories: Number(calories),
      steps: Number(steps),
    };

    setActivities([newActivity, ...activities]);

    setExercise('');
    setDuration('');
    setCalories('');
    setSteps('');

    Alert.alert('Success', 'Activity added successfully!');
  };

  const deleteActivity = (id) => {
    setActivities(
      activities.filter((item) => item.id !== id)
    );
  };

  const stepProgress = Math.min((totalSteps / 10000) * 100, 100);
  const calorieProgress = Math.min((totalCalories / 500) * 100, 100);
  const workoutProgress = Math.min((totalMinutes / 60) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>FITNESS TRACKER</Text>
        <Text style={styles.subtitle}>
          Track your daily activities
        </Text>
      </View>

      {/* SUMMARY */}
      <Text style={styles.sectionTitle}>Today's Summary</Text>

      <View style={styles.summaryRow}>

        <View style={styles.card}>
          <Text style={styles.icon}>👣</Text>
          <Text style={styles.cardValue}>{totalSteps}</Text>
          <Text style={styles.cardLabel}>Steps</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={styles.cardValue}>{totalCalories}</Text>
          <Text style={styles.cardLabel}>Calories</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>⏱️</Text>
          <Text style={styles.cardValue}>{totalMinutes}</Text>
          <Text style={styles.cardLabel}>Minutes</Text>
        </View>

      </View>

      {/* PROGRESS */}
      <Text style={styles.sectionTitle}>Daily Progress</Text>

      <View style={styles.progressBox}>

        <View style={styles.progressHeader}>
          <Text style={styles.progressName}>Steps</Text>
          <Text style={styles.progressNumber}>
            {totalSteps} / 10000
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: stepProgress + '%' },
            ]}
          />
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressName}>Calories</Text>
          <Text style={styles.progressNumber}>
            {totalCalories} / 500
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: calorieProgress + '%' },
            ]}
          />
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressName}>Workout Time</Text>
          <Text style={styles.progressNumber}>
            {totalMinutes} / 60 min
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: workoutProgress + '%' },
            ]}
          />
        </View>

      </View>

      {/* WEEKLY GRAPH */}
      <Text style={styles.sectionTitle}>Weekly Activity</Text>

      <View style={styles.graphBox}>

        <View style={styles.barsContainer}>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 45 }]} />
            <Text style={styles.day}>Mon</Text>
          </View>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 75 }]} />
            <Text style={styles.day}>Tue</Text>
          </View>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 55 }]} />
            <Text style={styles.day}>Wed</Text>
          </View>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 95 }]} />
            <Text style={styles.day}>Thu</Text>
          </View>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 65 }]} />
            <Text style={styles.day}>Fri</Text>
          </View>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 110 }]} />
            <Text style={styles.day}>Sat</Text>
          </View>

          <View style={styles.barItem}>
            <View style={[styles.bar, { height: 80 }]} />
            <Text style={styles.day}>Sun</Text>
          </View>

        </View>

      </View>

      {/* ADD ACTIVITY */}
      <Text style={styles.sectionTitle}>Log New Activity</Text>

      <View style={styles.formBox}>

        <Text style={styles.inputLabel}>Exercise Type</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Walking, Running, Cycling"
          value={exercise}
          onChangeText={setExercise}
        />

        <Text style={styles.inputLabel}>Workout Time (minutes)</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 30"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        <Text style={styles.inputLabel}>Calories Burned</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 150"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />

        <Text style={styles.inputLabel}>Steps</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 3000"
          keyboardType="numeric"
          value={steps}
          onChangeText={setSteps}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addActivity}
        >
          <Text style={styles.addButtonText}>
            + ADD ACTIVITY
          </Text>
        </TouchableOpacity>

      </View>

      {/* ACTIVITY LIST */}
      <Text style={styles.sectionTitle}>Recent Activities</Text>

      {activities.map((item) => (
        <View style={styles.activityCard} key={item.id}>

          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>
              {item.exercise}
            </Text>

            <Text style={styles.activityDetails}>
              ⏱ {item.duration} min
              {'   '}
              🔥 {item.calories} cal
              {'   '}
              👣 {item.steps}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteActivity(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>

        </View>
      ))}

      <Text style={styles.footer}>
        Fitness Tracking App • CodeAlpha Task
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#243B53',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#D9E2EC',
    marginTop: 6,
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#243B53',
    marginTop: 18,
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '31%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },

  icon: {
    fontSize: 25,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#243B53',
    marginTop: 6,
  },

  cardLabel: {
    fontSize: 12,
    color: '#627D98',
    marginTop: 3,
  },

  progressBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
    marginTop: 5,
  },

  progressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#243B53',
  },

  progressNumber: {
    fontSize: 13,
    color: '#627D98',
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#E6ECF2',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
  },

  progressFill: {
    height: 10,
    backgroundColor: '#2F80ED',
    borderRadius: 10,
  },

  graphBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  barsContainer: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  barItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '13%',
  },

  bar: {
    width: 18,
    backgroundColor: '#2F80ED',
    borderRadius: 8,
  },

  day: {
    fontSize: 11,
    color: '#627D98',
    marginTop: 7,
  },

  formBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#243B53',
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    backgroundColor: '#F8FAFC',
  },

  addButton: {
    backgroundColor: '#243B53',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },

  activityInfo: {
    flex: 1,
  },

  activityName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#243B53',
  },

  activityDetails: {
    fontSize: 12,
    color: '#627D98',
    marginTop: 6,
  },

  deleteButton: {
    backgroundColor: '#FDECEC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },

  deleteText: {
    color: '#C0392B',
    fontSize: 12,
    fontWeight: 'bold',
  },

  footer: {
    textAlign: 'center',
    color: '#829AB1',
    fontSize: 12,
    marginTop: 25,
  },

});
