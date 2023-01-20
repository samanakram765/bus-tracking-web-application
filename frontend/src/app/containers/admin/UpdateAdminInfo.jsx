import { useState } from "react";
import * as Yup from "yup";
import { useMatch, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, database, storage } from "../../firebase/firebaseConfig";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

import Input from "../../components/Input";
import Form from "../../components/Form";
import SubmitButton from "../../components/SubmitButton";
import useAuth from "./../../context/auth/useAuth";
import SelectImageInput from "./../../components/SelectImageInput";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  EmailAuthCredential,
} from "firebase/auth";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  designation: Yup.string().required().label("Designation"),
  country: Yup.string().required().label("Country"),
  city: Yup.string().required().label("City"),
  address: Yup.string().required().label("Address"),
  postalcode: Yup.string()
    .min(5, "Postal Code must be 5 digits")
    .max(5, "Postal Code must be 5 digits")
    .required()
    .label("Postal Code"),
  contact: Yup.string().required().label("Contact"),
  password: Yup.string().min(8).max(12).label("Password"),
});

const UpdateAdminInfo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const validateImage = (image) => {
    if (!image) return "";
    const { type } = image[0];

    if (type === "image/jpeg" || type === "image/jpg" || type === "image/png")
      return true;

    return false;
  };

  const handleUpdateAdmin = async (values) => {
    setIsProcessing(true);
    try {
      const result = validateImage(values.image);

      let downloadedUrl = "";
      let imageName = "";
      if (result === true) {
        imageName = values.image[0].name;

        const imageRef = ref(storage, "admin-image/" + imageName);

        const snapShot = await uploadBytes(imageRef, values.image[0]);
        downloadedUrl = await getDownloadURL(snapShot.ref);
      }

      const docRef = doc(database, "admin", match.params.id);

      await updateDoc(docRef, {
        firstname: values.firstname,
        lastname: values.lastname,
        designation: values.designation,
        country: values.country,
        city: values.city,
        address: values.address,
        postalcode: values.postalcode,
        contact: values.contact,
        image: downloadedUrl,
        imageName: imageName,
      });

      if (values.password) {
        updatePassword(auth.currentUser, values.password)
          .then((value) => {
            console.log("Password : ", value);
            const credential = EmailAuthProvider.credential(
              auth.currentUser.email,
              values.password
            );

            console.log("Email provided : ", credential);
            reauthenticateWithCredential(auth.currentUser, credential).then(
              (res) => {
                console.log("Response : ", res);
              }
            );
          })
          .catch((err) => {
            console.log("ERROR :", err);
          });
      }
      toast.success("Data Saved Successfully!", { autoClose: 1000 });
      setIsProcessing(false);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong!", { autoClose: 1000 });
    }
  };

  const match = useMatch({ path: "/admin/admin_update/:id" });

  if (user === null) {
    return null;
  }

  if (match.params.id !== user.id) {
    return <Navigate to="/not-found" />;
  }

  return (
    <>
      <div className="admin">
        <h1>UPDATE YOUR INFORMATION</h1>
        <div className="items">
          <Form
            initialValues={{
              firstname: user?.firstname || "",
              lastname: user?.lastname || "",
              designation: user?.designation || "",
              country: user?.country || "",
              city: user?.city || "",
              address: user?.address || "",
              postalcode: user?.postalcode || "",
              contact: user?.contact || "",
              image: user?.image || null,
              password: "",
              email: auth.currentUser.email || "",
            }}
            onSubmit={handleUpdateAdmin}
            validationSchema={validationSchema}
          >
            <h4>Personal Information</h4>
            <div className="line"></div>

            <div className="image-container image-flex-start">
              <img
                src={
                  user.image
                    ? user.image
                    : require("../../assets/profile-avatar.jpg")
                }
                className="profile-image"
                alt="profile"
              />

              <SelectImageInput name="image" classes={"w-75"} inputClasses="w-75"/>
            </div>
            <div className="line"></div>
            <div className="items-details">
              <Input label="First Name" name="firstname" type="text"  classes={'w-75'}
                inputClasses="w-75" />
              <Input label="Last Name" name="lastname" type="text"  classes={'w-75'}
                inputClasses="w-75"/>
            </div>
            <div className="items-details">
              <Input label="Designation" name="designation" type="text"  classes={'w-75'}
                inputClasses="w-75"/>
              <Input label="Password" name="password" type="text"  classes={'w-75'}
                inputClasses="w-75"/>
            </div>
            <div className="items-details">
              <Input label="Email" name="email" type="text" disabled={true} classes={'w-75'}
                inputClasses="w-75"/>
            </div>
            <div className="line"></div>
            <h4>Physical Address</h4>
            <div className="items-details">
              <Input label="Country" name="country" type="text"  classes={'w-75'}
                inputClasses="w-75" />
              <Input label="City Name" name="city" type="text"   classes={'w-75'}
                inputClasses="w-75"/>
            </div>
            <div className="items-details">
              <Input label="Address" name="address" type="text" classes={'w-75'}
                inputClasses="w-75" />
              <Input label="Postal Code" name="postalcode" type="text" classes={'w-75'}
                inputClasses="w-75" />
            </div>
            <div className="items-details">
              <Input  label="Contact" name="contact" type="text"  classes={"w-75"} inputClasses="w-75"/>
            </div>

            <SubmitButton title="Update Admin" isLoading={isProcessing} />
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateAdminInfo;
