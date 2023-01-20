import React from "react";
import useAuth from "../../context/auth/useAuth";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const { user } = useAuth();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="email-verify-container">
      <img
        src={require("../../assets/email-verify.png")}
        alt=""
        className="email-verify-image"
      />

      <div className="text-container">
        <p>
          Check your mail inbox to verify your email on this <b>{user.email}</b>
          email
        </p>
        <p>
          Don't forget to check your spam folder if you don't find your
          activation mail in inbox
        </p>
        <button
          className="btn btn-lg btn-primary button mt-4"
          onClick={() => window.open("https://mail.google.com/")}
        >
          Open Email
        </button>
        <button
          className="btn btn-lg btn-primary button mt-4"
          onClick={() => {
            setUser(null);
            signOut(auth);
            navigate("/admin/login", { replace: true });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
