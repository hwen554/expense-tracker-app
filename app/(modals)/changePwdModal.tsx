import { Alert, StyleSheet, Text, View } from 'react-native'
import React, {useState, useRef} from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import ModalWrapper from '@/components/ModalWrapper';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import { auth } from '@/config/firebase';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';

const ChangePwdModal = () => {
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async() => {
    const oldPassword = oldPasswordRef.current;
    const newPassword = newPasswordRef.current;
    const confirmPassword = confirmPasswordRef.current;

    if (!oldPassword || !newPassword || !confirmPassword){
      Alert.alert("Change Password", "Please fill all the fields");
      return;
    }

    if(newPassword.length < 6){
      Alert.alert("Change Password", "New password must be at least 6 characters ");
      return;
    }

    if(newPassword !== confirmPassword){
      Alert.alert("Change Password", "New password do not match");
      return;
    }

    if(oldPassword === newPassword){
      Alert.alert("Change Password", "New password must be different from old password");
      return;
    }

    setIsLoading(true);
    try{
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      // 1. 用旧密码重新认证用户
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // 2. 更新密码
      await updatePassword(currentUser, newPassword);

      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
      
    } catch (error: any){
      let msg = error.message;
      if (msg.includes("wrong-password") || msg.inlcudes("invalid-credential")) {
        msg = "Old password is incorrect";
      } else if (msg.includes("weak-password")) {
        msg = "Password is too weak. Please use at least 6 characters";
      }
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title="Change Password" leftIcon={<BackButton />} style={{marginBottom: spacingY._20}}/>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Enter your old password and set a new one
          </Typo>

          <Input
            placeholder='Old password'
            secureTextEntry
            onChangeText={(value: string) => (oldPasswordRef.current = value)}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Input
            placeholder="New password"
            secureTextEntry
            onChangeText={(value: string) => (newPasswordRef.current = value)}
            icon={
              <Icons.LockKey
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Input
            placeholder="Confirm new password"
            secureTextEntry
            onChangeText={(value: string) =>
              (confirmPasswordRef.current = value)
            }
            icon={
              <Icons.LockKey
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Button onPress={handleChangePassword} loading={isLoading}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Change Password
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  )
}

export default ChangePwdModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._40
  },
  form: {
    gap: spacingY._20,
    marginTop: spacingY._20
  }
})