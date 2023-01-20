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
import { orderBy } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/Loader";
import TableHeader from "../../components/TableHeader";
import useAuth from "../../context/auth/useAuth";
import useParentAuth from "../../context/auth/useParentAuth";
import { database } from "../../firebase/firebaseConfig";

export default function AttendanceRecord() {
  const { parent } = useParentAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudent, setFilteredStudent] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [sortColumn, setSortColumn] = useState({
    path: "rollNo",
    order: "asc",
  });
  const [loading, setLoading] = useState(false);

  const tableHeader1 = [
    { id: 1, label: "#" },
    { id: 2, label: "Reg no", key: "rollNo" },
    { id: 3, label: "Student name", key: "firstname" },
    { id: 4, label: "Driver Name", key: "driverName" },
    { id: 5, label: "bus No", key: "busNo" },
    { id: 6, label: "Date", key: "date" },
    {
      id: 7,
      label: "School Opening(On/Off) Board",
      key: "openingTime.onBoard",
    },
    {
      id: 7,
      label: "School Closing(On/Off) Board",
      key: "closingTime.offBoard",
    },
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

  const getAllDrivers = async () => {
    const driverCollection = collection(database, "drivers");

    const q = query(
      driverCollection,
      where("institute", "==", parent.institute)
    );

    const driverSnapshot = await getDocs(q);
    const drivers = driverSnapshot.docs.map((drivers) => ({
      id: drivers.id,
      ...drivers.data(),
    }));
    setDrivers(drivers);
  };

  const getStudents = async () => {
    try {
      await getAllDrivers();
      const studentCollection = collection(database, "attendance");
      const q = query(
        studentCollection,
        where("institute", "==", parent.institute),
        where("fatherNID", "==", parent.nationalIdentityNumber)
      );

      const studentSnapshot = await getDocs(q);

      const students = studentSnapshot.docs.map((student) => ({
        id: student.id,
        ...student.data(),
      }));
      setStudents(students);
      setFilteredStudent(students);
      console.log("Students fee management : ", students);
    } catch (error) {
      console.log("ERROR : ", error);
      setLoading(false);
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
    const attendanceCollection = collection(database, "attendance");
    const q = query(
      attendanceCollection,
      where("institute", "==", parent.institute),
      where("fatherNID", "==", parent.nationalIdentityNumber),
      where("month", "==", String(month + 1)),
      where("year", "==", year)
    );

    const attendanceSnapshot = await getDocs(q);
    const attendance = attendanceSnapshot.docs.map((attendance) => ({
      id: attendance.id,
      ...attendance.data(),
    }));

    console.log("Attendance : ", attendance);
    setDateFilter(true);
    setFilteredStudent(attendance);
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
    <div className="p-4">
      <h1>Attendance Record</h1>
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
          <TableHeader data={tableHeader1} onSort={handleSort} />

          <tbody>
            {orderedData.map((student, index) => {
              console.log("Student : ", student);
              let driverName = "";
              drivers.forEach((driver) =>
                driver.busNo === student.busNo
                  ? (driverName = driver.firstname)
                  : ""
              );
              return (
                <tr key={student.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{student.rollNo}</td>
                  <td>{student.firstname}</td>
                  <td>{student?.driverName}</td>
                  <td>{student.busNo}</td>
                  <td>{student.date || "none"}</td>
                  <td>
                    {student?.openingTime?.onBoard.includes("0:00")
                      ? "A"
                      : `${student?.openingTime?.onBoard || "none"} - ${
                          student?.openingTime?.offBoard || "none"
                        }`}
                  </td>
                  <td>
                    {student?.openingTime?.onBoard.includes("0:00")
                      ? "A"
                      : `${student?.closingTime?.onBoard || "none"} - ${
                          student?.closingTime?.offBoard || "none"
                        }`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
