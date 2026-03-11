import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native'
import { UserDataType, WalletType } from '@/types';
import React, { useState } from 'react'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from "expo-image-picker";

import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { colors, spacingY } from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { updateUser } from '@/services/userService';
import { scale } from '@/utils/styling';
import ImageUpload from '@/components/ImageUpload';



const WalletModal = () => {
  const {user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<UserDataType>({
      name: "",
      image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const onPickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5
    });

    if(!result.canceled){
       
    }
  }

  
  const onSubmit = async() => {
    let { name, image } = wallet;
    if(!name.trim() || !image) {
      Alert.alert("User", "Please fill all the fields");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid
    };

    setLoading(true);
    const res = await updateUser(user?.uid as string, wallet);
    setLoading(false);
    if(res.success){
      // update user
      updateUserData(user?.uid as string);
      router.back();
    }else{
      Alert.alert("User", res.msg);
    }
  };

  return (
    <ModalWrapper>
        <View style={styles.container}>
          <Header
            title="New Wallet"
            leftIcon={<BackButton />}
            style={{marginBottom: 20}}
          />

          {/* form */}
          <ScrollView contentContainerStyle={styles.form}>
              <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200} style={{ marginBottom: spacingY._10}}>
                    Wallet Name
                  </Typo>
                  <Input
                       placeholder="Name"
                       value={wallet.name}
                       onChangeText={(value) => 
                          setWallet({ ...wallet, name: value })
                       }
                  />
                  <Typo color={colors.neutral200} style={{ marginBottom: spacingY._10, marginTop: spacingY._20}}>
                    Wallet Icon
                  </Typo>
                  <ImageUpload
                       file={wallet.image} 
                       onClear={() => setWallet({...wallet, image: null})}
                       onSelect={(file)=> setWallet({...wallet, image: file})} 
                       placeholder='Upload Image'
                  />
              </View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
            <Button onPress={onSubmit} loading={loading} style={{ flex: 1}}>
               <Typo color={colors.black} fontWeight={"700"}>
                  Add Wallet
               </Typo>
            </Button>            
        </View>
    </ModalWrapper>
  )
}

export default WalletModal;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: spacingY._20
    },
    inputContainer: {
      
    },
    form: {
      
    },
    footer: {
      alignItems: 'center',
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: spacingY._20,
      gap: scale(12),
    }
})