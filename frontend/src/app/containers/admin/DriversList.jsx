import { useNavigate } from "react-router-dom";
import ListItem from "../../components/ListItem";
import { useEffect, useState } from "react";
import { database } from "../../firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Loader from "../../components/Loader";
import useAuth from "../../context/auth/useAuth";
import useApi from "../../hooks/useApi";

const DriversList = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteDocument } = useApi();
  const { user } = useAuth();

  const getDriversInformation = () => {
    setIsLoading(true);
    const driverCollection = collection(database, "drivers");
    const q = query(driverCollection, where("institute", "==", user.institute));
    const unsubscribe = onSnapshot(q, (driverSnapshot) => {
      const driversList = driverSnapshot.docs.map((driver) => ({
        id: driver.id,
        ...driver.data(),
      }));
      setDrivers(driversList);
      setIsLoading(false);
    });
    return unsubscribe;
  };

  const handleDelete = async (id) => {
    deleteDocument("drivers", id);
  };

  useEffect(() => {
    const unsubscribe = getDriversInformation();
    return () => unsubscribe();
  }, []);

  if (isLoading) return <Loader />;

  if (drivers.length === 0)
    return (
      <>
        <h3>No Drivers Added</h3>
        <button
          className="btn btn-md btn-primary ms-0  my-3"
          onClick={() => navigate("/admin/driver_update/new")}
        >
          Add Driver
        </button>
      </>
    );

  return (
    <>
      <h1>DRIVERS LIST</h1>
      <button
        className="btn btn-md btn-primary ms-0  my-3"
        onClick={() => navigate("/admin/driver_update/new")}
      >
        Add Driver
      </button>
      <div className="items">
        <ol className="p-0">
          {drivers.map((driver) => (
            <ListItem
              id={driver.id}
              to={`/admin/driver`}
              state={{
                id: driver.id,
                driverId: driver.driverId,
                firstname: driver.firstname,
                lastname: driver.lastname,
                contact: driver.contact,
                age: driver.age,
                salary: driver.salary,
                image: driver.image,
                imageName: driver.imageName,
                country: driver.country,
                city: driver.city,
                address: driver.address,
                postalcode: driver.postalcode,
                licenseImage: driver.licenseImage,
                medicalReport: driver.medicalReport,
                busNo: driver.busNo,
                driverDutyTime: driver.driverDutyTime,
                driverDutyEnd: driver.driverDutyEnd,
                nationalIdentityNumber: driver.nationalIdentityNumber,
              }}
              title={driver.firstname}
              onDelete={handleDelete}
              onClick={() =>
                navigate("/admin/driver_update/" + driver.id, {
                  state: {
                    id: driver.id,
                    driverId: driver.driverId,
                    firstname: driver.firstname,
                    lastname: driver.lastname,
                    contact: driver.contact,
                    age: driver.age,
                    image: driver.image,
                    imageName: driver.imageName,
                    salary: driver.salary,
                    country: driver.country,
                    city: driver.city,
                    address: driver.address,
                    postalcode: driver.postalcode,
                    busNo: driver.busNo,
                    driverDutyTime: driver.driverDutyTime,
                    driverDutyEnd: driver.driverDutyEnd,
                    licenseImage: driver.licenseImage,
                    medicalReport: driver.medicalReport,
                    nationalIdentityNumber: driver.nationalIdentityNumber,
                    isUpdated: true,
                  },
                })
              }
            />
          ))}
        </ol>
      </div>
    </>
  );
};

export default DriversList;
