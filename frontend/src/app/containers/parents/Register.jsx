import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import { getInstitutes } from "../../firebase/firebaseCalls/get";
import Datalist from "../../components/Datalist";
import Input from "../../components/Input";
import Form from "../../components/Form";
import SubmitButton from "../../components/SubmitButton";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  rollno: Yup.number().required().label("Roll Number"),
  institute: Yup.string().required().label("Institute Name"),
  email: Yup.string().email().required().label("Email"),
  contact: Yup.number().required().label("Contact Number"),
  password: Yup.string().min(8).max(12).required().label("Password"),
});

const Register = () => {
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const parentCollection = collection(database, "parent");

  const getAllInstitutes = async () => {
    try {
      const result = await getInstitutes();
      setInstituteOptions(result);
    } catch (error) {
      console.log(error);
    }
  };

  const registerParent = async (values) => {
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await addDoc(parentCollection, {
        parent_id: userCredentials.user.uid,
        firstname: values.firstname,
        lastname: values.lastname,
        rollno: values.rollno,
        institute: values.institute,
        email: values.email,
        contact: values.contact,
        password: values.password,
      });

      setLoading(false);
      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something went wrong!", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    getAllInstitutes();
  }, []);

  return (
    <div className="register-page">
      <div className="register-container p-0">
        <div className="row h-100 m-0">
          <div className="col-md-3 left-container p-0">
            <img
              src={require("../../assets/student-4.jpg")}
              className="left-container-img"
              alt=""
            />
          </div>
          <div className="col-md-9 right-container p-5">
            <span className="register-heading" data-aos="fade-right">
              Register
            </span>
            <p className="register-tagline" data-aos="fade-left">
              Track your child bus by creating account
            </p>
            <div className="form" data-aos="fade-right">
              <Form
                initialValues={{
                  firstname: "",
                  lastname: "",
                  rollno: "",
                  institute: "",
                  email: "",
                  contact: "",
                  password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={registerParent}>
                <div className="two-input-container my-2">
                  <Input
                    name="firstname"
                    inputClasses="input"
                    label="First Name"
                    type="text"
                  />
                  <Input
                    name="lastname"
                    inputClasses="input"
                    classes="mx-md-3"
                    label="Last Name"
                    type="text"
                  />
                </div>

                <div className="two-input-container my-2">
                  <Input
                    name="email"
                    inputClasses="input"
                    label="Email"
                    type="text"
                  />
                  <Input
                    name="password"
                    inputClasses="input"
                    classes="mx-md-3"
                    label="Password"
                    type="password"
                  />
                </div>

                <div className="two-input-container my-2">
                  <Input
                    name="rollno"
                    inputClasses="input"
                    label="Roll Number"
                    type="text"
                  />
                  <Datalist
                    label="Institute"
                    name="institute"
                    classes="mx-md-3"
                    width={250}
                    options={instituteOptions}
                  />
                </div>

                <Input
                  name="contact"
                  inputClasses="input"
                  label="Contact Number"
                  type="text"
                />

                <SubmitButton
                  title="Sign up"
                  isLoading={loading}
                  isParentButton={true}
                />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
