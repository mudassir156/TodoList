import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const TaskScreen = ({ route, navigation }) => {
  const { addTask } = route.params;
  const [task, setTask] = useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button
        title="Add Task"
        onPress={() => {
          addTask(task);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default TaskScreen;
