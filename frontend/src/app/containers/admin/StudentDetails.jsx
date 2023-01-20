import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Detail from "../../components/Detail";
import Loader from "../../components/Loader";
import { database } from "../../firebase/firebaseConfig";

const StudentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parentDetail, setParentDetail] = useState({});
  const {
    id,
    rollNo,
    firstname,
    lastname,
    parent,
    institute,
    parentcontact,
    country,
    city,
    address,
    postalcode,
    contact,
    busNo,
    class: majorOrClass,
    image,
    fatherNID,
    nationalIdentityNumber,
  } = location.state || {};

  const getParentDetails = async () => {
    if (!rollNo) return;
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

  useEffect(() => {
    getParentDetails();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <h1>Student Details</h1>
      <div className="items">
        <div className="image-container">
          <img
            src={image ? image : require("../../assets/student-avatar.jpg")}
            alt="student"
            className="profile-image"
          />
        </div>

        <h4>Personal Information</h4>
        <div className="line"></div>
        <div className="items-details">
          <div>
            <Detail label="Full Name" detail={`${firstname} ${lastname}`} />
          </div>
          <div className="right-item">
            <Detail label="Father/Guardian" detail={parent} />
          </div>
        </div>

        <div className="items-details">
          <div>
            <Detail label="contact no" detail={contact} />
          </div>
          <div className="right-item">
            <Detail label="Father/Guardian no" detail={parentcontact} />
          </div>
        </div>

        <div className="items-details">
          <div>
            <Detail label="College/University" detail={institute} />
          </div>
          <div className="right-item">
            <Detail label="Registeration Number" detail={rollNo} />
          </div>
        </div>

        <div className="items-details">
          <div>
            <Detail
              label="National Identity Number"
              detail={parentDetail?.nationalIdentityNumber}
            />
          </div>
        </div>

        <h4>Physical Address</h4>
        <div className="line"></div>
        <div className="items-details">
          <div>
            <Detail label="Country" detail={country} />
          </div>
          <div className="right-item">
            <Detail label="City" detail={city} />
          </div>
        </div>

        <div className="items-details">
          <div>
            <Detail label="Postal Code" detail={postalcode} />
          </div>
          <div className="right-item">
            <Detail label="Address" detail={address} />
          </div>
        </div>
        <div className="items-details">
          <div>
            <Detail label="Bus No" detail={busNo} />
          </div>
          <div className="right-item">
            <Detail label="Major or Class" detail={majorOrClass} />
          </div>
        </div>

        <button
          className="btn btn-primary btn-md button"
          onClick={() =>
            navigate("/admin/student_update/" + id, {
              state: {
                ...location.state,
                isUpdated: true,
              },
            })
          }
        >
          Update Student
        </button>
      </div>
    </>
  );
};

export default StudentDetails;
