import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types';
import { useRouter } from 'expo-router';
import { colors, radius } from '@/constants/theme';
import { CaretLeft } from 'phosphor-react-native';

const BackButton = ({
    style,
    iconSize = 26
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={[styles.button, style]}>
      <CaretLeft size={iconSize} color={colors.white} weight="bold" />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5
  },
  
})