import { useState, useEffect, useContext } from "react";
import { auth, database } from "../../firebase/firebaseConfig";
import { collection, where, query, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AuthContext from "../authContext";

export default function useParentAuth() {
  const [parentAuthUser, setParentAuthUser] = useState();
  const { parent, setParent } = useContext(AuthContext);

  const getAuth = () => {
    const parentAuth = localStorage.getItem("parentAuth");

    const parentCred = JSON.parse(parentAuth);
    if (parentCred === null) return;
    setParent(parentCred[0]);
  };

  useEffect(() => {
    getAuth();
  }, []);
  return { parent, parentAuthUser };
}
