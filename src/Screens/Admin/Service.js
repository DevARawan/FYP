import { Firestore } from "firebase/firestore";
import { useEffect } from "react";


const AdminService = ({children, navigation}) => {
    
 

    return children({
        navigation,
    });
}
export default AdminService;