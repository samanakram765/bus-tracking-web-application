import { database } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getInstitutes = async () => {
  const instituteRef = collection(database, "institute");

  const instituteSnapshot = await getDocs(instituteRef);
  let institutes = instituteSnapshot.docs.map((institute) => ({
    id: institute.get("institute"),
    value: institute.get("institute"),
  }));

  institutes = institutes.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

  return institutes;
};

export const getSpecificStudent = async (parent) => {
  const studentRef = collection(database, "students");
  const q = query(
    studentRef,
    where("fatherNID", "==", parent.nationalIdentityNumber)
  );

  const studentSnapshot = await getDocs(q);
  let students = studentSnapshot.docs.map((student) => ({
    id: student.id,
    ...student.data(),
  }));

  console.log("Students : ", students);
  return students;
};

export const getSpecificBus = async (busNo, institute) => {
  const busRef = collection(database, "bus");
  const q = query(
    busRef,
    where("busNo", "==", busNo),
    where("institute", "==", institute)
  );

  const busSnapshot = await getDocs(q);
  let bus = busSnapshot.docs.map((bus) => ({
    id: bus.id,
    ...bus.data(),
  }));

  return bus;
};

export const getStudentCount = async (user) => {
  const studentCollection = collection(database, "students");
  const q = query(studentCollection, where("institute", "==", user.institute));
  const studentDoc = await getDocs(q);
  return studentDoc.size;
};

export const getDriverCount = async (user) => {
  const driverCollection = collection(database, "drivers");
  const q = query(driverCollection, where("institute", "==", user.institute));
  const driverDoc = await getDocs(q);
  return driverDoc.size;
};

export const getBusCount = async (user) => {
  const busCollection = collection(database, "bus");
  const q = query(busCollection, where("institute", "==", user.institute));
  const busDoc = await getDocs(q);
  return busDoc.size;
};
