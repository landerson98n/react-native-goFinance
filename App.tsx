import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
}from '@expo-google-fonts/poppins'
import theme from './src/global/styles/theme';
import {NavigationContainer} from '@react-navigation/native'
import { Routes } from './src/Routes';
import { StatusBar } from 'react-native';
import { SignIn } from './src/screens/SignIn';
import {AuthProvider, useAuth} from './src/hooks/auth'
import { AppRoutes } from './src/Routes/app.routes';
import { AuthRoutes } from './src/Routes/auth.routes';
export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })
  const {isLoading} = useAuth()
  if(!fontsLoaded || isLoading){
    return <AppLoading/>
  }
  return (
    <ThemeProvider theme = {theme} >
        <StatusBar barStyle= 'light-content'/>
        <AuthProvider>
           <Routes/>
        </AuthProvider> 
    </ThemeProvider>
  );
}
