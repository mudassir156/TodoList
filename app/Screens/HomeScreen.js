import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
const router=useRouter()

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = (task) => {
    const newTasks = [...tasks, { id: Date.now().toString(), text: task, completed: false }];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const toggleComplete = (id) => {
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Add Task" onPress={() => router.push('/TaskScreen', { addTask })} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>{item.text}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                <Text style={{ marginHorizontal: 10 }}>{item.completed ? 'Undo' : 'Complete'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
