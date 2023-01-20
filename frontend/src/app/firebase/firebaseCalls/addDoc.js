import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, database } from "../firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const validateImage = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  const { type } = image[0];
  if (type === "image/jpeg" || type === "image/jpg" || type === "image/png")
    return true;

  return false;
};

const storeImage = async (collectionName, image) => {
  try {
    const result = validateImage(image);

    let downloadedUrl = "";
    if (result === true) {
      const imageName = new Date().valueOf() + "_" + image[0].name;
      const imageRef = ref(storage, collectionName + imageName);
      const snapShot = await uploadBytes(imageRef, image[0]);
      downloadedUrl = await getDownloadURL(snapShot.ref);

      return downloadedUrl;
    }
    if (result === image || result === "") return result;
    return false;
  } catch (error) {
    console.log(error);
    toast.error("Error occured while saving image.", { autoClose: 1000 });
  }
};

const storeDriverImages = async (
  collectionName,
  image,
  licenseImage,
  medicalReportImage
) => {
  const downloadedUrl = await Promise.all([
    storeImage(collectionName + "/", image),
    storeImage(collectionName + "/", licenseImage),
    storeImage(collectionName + "/", medicalReportImage),
  ]);

  return downloadedUrl;
};

export const addData = async (
  data,
  collectionName,
  image,
  medicalReportImage,
  licenseImage
) => {
  const collectionRef = collection(database, collectionName);
  const result = await storeImage(collectionName + "/", image);

  const information = {
    ...data,
    image: result,
  };

  if (licenseImage || medicalReportImage) {
    const downloadedUrl = await storeDriverImages(
      collectionName,
      image,
      licenseImage,
      medicalReportImage
    );

    if (downloadedUrl.includes(false)) return;

    information.image = downloadedUrl[0];
    information.licenseImage = downloadedUrl[1];
    information.medicalReport = downloadedUrl[2];
  }

  if (result === false) return;

  const response = await addDoc(collectionRef, information);

  return response;
};

export const updateData = async (
  data,
  collectionName,
  image,
  docId,
  licenseImage,
  medicalReportImage
) => {
  const result = await storeImage(collectionName + "/", image);

  const information = {
    ...data,
    image: result,
  };
  if (licenseImage || medicalReportImage) {
    const downloadedUrl = await storeDriverImages(
      collectionName,
      image,
      licenseImage,
      medicalReportImage
    );

    if (downloadedUrl.includes(false)) return;

    information.image = downloadedUrl[0];
    information.licenseImage = downloadedUrl[1];
    information.medicalReport = downloadedUrl[2];
  }

  if (result === false || result === undefined) return;

  const docRef = doc(database, collectionName, docId);

  await updateDoc(docRef, information);
  return information;
};
