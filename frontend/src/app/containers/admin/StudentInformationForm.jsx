import { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  collection,
  getDocs,
  where,
  query,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import { useLocation, useMatch } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Input from "../../components/Input";
import Form from "../../components/Form";
import SubmitButton from "../../components/SubmitButton";
import Select from "./../../components/select";
import useAuth from "../../context/auth/useAuth";
import SelectImageInput from "../../components/SelectImageInput";
import { addData, updateData } from "../../firebase/firebaseCalls/addDoc";
import Loader from "../../components/Loader";
import InputWithMask from "../../components/InputWithMask";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  parent: Yup.string().required().label("Father/Guardian"),
  parentcontact: Yup.number("Parent Contact must be numbers.")
    .typeError("Contact must be numbers")
    .required()
    .label("Parent Contact"),
  gaurdianEmail: Yup.string().required().label("Guardian Email").email(),
  country: Yup.string().required().label("Country"),
  city: Yup.string().required().label("City"),
  address: Yup.string().required().label("Address"),
  postalcode: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Postal Code must be 5 digits")
    .max(5, "Postal Code must be 5 digits")
    .required()
    .label("Postal Code"),
  contact: Yup.number("Contact must be numbers")
    .typeError("Contact must be numbers")
    .required()
    .label("Contact"),
  busNo: Yup.string().required().label("Bus No"),
  class: Yup.string().required().label("Class"),
  image: Yup.string().nullable().required().label("Student Image"),
  nationalIdentityNumber: Yup.string()
    .required()
    .label("National Identity Number"),
});

const StudentInformationForm = () => {
  const navigate = useNavigate();
  const [busNoList, setBusNoList] = useState([]);
  const [collectFee, setCollectFee] = useState([
    { id: 2, label: "pending", value: "pending" },
    { id: 1, label: "collected", value: "collected" },
  ]);
  const [parentDetail, setParentDetail] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const match = useMatch("/admin/student_update/:id");

  console.log("Location of bus : ", location);
  const {
    firstname,
    rollNo,
    lastname,
    parent,
    parentcontact,
    country,
    city,
    address,
    postalcode,
    contact,
    busNo,
    imageName,
    image,
    class: majorOrClass,
    isUpdated,
    fatherNID,
    collectFee: fee,
    busSeatCapacity: seatCapacity,
  } = location.state || {};

  console.log("Location for student: ", location);

  const getParentDetails = async () => {
    if (!fatherNID) return;
    setLoading(true);
    const parentCollection = collection(database, "parent");

    const q = query(
      parentCollection,
      where("nationalIdentityNumber", "==", fatherNID)
    );

    const parentSnapshot = await getDocs(q);

    const parentDetails = parentSnapshot.docs.map((parent) => ({
      id: parent.id,
      ...parent.data(),
    }));
    setParentDetail(parentDetails[0]);
    setLoading(false);
  };

  const getBusDetails = async () => {
    const busCollection = collection(database, "bus");

    const q = query(busCollection, where("institute", "==", user.institute));

    const busSnapshot = await getDocs(q);

    const busDetails = busSnapshot.docs.map((bus) => ({
      id: bus.id,
      label: bus.get("busNo"),
      value: bus.get("busNo"),
      seatCapacity: bus.get("seatCapacity"),
    }));
    console.log("Bus Details : ", busDetails);
    setBusNoList(busDetails);
  };

  const handleStudentInformation = async (values, { resetForm }) => {
    setIsProcessing(true);

    try {
      const filteredBusNo = busNoList.filter(
        (busNo) => busNo.value == values.busNo
      );

      const busRef = doc(database, "bus", filteredBusNo[0].id);
      const bus = await getDoc(busRef);
      const busData = { id: bus.id, ...bus.data() };


      console.log("Filtered bus no : ", filteredBusNo, seatCapacity);
      if(!isUpdated){

      if (busData?.seatCapacityFilled >= busData.seatCapacity) {
        setIsProcessing(false);
        return toast.error(`Bus No ${values.busNo} seat capacity is full`,{ autoClose: 1000 });
      }
    }

      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        parent: values.parent,
        institute: user.institute,
        parentcontact: values.parentcontact,
        country: values.country,
        city: values.city,
        address: values.address,
        postalcode: values.postalcode,
        contact: values.contact,
        busNo: values.busNo,
        rollNo: values.rollNo,
        imageName: values.image[0].name || imageName,
        class: values.class,
        collectFee: values.collectFee,
        fatherNID: String(values.nationalIdentityNumber),
        gaurdianEmail: String(values.gaurdianEmail),
      };

      const parentData = {
        nationalIdentityNumber: String(values.nationalIdentityNumber),
        password: String(values.nationalIdentityNumber),
        studentId: values.rollNo,
        busNo: values.busNo,
        institute: user.institute,
        fullName: values.parent,
        parentcontact: values.parentcontact,
        loginUser: "parent",
        isParent: true,
        gaurdianEmail: String(values.gaurdianEmail),
      };

      // generateQRCode(JSON.stringify(data));

      const studentCollection = collection(database, "students");

      const q = query(studentCollection, where("rollNo", "==", values.rollNo));

      const studentDoc = await getDocs(q);

      if (!studentDoc.empty) {
        if (!isUpdated) {
          setIsProcessing(false);
          return toast.error("Registeration No is already exist",{ autoClose: 1000 });
        }
      }

      let result;
      if (isUpdated === true) {
        await updateData(parentData, "parent", ...[,], parentDetail.id);
        result = await updateData(
          data,
          "students",
          values.image,
          match.params.id
        );
      } else {
        const parentCollection = collection(database, "parent");

        const q = query(
          parentCollection,
          where("institute", "==", user.institute),
          where(
            "nationalIdentityNumber",
            "==",
            String(values.nationalIdentityNumber)
          )
        );

        const parentSnapshot = await getDocs(q);

        if (values.collectFee === "collected")
          data.feeSubmittedTime = serverTimestamp();
        if (parentSnapshot.empty) await addData(parentData, "parent");
        result = await addData(data, "students", values.image);

        await updateDoc(busRef, {
          seatCapacityFilled: busData.seatCapacityFilled + 1,
        });
      }

      setIsProcessing(false);
      if (result === undefined) {
        return toast.warning("Image should be in png, jpg or jpeg format",{ autoClose: 1000 });
      }
      if (result) {
        //send email to parent

        const emailRes = await fetch("/send-email-to-parent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
           to : parentData.gaurdianEmail,
           patchMethod :isUpdated,
           data:{
            name:parentData.fullName,
            cnic:parentData.nationalIdentityNumber,
            password:parentData.password,
           }
          }),
        });

        const emailData = await emailRes.json();


        if (emailData.status === 401 || !emailData) {
          return toast.warning("Something went wrong while sending email to parent");
        }
      }
      toast.success("Data Saved Successfully",{ autoClose: 1000 });
      navigate("/admin/pdf", {
        state: {
          studentdata: {
            rollNo: values.rollNo,
            firstname: values.firstname,
            lastname: values.lastname,
            institute: user.institute,
            image: result.image,
            busNo: values.busNo,
            fatherNID: values.fatherNID,
            studentId: match.params.id,
          },
        },
      });
      resetForm();
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
      toast.error("Error Occured while saving data.",{ autoClose: 1000 });
    }
  };

  useEffect(() => {
    getBusDetails();
    getParentDetails();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <div className="admin">
        <h1>{isUpdated ? "Update" : "Add"} Student Information</h1>
        <div className="items">
          <Form
            initialValues={{
              firstname: firstname || "",
              lastname: lastname || "",
              parent: parent || "",
              parentcontact: parentcontact || "",
              country: country || "",
              city: city || "",
              address: address || "",
              postalcode: postalcode || "",
              contact: contact || "",
              busNo: busNo || "",
              image: image || null,
              class: majorOrClass || "",
              rollNo: rollNo || "",
              nationalIdentityNumber:
                parentDetail?.nationalIdentityNumber || "",
              gaurdianEmail: parentDetail?.gaurdianEmail || "",
              password: "",
              collectFee: fee || "",
            }}
            onSubmit={handleStudentInformation}
            validationSchema={validationSchema}
          >
            <h4>Personal Information</h4>
            <div className="line"></div>

            <div className="image-container image-flex-start">
              <img
                src={image ? image : require("../../assets/student-avatar.jpg")}
                className="profile-image"
                alt="profile"
              />
              <SelectImageInput name="image" classes={"w-75"} inputClasses="w-75"/>
            </div>
            <div className="line"></div>
            <div className="items-details">
              <Input
                label="First Name"
                name="firstname"
                placeholder="Enter First Name"
                type="text"
                classes={'w-75'}
                inputClasses="w-75"
              />
              <Input
                label="Last Name"
                name="lastname"
                placeholder="Enter Last Name"
                type="text"
                classes={'w-75'}
                inputClasses="w-75"
              />
            </div>
            <div className="items-details">
              <Input
                label="Father/Guardian Name"
                name="parent"
                placeholder="Enter Father/Guardian Name"
                type="text"
                classes={'w-75'}
                inputClasses="w-75"
              />
              <Input
                label="Registeration No"
                name="rollNo"
                min="0"
                type="number"
                classes={'w-75'}
                inputClasses="w-75"
              />
            </div>
            <div className="items-details">
              <Input
                label="Contact No"
                name="contact"
                type="text"
                placeholder="Enter Contact"
                classes={'w-75'}
                inputClasses="w-75"
              />
              <Input
                label="Father/Guardian No"
                name="parentcontact"
                type="text"
                placeholder="Enter Father/Guardian Contact"
                classes={'w-75'}
                inputClasses="w-75"
              />
            </div>
            <div className="items-details">
              {/* <Input
                label="National Identity Number"
                name="nationalIdentityNumber"
                type="text"
                placeholder="Enter National Id"
              /> */}
              <InputWithMask
                label="National Identity Number"
                name="nationalIdentityNumber"
                type="text"
                placeholder="Enter National Id"
                mask={"99999-9999999-9"}
                classes={'w-75'}
                inputClasses="w-75"
              />

              <Input
                label="Email"
                name="gaurdianEmail"
                type="email"
                placeholder="Enter Gaurdian Email"
                classes={'w-75'}
                inputClasses="w-75"
              />
            </div>
            <div className="line"></div>
            <h4>Physical Address</h4>
            <div className="items-details">
              <Input
                label="Country"
                name="country"
                type="text"
                placeholder="Enter Country"
                classes={'w-75'}
                inputClasses="w-75"
              />
              <Input
                label="City Name"
                name="city"
                type="text"
                placeholder="Enter City"
                classes={'w-75'}
                inputClasses="w-75"
              />
            </div>
            <div className="items-details">
              <Input
                label="Address"
                name="address"
                type="text"
                placeholder="Enter Address"
                classes={'w-75'}
                inputClasses="w-75"
              />
              <Input
                label="Postal Code"
                name="postalcode"
                type="text"
                placeholder="Enter Postal Code"
                classes={'w-75'}
                inputClasses="w-75"
              />
            </div>
            <div className="items-details">
              <Select label="Bus No" name="busNo" options={busNoList}  classes={"w-75"}
              inputClasses="w-75" />

              <Input label="Major or Class" name="class" type="text"  classes={'w-75'}
                inputClasses="w-75"/>
            </div>
            <div className="items-details">
              <Select
              classes={"w-75"}
              inputClasses="w-75"
                label="Fee Collect"
                name="collectFee"
                options={collectFee}
              />
              <div className="input-container w-75"></div>
            </div>
            {/* <a href={url} download="qrcode.png">
              Download
            </a> */}

            <SubmitButton title="SAVE STUDENT" isLoading={isProcessing} />
          </Form>
        </div>
      </div>
    </>
  );
};

export default StudentInformationForm;
