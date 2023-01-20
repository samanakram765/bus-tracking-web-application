import { useState } from "react";
import * as Yup from "yup";
import { database } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";

import Input from "../../components/Input";
import Form from "../../components/Form";
import SubmitButton from "../../components/SubmitButton";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import { toast } from "react-toastify";
import InputWithMask from "../../components/InputWithMask";
import { useEffect } from "react";
import { getInstitutes } from "../../firebase/firebaseCalls/get";
import Datalist from "../../components/Datalist";
import Detail from "../../components/Detail";
import moment from "moment/moment";

const validationSchema = Yup.object().shape({
  nationalIdentityNumber: Yup.string()
    .min(15)
    .max(15)
    .required()
    .label("National Identity Number"),
  password: Yup.string().required().label("Password"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  // const [institutes, setInstitutes] = useState([]);
  // const [selectedInstitute, setSelectedInstitute] = useState("");
  const { parent, setParent } = useContext(AuthContext);

  const navigate = useNavigate();

  // const getInstitutes = async () => {
  //   const previousDay = moment().subtract(1, "days").format("DD/MM/YYYY");

  //   const instituteCollection = collection(database, "institute");

  //   const institutesSnapshot = await getDocs(instituteCollection);

  //   const institutes = institutesSnapshot.docs.map((institutes) => ({
  //     id: institutes.get("institute"),
  //     value: institutes.get("institute"),
  //   }));

  //   setInstitutes(institutes);
  //   setSelectedInstitute(institutes[institutes.length - 1].value);
  // };

  const login = async (values) => {
    setLoading(true);

    

    try {
      const parentCollection = collection(database, "parent");
      const q1 = query(
        parentCollection,
        where("nationalIdentityNumber", "==", values.nationalIdentityNumber),
        where("password", "==", values.password),
        where("institute", "==", "GPCW")
      );

      const parentSnapshot = await getDocs(q1);

      

      if (parentSnapshot.empty) {
        setLoading(false);
        return toast.error("Your NID doesn't match with password.", { autoClose: 1000 });
      }
      const parent = parentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
 

      setParent(parent[0]);
      localStorage.setItem("parentAuth", JSON.stringify(parent));
      toast.success("Successfull", { autoClose: 1000 });
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);

      toast.error("Something went wrong!", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    // getInstitutes();
  }, []);

  if (parent) return <Navigate to="/" />;

  return (
    <div className="login-page">
      <div className="login-container p-0">
        <div className="row h-100 m-0">
          <div className="col-md-4 left-container p-0">
            <img
              src={require("../../assets/bus.jpg")}
              className="left-container-img"
              alt=""
            />
          </div>
          <div className="col-md-8 d-flex align-items-center justify-content-center flex-column right-container">
            <span className="login-heading" data-aos="fade-right">
              Log in
            </span>
            <p className="login-tagline text-center mb-5" data-aos="fade-left">
              You are one step away from tracking <br /> your child institute
              bus
            </p>
            <div className="form" data-aos="fade-right">
              <Form
                initialValues={{
                  nationalIdentityNumber: "",
                  password: "",
                  // institute: "",
                }}
                validationSchema={validationSchema}
                onSubmit={login}
              >
                <InputWithMask
                  name="nationalIdentityNumber"
                  inputClasses="input"
                  label="National Id Number"
                  type="text"
                  mask={"99999-9999999-9"}
                />
                <Input
                  name="password"
                  inputClasses="input"
                  label="Password"
                  type="password"
                />

                {/* <Detail label={"Select Institute"} />
                <select
                  className="form-select w-100 mt-2"
                  aria-label="Default select example"
                  onChange={(e) => setSelectedInstitute(e.target.value)}
                >
                  {institutes.map((institute) => (
                    <option selected value={institute.value}>
                      {institute.value}
                    </option>
                  ))}
                </select> */}

                <SubmitButton
                  title="Log in"
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

export default Login;
