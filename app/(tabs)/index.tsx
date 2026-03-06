import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button';
import { colors } from '../../constants/theme';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/contexts/authContext';
import ScreenWrapper from '@/components/ScreenWrapper';


const Home = () => {

  const { user } = useAuth();
  console.log("user: ", user);
  const handleLogout = async () => {
    await signOut(auth);
  }

  return (
    <View>
      <Text>Home</Text>
      <Button onPress={handleLogout} style={{marginTop: 20}}>
        <Typo color={colors.black}>Logout</Typo>
      </Button>
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({})