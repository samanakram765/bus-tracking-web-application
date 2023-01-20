import { useContext, useState } from "react";
import * as Yup from "yup";
import { useNavigate, Navigate } from "react-router-dom";

import { auth, database } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";

import Input from "../../components/Input";
import SubmitButton from "./../../components/SubmitButton";
import Form from "./../../components/Form";
import useAuth from "../../context/auth/useAuth";
import AuthContext from "../../context/authContext";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().label("Password"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, authUser } = useAuth();
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log("user cred : ", userCred);
      const adminRef = collection(database, "admin");
      const q = query(adminRef, where("admin_id", "==", userCred.user.uid));

      const docSnap = await getDocs(q);

      console.log("credentials : ", docSnap.empty);
      docSnap.forEach((doc) => setUser({ id: doc.id, ...doc.data() }));

      toast.success("Successfull", { autoClose: 1000 });
      navigate("/admin/home");
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      if (error.message.includes("auth/user-not-found"))
        return toast.error("Email is not valid", { autoClose: 1000 });

      if (error.message.includes("auth/wrong-password"))
        return toast.error("You have entered wrong password", { autoClose: 1000 });
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
        initialValues={{ email: "", password: "" }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        <Input
          label="EMAIL"
          type="email"
          placeholder="ENTER EMAIL"
          classes="input"
          name="email"
        />

        <Input
          label="PASSWORD"
          type="password"
          placeholder="ENTER PASSWORD"
          classes="input"
          name="password"
        />

        <SubmitButton title="Sign in" isLoading={isLoading} />
        <p
          className="forgot-password label"
          onClick={() => navigate("/admin/forget")}
        > 
          forgot your password?
        </p>
        {/* <h5 className="new-account-text">Don't have an Admin Account?</h5>
        <button
          className="btn btn-md btn-primary button"
          onClick={() => navigate("/admin/register")}
        >
          Create New Account
        </button> */}
      </Form>
    </div>
  );
};

export default Login;
