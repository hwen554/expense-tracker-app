import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { firebaseDb } from "@/config/firebase";

export const createOrUpdateWallet = async(
    walletData: Partial<WalletType>
): Promise<ResponseType> => {
    try{
        let walletToSave = { ...walletData };
        if(walletData.image) {
            const imageUploadRes = await uploadFileToCloudinary(
                walletData.image,
                "wallets"
            );
            if (!imageUploadRes.success) {
                return {
                    success: false,
                    msg: imageUploadRes.msg || "Failed to upload wallet icon",
                };
            }
            walletToSave.image = imageUploadRes.data;
        }

        if(!walletData?.id){
            // new wallet 
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date()
        }

        const walletRef = walletData?.id ? 
        doc(firebaseDb, "wallets", walletData?.id) : 
        doc(collection(firebaseDb, "wallets"));

        await setDoc(walletRef, walletToSave, { merge: true }); // updates only the data provided
        return { success: true, data: { ...walletToSave, id: walletRef.id }};
    }catch(error: any){
        console.log('error', error);
        return { success: false, msg: error?.message || "An error occurred" };
    }
}

export const deleteWallet = async(walletId: string): Promise<ResponseType> => {
    try{
        const walletRef = doc(firebaseDb, "wallets", walletId);
        await deleteDoc(walletRef);
        return { success: true, msg: "Wallet deleted successfully" };
    }catch(error: any){
        console.log('error', error);
        return { success: false, msg: error?.message || "An error occurred" };
    }
}

export const deleteTransactionsByWalletId = async(walletId: string): Promise<ResponseType> => {
    try{
        let hasMoreTransactions = true;

        while(hasMoreTransactions){
            const transactionsQuery = query(
                collection(firebaseDb, "transactions"),
                where("walletId", "==", walletId),
            );
            const transactionsSnapshot = await getDocs(transactionsQuery);
            if(transactionsSnapshot.size == 0){
                hasMoreTransactions = false;
                break;
            }

            const batch = writeBatch(firebaseDb);

            transactionsSnapshot.forEach((transactionDoc) => {
                batch.delete(transactionDoc.ref);
            });

            await batch.commit();

            console.log(`${transactionsSnapshot.size} transactions deleted in this batch`)

        }
        return {
            success: true,
            msg: "All transactions deleted successfully",
        };
        return { success: true, msg: "Wallet deleted successfully" };
    }catch(error: any){
        console.log('error', error);
        return { success: false, msg: error?.message || "An error occurred" };
    }
}
