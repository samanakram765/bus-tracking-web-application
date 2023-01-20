import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import Form from "../../components/Form";
import Input from "../../components/Input";
import SelectImageInput from "../../components/SelectImageInput";
import SubmitButton from "./../../components/SubmitButton";
import { updateData } from "../../firebase/firebaseCalls/addDoc";
import {
  getSpecificBus,
  getSpecificStudent,
} from "../../firebase/firebaseCalls/get";
import Loader from "../../components/Loader";
import Detail from "../../components/Detail";
import useParentAuth from "./../../context/auth/useParentAuth";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
password: Yup.string().required().label("Password"),
});

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const navigate = useNavigate();
  const [bus, setBus] = useState({});
  const { parent } = useParentAuth();
  
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        password: values.password,
      };
      const result = await updateData(data, "parent", values.image, parent.id);

      if (result === undefined) {
        setLoading(false);
        toast.warning("Image should be in png, jpeg or jpg format.", { autoClose: 1000 });
      }
      const updatedParent = [
        {
          ...parent,
          password: values.password,
        },
      ];
      localStorage.setItem("parentAuth", JSON.stringify(updatedParent));
      toast.success("Profile is updated.", { autoClose: 1000 });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getDetails = async () => {
    const student = await getSpecificStudent(parent);
    console.log("Student : ", student);
    setStudent(student);

    const bus = await getSpecificBus(student[0].busNo, student[0].institute);
    setBus(bus[0]);

    console.log("Bus : ", bus);
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (Object.entries(bus).length === 0) return <Loader />;
  return (
    <>
      <Form
        initialValues={{
          password: parent.password || "",
          image: parent.image || null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <div className="container profile-container">
          <div className="image-container">
            <img
              src={
                parent.image ? parent.image : require("../../assets/parent.png")
              }
              alt="Profile"
              className="profile-image"
            />
            <div className="update-text">
              <h1>Profile</h1>
              <p>Your personal details.</p>
            </div>

            <SelectImageInput
              name="image"
              accept="image/jpeg, image/jpg, image/png"
              classes={"w-75"} inputClasses="w-75"
            />
          </div>

          <div className="line"></div>

          <h3>Personal Details</h3>
          <Detail label="Full Name" detail={parent.fullName} />
          <Detail
            label="National Identity Number"
            detail={parent.nationalIdentityNumber}
          />

          <div className="line"></div>

          <h3>Contact Information</h3>
          <Detail label="Contact" detail={parent.parentcontact} />

          <div className="d-flex align-items-end">
            <Input
              label="Password"
              name="password"
              placeholder="Password"
              inputClasses="input"
              type="password"
            />
            <SubmitButton isLoading={loading} title="Update" />
          </div>
          <div className="line"></div>

          <h3>Student Information</h3>

          <button
            className="btn btn-sm btn-primary m-0 mt-2"
            onClick={() => navigate("/attendance")}
          >
            Check Student Attendance Record
          </button>
          {student.map((stud) => (
            <>
              <div className="line"></div>
              <div className="image-container justify-content-start align-items-start">
                <img
                  src={
                    stud.image
                      ? stud.image
                      : require("../../assets/student-avatar.jpg")
                  }
                  alt="Profile"
                  className="profile-image"
                />
                <div className="d-flex flex-column m-4">
                  <Detail
                    fontSize={40}
                    detail={stud.firstname + " " + stud.lastname}
                  />
                  <Detail fontSize={20} detail={stud.parent} />
                  <Detail fontSize={20} detail={stud.rollNo} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                    }}
                  >
                    <Detail fontSize={20} detail={"Status "} />
                    <div
                      style={{
                        marginLeft: 10,
                        width: 15,
                        height: 15,
                        backgroundColor:
                          stud.onAndOffBoard === undefined ||
                          stud.onAndOffBoard === false
                            ? "red"
                            : "green",
                        borderRadius: 15 / 2,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="line"></div>
              <div className="items">
                <div className="items-details my-4">
                  <Detail fontSize={20} label="Contact" detail={stud.contact} />
                  <div className="right-item">
                    <Detail
                      fontSize={20}
                      label="Parent Contact"
                      detail={stud.parentcontact}
                    />
                  </div>
                </div>

                <div className="items-details my-4">
                  <Detail fontSize={20} label="Address" detail={stud.address} />
                  <div className="right-item">
                    <Detail
                      fontSize={20}
                      label="Country"
                      detail={stud.country}
                    />
                  </div>
                </div>
                <div className="items-details my-4">
                  <Detail fontSize={20} label="City" detail={stud.city} />
                  <div className="right-item">
                    <Detail
                      fontSize={20}
                      label="Institute"
                      detail={stud.institute}
                    />
                  </div>
                </div>

                <div className="items-details my-4">
                  <Detail fontSize={20} label="Bus No" detail={stud.busNo} />
                  <div className="right-item">
                    <Detail
                      fontSize={20}
                      label="Postal Code"
                      detail={stud.postalcode}
                    />
                  </div>
                </div>
              </div>
            </>
          ))}
          <div className="line"></div>
          <h3>Bus Details</h3>
          <div className="line"></div>
          <div className="image-container justify-content-start align-items-start">
            <img
              src={
                bus.image
                  ? bus.image
                  : require("../../assets/zaid-saleem-image.jpg")
              }
              alt="Profile"
              className="profile-image square-image"
            />
            <div className="d-flex flex-column m-4">
              <Detail fontSize={40} detail={bus.licenseNo} />
              <Detail fontSize={20} detail={bus.institute} />
              <Detail fontSize={20} detail={bus.maintainance} />
            </div>
          </div>
          <div className="items">
            <h4>Bus Routes</h4>
            <div className="items-details">
              {bus?.busRoutes.map((route) => (
                <div
                  className="input-container"
                  style={{ flexDirection: "row" }}
                >
                  <Detail label="Latitude" detail={route.latitude} />
                  <Detail
                    label="Longitude"
                    detail={route.longitude}
                    margin="0 25px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Profile;
