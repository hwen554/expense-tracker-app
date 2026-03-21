import { firebaseDb } from "@/config/firebase";
import { TransactionType, WalletType, ResponseType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {
        const {id, type, walletId, amount, image} = transactionData;
        if(!amount || amount <= 0 || !walletId || !type){
            return { success: false, msg: "Invalid transaction data!"};
        }

        if(id){
            // todo: update existing transaction
            const oldTransactionSnapshot = await getDoc(doc(firebaseDb, "transactions", id));
            const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
            const shouldRevertOriginal = 
            oldTransaction.type != type || 
            oldTransaction.amount != amount || 
            oldTransaction.walletId != walletId;
            if(shouldRevertOriginal){
                let res = await revertAndUpdateWallets(oldTransaction, Number(amount), type, walletId);
                if(!res.success) return res;
            }
        }else{
            // update wallet for new transaction
            let res = await updateWalletForNewTransaction(
                walletId!, 
                Number(amount!), 
                type
            );
            if(!res.success) return res;
        }

        if(image){
            const imageUploadRes = await uploadFileToCloudinary(
                image,
                "transactions"
            );
            if(!imageUploadRes.success){
                return {
                    success: false,
                    msg: imageUploadRes.msg || "Failed to upload receipt "
                };
            }
            transactionData.image = imageUploadRes.data;
        }

        const transactionRef = id
          ? doc(firebaseDb, "transactions", id)
          : doc(collection(firebaseDb, "transactions"));

          await setDoc(transactionRef, transactionData, { merge: true });


        return { 
            success: true,
            data: { ...transactionData, id: transactionRef.id }
        }
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

const revertAndUpdateWallets = async(
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string
) => {
    try{
        const oldWalletSnapshot = await getDoc(doc(firebaseDb, "wallets", oldTransaction.walletId));

        const originalWallet = oldWalletSnapshot.data() as WalletType;

        let newWalletSnapshot = await getDoc(doc(firebaseDb, "wallets", newWalletId));


        let newWallet = newWalletSnapshot.data() as WalletType;

        const revertType = oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

        const revertIncomeExpense: number = 
        oldTransaction.type == "income"
            ? - Number(oldTransaction.amount) :
            Number(oldTransaction.amount);
        
        const revertedWalletAmount = 
        Number(originalWallet.amount) + revertIncomeExpense;
        
        const revertedIncomeExpenseAmount = 
        Number(originalWallet[revertType]) - Number(oldTransaction.amount);

        if(newTransactionType == "expense"){

        }

        return { success: true };
    }catch(error: any){
        console.log("error updating wallet for new transaction", error);
        return { success: false, msg: error.message };
    }
}