import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native'
import { UserDataType, WalletType } from '@/types';
import React, { useState, useEffect } from 'react'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/contexts/authContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { colors, spacingX, spacingY } from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { updateUser } from '@/services/userService';
import { scale, verticalScale } from '@/utils/styling';
import ImageUpload from '@/components/ImageUpload';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import * as Icons from 'phosphor-react-native';



const WalletModal = () => {
  const {user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
      name: "",
      image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const oldWallet: {name: string, image: string, id: string} = useLocalSearchParams();
  console.log("old wallet: ", oldWallet);

  useEffect(() => {
    if (oldWallet?.id){
      setWallet({
        name: oldWallet.name,
        image: oldWallet.image,
      });
    }
  }, []);
  
  const onSubmit = async() => {
    let { name, image } = wallet;
    if(!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid
    };
    if(oldWallet?.id) data.id = oldWallet?.id;
    // todo: include wallet id if updating 
    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    // console.log('result: ', res);
    if(res.success){
      router.back();
    }else{
      Alert.alert("Wallet", res.msg);
    }
  };

  const onDelete = async() => {
      console.log("delete wallet: ", oldWallet?.id);
      if(!oldWallet?.id) return;
      setLoading(true);
      const res = await deleteWallet(oldWallet?.id);
      setLoading(false);
      if(res.success){
        router.back();
      }else{
        Alert.alert("Delete Wallet", res.msg);
      }
  }

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet? \nThis action will remove all transactions associated with this wallet and cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Delete"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive"
        }
      ]
    );
  }

  return (
    <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
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
            {oldWallet?.id && !loading && (
              <Button onPress={showDeleteAlert} style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15}}>
                 <Icons.Trash
                    color={colors.white}
                    size={verticalScale(24)}
                    weight="bold"
                 />
              </Button>
            )}
            <Button onPress={onSubmit} loading={loading} style={{ flex: 1}}>
               <Typo color={colors.black} fontWeight={"700"}>
                  {
                    oldWallet?.id ? "Update Wallet" : "Add Wallet"
                  }
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