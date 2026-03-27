import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchModal = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [search, setSearch] = useState("");

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const {
    data: allTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);
  // console.log("all transactions: ", allTransactions.length);

  const filteredTransactions = allTransactions.filter((item) => {
    if(search.length > 1){
      if(
        item.category?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search.toLowerCase()) 
    ) {
      return true;
     }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: 20 }}
        />

        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo
              color={colors.neutral200}
              style={{ marginBottom: spacingY._10 }}
            >
              Wallet Name
            </Typo>
            <Input
              placeholder="Search..."
              value={search}
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              onChangeText={(value) => setSearch(value)}
            />
          </View>

          <View>
            <TransactionList
              data={filteredTransactions}
              loading={transactionsLoading}
              emptyListMessage="No Transaction matches your search keyword"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  inputContainer: {},
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
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
  },
});
