import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const ForgotPassword = () => {
  const emailRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!emailRef.current) {
      Alert.alert("Reset Password", "Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, emailRef.current);
      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email. Please check your inbox.",
        [{ text: "OK" }],
      );
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("user-not-found")) {
        msg = "No account found with this email address";
      } else if (msg.includes("invalid-email")) {
        msg = "Please enter a valid email address";
      } else if (msg.includes("too-many-requests")) {
        msg = "Too many requests. Please try again later";
      }
      Alert.alert("Reset Password", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Forgot
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Password?
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Typo>

          <Input
            placeholder="Enter your email"
            onChangeText={(value: string) => (emailRef.current = value)}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Button onPress={handleResetPassword} loading={isLoading}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Send Reset Link
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
});
