import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/Loader";
import TableHeader from "../../components/TableHeader";
import useAuth from "../../context/auth/useAuth";
import { database } from "../../firebase/firebaseConfig";

export default function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudent, setFilteredStudent] = useState([]);
  const [sortColumn, setSortColumn] = useState({
    path: "rollNo",
    order: "asc",
  });
  const [dateFilter, setDateFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const tableHeader = [
    { id: 1, label: "#" },
    { id: 2, label: "Reg no", key: "rollNo" },
    { id: 3, label: "Student name", key: "firstname" },
    { id: 4, label: "Class", key: "class" },
    { id: 5, label: "bus No", key: "busNo" },
    { id: 6, label: "Time", key: "feeSubmittedTime" },
    { id: 7, label: "Fee", key: "collectFee" },
  ];

  const handleSort = (path) => {
    const sortColumnCopy = { ...sortColumn };
    if (path === sortColumnCopy.path) {
      sortColumnCopy.order = sortColumnCopy.order === "asc" ? "desc" : "asc";
    } else {
      sortColumnCopy.path = path;
      sortColumnCopy.order = "asc";
    }
    console.log("Sort COlumn : ", sortColumnCopy);
    setSortColumn(sortColumnCopy);
  };

  const getStudents = async () => {
    try {
      setDateFilter(false);

      const studentCollection = collection(database, "students");
      const q = query(
        studentCollection,
        where("institute", "==", user.institute)
      );

      //   const studentSnapshot = await getDocs(q);
      onSnapshot(q, (studentSnapshot) => {
        const students = studentSnapshot.docs.map((student) => ({
          id: student.id,
          ...student.data(),
        }));
        setStudents(students);
        setFilteredStudent(students);
      });

      console.log("Students fee management : ", students);
    } catch (error) {
      console.log("ERROR : ", error);
      setLoading(false);
    }
  };

  const handleCollectFee = async (student) => {
    let collectFee = "pending";
    if (student.collectFee === "pending") {
      collectFee = "collected";
    }

    const docRef = doc(database, "students", student.id);
    await updateDoc(docRef, {
      collectFee: collectFee,
      feeSubmittedTime: serverTimestamp(),
    });

    const feeCollection = collection(database, "fee");
    const alertCollection = collection(database, "alert");

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    await addDoc(feeCollection, {
      institute: user.institute,
      rollNo: student.rollNo,
      fatherNID: student.fatherNID,
      firstname: student.firstname,
      class: student.class,
      busNo: student.busNo,
      collectFee: collectFee,
      feeSubmittedTime: serverTimestamp(),
      feeMonth: month + 1,
      feeYear: year,
    });

    if (collectFee === "collected") {
      await addDoc(alertCollection, {
        busNo: student.busNo,
        description: "Your child's payment is collected",
        institute: user.institute,
        parent: true,
        title: "Fee Payment Collected",
        fatherNID: student.fatherNID,
        created_at: serverTimestamp(),
        type: "fee",
      });
    }
  };

  const searchStudent = (search) => {
    if (search) {
      setFilteredStudent(students);
      const filtered = filteredStudent.filter(
        (data) =>
          data.rollNo.toString().startsWith(search) ||
          data.firstname.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredStudent(filtered);
      console.log("Search : ", filteredStudent, search);
    } else {
      setFilteredStudent(students);
    }
  };

  const getDataFromMonth = async (e) => {
    setDateFilter(false);
    if (!e.target.value) return setFilteredStudent(students);
    const month = new Date(e.target.value).getMonth();
    const year = new Date(e.target.value).getFullYear();
    const feeCollection = collection(database, "fee");
    const q = query(
      feeCollection,
      where("feeMonth", "==", month + 1),
      where("feeYear", "==", year)
    );

    const feeSnapshot = await getDocs(q);
    const fee = feeSnapshot.docs.map((fee) => ({ id: fee.id, ...fee.data() }));
    console.log("Date changeddddd : ", fee);
    setDateFilter(true);
    setFilteredStudent(fee);
  };

  useEffect(() => {
    getStudents();
  }, []);

  if (loading) return <Loader />;

  const orderedData = _.orderBy(
    filteredStudent,
    [sortColumn.path],
    [sortColumn.order]
  );

  return (
    <>
      <h1>Fee Management</h1>
      <div class="mb-3">
        <label for="search" class="form-label">
          Search Student
        </label>
        <input
          type="search"
          class="form-control"
          id="search"
          placeholder="Search Student"
          onChange={(e) => searchStudent(e.target.value)}
        />

        <input
          placeholder="Select Date"
          type="month"
          id="exampleColorInput"
          className="mt-2 w-25"
          onChange={(e) => getDataFromMonth(e)}
        ></input>
      </div>
      <div className="items">
        <table class="table">
          <TableHeader data={tableHeader} onSort={handleSort} />
          <tbody>
            {orderedData.map((student, index) => (
              <tr key={student.id}>
                <th scope="row">{index + 1}</th>
                <td>{student.rollNo}</td>
                <td>{student.firstname}</td>
                <td>{student.class}</td>
                <td>{student.busNo}</td>
                <td>
                  {student.feeSubmittedTime
                    ? student.feeSubmittedTime.toDate().toString()
                    : "none"}
                </td>
                <td>
                  {!dateFilter ? (
                    <button
                      onClick={() => handleCollectFee(student)}
                      className="btn btn-sm btn-primary"
                    >
                      {student.collectFee}
                    </button>
                  ) : (
                    student.collectFee
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
