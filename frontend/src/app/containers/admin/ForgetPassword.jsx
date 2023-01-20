import { useContext, useState } from "react";
import * as Yup from "yup";
import { useNavigate, Navigate } from "react-router-dom";

import { auth, database } from "../../firebase/firebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";

import Input from "../../components/Input";
import SubmitButton from "./../../components/SubmitButton";
import Form from "./../../components/Form";
import useAuth from "../../context/auth/useAuth";
import AuthContext from "../../context/authContext";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
});

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, authUser } = useAuth();
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const sendPasswordResetLink = async (values) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast.success("Password reset link send to your email", { autoClose: 1000 });
    } catch (error) {
      if (error.message.includes("auth/user-not-found"))
        return toast.error("User not found.", { autoClose: 1000 });

      toast.error("Something went wrong.", { autoClose: 1000 });
    }
  };

  if (authUser === undefined || Object.keys(user).length !== 0) return null;

  if (authUser && Object.keys(user).length === 0) {
    return <Navigate to="/admin/home" />;
  }

  // if (Object.keys(user).length === 0 && authUser !== undefined) {
  //   return <Navigate to={"/not-found"} />;
  // }
  return (
    <div className="login-register-container">
      <img src={require("../../assets/BTS.png")} alt="logo" className="logo" />
      <h1 className="sign-in-text">Sign in</h1>

      <Form
        initialValues={{ email: "" }}
        onSubmit={sendPasswordResetLink}
        validationSchema={validationSchema}
      >
        <Input
          label="EMAIL"
          type="email"
          placeholder="ENTER EMAIL"
          classes="input"
          name="email"
        />

        <SubmitButton title="Send Password Link" isLoading={isLoading} />

        <h5 className="new-account-text">Don't have an Admin Account?</h5>

        <button
          className="btn btn-md btn-primary button"
          onClick={() => navigate("/admin/register")}
        >
          Create New Account
        </button>
      </Form>
    </div>
  );
};

export default ForgetPassword;
