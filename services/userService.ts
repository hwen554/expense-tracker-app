import { firebaseDb } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";


export const updateUser = async(
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try{
        
        if(updatedData.image && updatedData?.image?.uri){
            const imageUploadRes = await uploadFileToCloudinary(updatedData.image, "users");
            if(!imageUploadRes.success){
                return { success: false, msg: imageUploadRes.msg || "Could not upload image" };
            }
            updatedData.image = imageUploadRes.data;
        }
        const userRef = doc(firebaseDb, "users", uid);
        await updateDoc(userRef, updatedData);

        return { success: true, msg: "User updated successfully" };

    }catch(err: any){
        console.log("Error updating user: ", err);
        return { success: false, msg: err?.message };
    }
}