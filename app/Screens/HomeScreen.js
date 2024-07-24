import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Checkbox, Text, IconButton, FAB, SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        console.error('Failed to load tasks.', e);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to save tasks.', e);
      }
    };

    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (taskText.trim()) {
      const newTasks = [...tasks, { text: taskText, completed: false, dueDate: dayjs().add(1, 'day').toString() }];
      setTasks(newTasks);
      setTaskText('');
    }
  };

  const editTask = index => {
    setTaskText(tasks[index].text);
    setEditIndex(index);
  };

  const saveEdit = () => {
    if (editIndex !== null && taskText.trim()) {
      const newTasks = tasks.map((task, index) => index === editIndex ? { ...task, text: taskText } : task);
      setTasks(newTasks);
      setTaskText('');
      setEditIndex(null);
    }
  };

  const deleteTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleComplete = index => {
    const newTasks = tasks.map((task, i) => i === index ? { ...task, completed: !task.completed } : task);
    setTasks(newTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const renderTask = ({ item, index }) => (
    <Card style={styles.taskCard}>
      <Card.Content style={styles.taskContent}>
        <View style={styles.taskText}>
          <Checkbox
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleComplete(index)}
          />
          <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none', flex: 1 }}>
            {item.text}
          </Text>
        </View>
        <Text>{`Due: ${dayjs(item.dueDate).format('YYYY-MM-DD')}`}</Text>
        <View style={styles.taskActions}>
          <IconButton
            icon="pencil"
            onPress={() => editTask(index)}
          />
          <IconButton
            icon="delete"
            onPress={() => deleteTask(index)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Add a new task"
        value={taskText}
        onChangeText={setTaskText}
      />
      <Button
        mode="contained"
        onPress={editIndex !== null ? saveEdit : addTask}
        style={styles.button}
      >
        {editIndex !== null ? "Save Edit" : "Add Task"}
      </Button>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'completed', label: 'Completed' },
          { value: 'pending', label: 'Pending' }
        ]}
        style={styles.segmentedButtons}
      />
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.taskList}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setEditIndex(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  taskList: {
    paddingBottom: 80,
  },
  taskCard: {
    marginBottom: 10,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default HomeScreen;
