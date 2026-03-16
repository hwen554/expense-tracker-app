import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionListType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View, TouchableOpacity} from "react-native";
import Typo from "./Typo";
import { TransactionItemProps } from '../types';
import { verticalScale } from "@/utils/styling";
import Loading from "./Loading";
import { expenseCategories } from "@/constants/data";
const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {

  const handleClick = () => {

  }
  return (
    <View style={styles.container}>
      {title && (
        <Typo size={18} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem item={item} index={index} handleClick={handleClick}/>
          )}
          keyExtractor={(item: any, index) => item?.id ?? String(index)}
        />
      </View>

      {!loading && data?.length === 0 && (
        <Typo
           size={15}
           color={colors.neutral400}
           style={{ textAlign: "center", marginTop: spacingY._15}}
        >
            {emptyListMessage || 'No transactions'}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
            <Loading />
        </View>
      )}
    </View>
  );
};



const TransactionItem = ({ item, index, handleClick }: TransactionItemProps
 ) => {
  let category = expenseCategories["rent"];
  const IconComponent = category.icon;
  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
         <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
            {IconComponent && (
                <IconComponent
                   size={verticalScale(20)}
                   weight="fill"
                   color={colors.white}
                />
            )}
         </View>

         <View style={styles.categoryDes}>
            <Typo size={17} fontWeight={"bold"}>
                {category.label}
            </Typo>
            <Typo size={12} color={colors.neutral400} textProps={{numberOfLines: 1}}>
                paid wifi bill
            </Typo>
         </View>

         <View style={styles.amountDate}>
            <Typo fontWeight={"500"} color={colors.rose}>
                - $25
            </Typo>
            <Typo size={13} color={colors.neutral400}>
                12 Jan
            </Typo>
         </View>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._10
  },
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
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous"
  },
  categoryDes: {
    flex: 1,
    gap: 2.5
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3
  }
});
