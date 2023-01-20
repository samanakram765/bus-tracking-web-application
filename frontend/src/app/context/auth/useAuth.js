import { useState, useEffect, useContext } from "react";
import { auth, database } from "../../firebase/firebaseConfig";
import { collection, where, query, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "../authContext";

export default function useAuth() {
  const [authUser, setAuthUser] = useState();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("User registered: ", user);

      setAuthUser(user ?? false);
      if (user) {
        console.log(user.uid);
        const adminRef = collection(database, "admin");
        const q = query(adminRef, where("admin_id", "==", user.uid));
        const docSnap = await getDocs(q);
        console.log("DOc Snap : ", docSnap.empty);
        docSnap.forEach((doc) =>
          setUser({
            id: doc.id,
            emailVerified: user?.emailVerified,
            ...doc.data(),
          })
        );
      }
    });
    return unsubscribe;
  }, [setUser]);
  return { user: user || {}, authUser };
}
