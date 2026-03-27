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



const SearchModal = () => {
  const {user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [search, setSearch] = useState("");






  return (
    <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={"Search"}
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
                       placeholder="Search..."
                       value={search}
                       onChangeText={(value) => 
                          setSearch(value)
                       }
                  />
              </View>
          </ScrollView>
        </View>

        
    </ModalWrapper>
  )
}

export default SearchModal;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: spacingY._20
    },
    inputContainer: {
      
    },
    form: {
      gap: spacingY._30,
      marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },
    avatar: {
      alignSelf: "center",
      backgroundColor: colors.neutral300,
      height: verticalScale(135),
      width: verticalScale(135),
      borderRadius: scale(999),
      borderWidth: 1,
      borderColor: colors.neutral500,
    },
    editIcon: {
        position: "absolute",
    }
    
})