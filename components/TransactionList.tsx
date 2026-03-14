import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionListType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";
const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  return (
    <View style={styles.container}>
      {title && (
        <Typo size={18} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data || []}
          renderItem={({ item, index }) => (
            <TransactionItem item={item} index={index} />
          )}
          keyExtractor={(item: any, index) => item?.id ?? String(index)}
        />
      </View>
    </View>
  );
};

const TransactionItem = ({ item, index }: { item: any; index: number }) => {
  return (
    <View>
      <Typo>Transaction Item</Typo>
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {},
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,

    // list with background
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
});
