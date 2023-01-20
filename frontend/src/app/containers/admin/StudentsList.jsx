import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";

import ListItem from "../../components/ListItem";
import useAuth from "./../../context/auth/useAuth";
import Loader from "../../components/Loader";
import useSearch from "./../../hooks/useSearch";
import useApi from "../../hooks/useApi";

const StudentsList = () => {
  const navigation = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { filterData, filteredData, setFilteredData } = useSearch(students);
  const { deleteDocument } = useApi();
  const { user } = useAuth();

  const getStudentsInformation = () => {
    setIsLoading(true);
    const studentCollection = collection(database, "students");

    const q = query(
      studentCollection,
      where("institute", "==", user.institute)
    );

    const unsubscribe = onSnapshot(q, (studentSnapshot) => {
      const studentsList = studentSnapshot.docs.map((student) => ({
        id: student.id,
        ...student.data(),
      }));
      setStudents(studentsList);
      setFilteredData(studentsList);
      setIsLoading(false);
    });

    return unsubscribe;
  };

  console.log("Student list : ", students);
  const handleDelete = async (student) => {
    deleteDocument("students", student.id);
    const parentCollection = collection(database, "parent");
    const q = query(
      parentCollection,
      where("institute", "==", user.institute),
      where("studentId", "==", student.rollNo)
    );

    const list = students.filter(
      (stud) => stud.fatherNID === student.fatherNID
    );

    if (list.length === 1) {
      const parentSnapshot = await getDocs(q);
      const parent = parentSnapshot.docs.map((parent) => ({ id: parent.id }));
      deleteDocument("parent", parent[0].id);
    }
    console.log("Deleting Bus : ", student);

    const busCollection = collection(database, "bus");
    const q1 = query(
      busCollection,
      where("institute", "==", student.institute),
      where("busNo", "==", student.busNo)
    );

    const busSnapshot = await getDocs(q1);

    const bus = busSnapshot.docs.map((bus) => ({ id: bus.id, ...bus.data() }));

    console.log("Deleting Bus : ", bus);
    const busDoc = doc(database, "bus", bus[0].id);

    await updateDoc(busDoc, {
      seatCapacityFilled: bus[0].seatCapacityFilled - 1,
    });
  };

  useEffect(() => {
    const unsubscribe = getStudentsInformation();
    return () => unsubscribe();
  }, []);

  const handleSearch = (search) => {
    filterData(search);
  };

  if (isLoading) return <Loader />;

  if (students.length === 0)
    return (
      <>
        <h3>No Students Added</h3>
        <button
          className="btn btn-md btn-primary m-0"
          onClick={() => navigation("/admin/student_update/new")}
        >
          Add Students
        </button>
      </>
    );

  return (
    <>
      <h1>Students List</h1>
      <div class="mb-3">
        <label for="search" class="form-label">
          Search Student
        </label>
        <input
          type="search"
          class="form-control"
          id="search"
          placeholder="Search Student"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <button
        className="btn btn-md btn-primary m-0"
        onClick={() =>
          navigation("/admin/student_update/new", {
            state: {
              busSeatCapacity: students.length,
            },
          })
        }
      >
        Add Students
      </button>
      <div className="items">
        <ol className="ps-0">
          {filteredData.map((student) => (
            <ListItem
              id={student.id}
              to={`/admin/student`}
              onAndOffBoard={true}
              onAndOffBoardStatus={student.onAndOffBoard}
              state={{
                id: student.id,
                rollNo: student.rollNo,
                firstname: student.firstname,
                lastname: student.lastname,
                parent: student.parent,
                institute: student.institute,
                parentcontact: student.parentcontact,
                country: student.country,
                city: student.city,
                address: student.address,
                postalcode: student.postalcode,
                contact: student.contact,
                busNo: student.busNo,
                imageName: student.imageName,
                image: student.image,
                class: student.class,
                fatherNID: student.fatherNID,
                collectFee: student.collectFee,
              }}
              title={`${student.firstname} ${student.lastname}`}
              onDelete={() => handleDelete(student)}
              onGenerateCard={() =>
                navigate("/admin/pdf", {
                  state: {
                    studentdata: {
                      rollNo: student.rollNo,
                      firstname: student.firstname,
                      lastname: student.lastname,
                      institute: user.institute,
                      image: student.image,
                      busNo: student.busNo,
                      studentId: student.id,
                      fatherNID: student.fatherNID,
                    },
                  },
                })
              }
              onClick={() =>
                navigation("/admin/student_update/" + student.id, {
                  state: {
                    rollNo: student.rollNo,
                    firstname: student.firstname,
                    lastname: student.lastname,
                    parent: student.parent,
                    institute: student.institute,
                    parentcontact: student.parentcontact,
                    country: student.country,
                    city: student.city,
                    address: student.address,
                    postalcode: student.postalcode,
                    contact: student.contact,
                    busNo: student.busNo,
                    imageName: student.imageName,
                    image: student.image,
                    class: student.class,
                    isUpdated: true,
                    fatherNID: student.fatherNID,
                    collectFee: student.collectFee,
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

export default StudentsList;
