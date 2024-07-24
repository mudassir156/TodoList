import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'
import Home from "../Screens/HomeScreen"
import { PaperProvider } from 'react-native-paper';

export default function index() {
  return (
    <PaperProvider>
 <Home />
    </PaperProvider>
   
  
  )
}