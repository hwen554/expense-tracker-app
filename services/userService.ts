import { firebaseDb } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";


export const updateUser = async(
    uid: string,
    updateData: UserDataType
): Promise<ResponseType> => {
    try{
        // image upload pending
        const userRef = doc(firebaseDb, "users", uid);
        await updateDoc(userRef, updateData);

        return { success: true, msg: "User updated successfully" };

    }catch(err: any){
        console.log("Error updating user: ", err);
        return { success: false, msg: err?.message };
    }
}