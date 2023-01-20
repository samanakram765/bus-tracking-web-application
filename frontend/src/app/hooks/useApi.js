import { useState } from "react";
import {
  deleteDoc,
  doc,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { database } from "./../firebase/firebaseConfig";

export default function useApi() {
  const [data, setData] = useState([]);

  const deleteDocument = async (collectionName, id) => {
    const documentRef = doc(database, collectionName, id);
    await deleteDoc(documentRef);
  };

  const getDocumentByInstitute = async (collectionName, userInstitute) => {
    const documentCollection = collection(database, collectionName);
    const q = query(
      documentCollection,
      where("institute", "==", userInstitute)
    );

    const documentSnapshot = await getDocs(q);
    const documents = documentSnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    setData(documents);

    return documents;
  };

  return {
    deleteDocument,
    getDocumentByInstitute,
    data,
  };
}
