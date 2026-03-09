import { firebaseDb } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";


export const getUserData = async(
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try {

        // image upload pending
        const userRef = doc(firebaseDb, "users", uid);
        await updateDoc(userRef, updatedData);

        // fetch the user & update the user state
        return { success: true, msg: "updated successfully"};
    } catch(error: any){
        console.log("error updating user: ", error);
        return { success: false, msg: error?.message };
    }
}