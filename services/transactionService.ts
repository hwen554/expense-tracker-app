import { firebaseDb } from "@/config/firebase";
import { TransactionType, WalletType } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
) => {
    try {
        const {id, type, walletId, amount, image} = transactionData;
        if(!amount || amount <= 0 || !walletId || !type){
            return { success: false, msg: "Invalid transaction data!"};
        }

        if(id){
            // todo: update existing transaction

        }else{
            // update wallet for new transaction
            let res = await updateWalletForNewTransaction(
                walletId!, 
                Number(amount!), 
                type
            );
            if(!res.success) return res;
        }

        if(i)

        return { success: true}
    }catch(error: any){
        console.log("error: ", error);
        return { success: false, msg: error?.message || "An error occurred" };
    }
}

const updateWalletForNewTransaction = async(
    walletId: string,
    amount: number,
    type: string
) => {
    try{
        const walletRef = doc(firebaseDb, "wallets", walletId);
        const walletSnapshot = await getDoc(walletRef);
        if(!walletSnapshot.exists()){
            console.log("error updating wallet for new transaction");
            return { success: false, msg: "Wallet not found!" };
        }

        const walletData = walletSnapshot.data() as WalletType;

        if(type === "expense" && walletData.amount! - amount < 0){
            return { success: false, msg: "Selected wallet does not have enough balance" };
        }

        const updatedType = type == "income" ? "totalIncome" : "totalExpenses";
        const updatedWalletAmount = 
            type == "income" 
            ? Number(walletData.amount) + amount
            : Number(walletData.amount) - amount;

        const updatedTotals = type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;
        
        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updatedType]: updatedTotals
        });

        return { success: true };
    }catch(error: any){
        console.log("error updating wallet for new transaction", error);
        return { success: false, msg: error.message };
    }
}