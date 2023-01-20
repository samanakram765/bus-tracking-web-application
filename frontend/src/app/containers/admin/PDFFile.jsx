import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useLocation } from "react-router-dom";
import { PdfExport, useGeneratePdf } from "@garage-panda/react-pdf-export";
import { getSpecificStudent } from "../../firebase/firebaseCalls/get";

import { useRef } from "react";
import useApi from "../../hooks/useApi";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import { async } from "@firebase/util";

function PDFFile() {
  const location = useLocation();
  const { generatePdf, containerRef } = useGeneratePdf();
  const { firstname, lastname, image, rollNo, institute, studentId } =
    location?.state?.studentdata || {};
  const cardRef = useRef();
  const [url, setUrl] = useState("");
  const [studentData, setStudentData] = useState({});

  console.log(location);

  const getStudent = async () => {
    const studentRef = collection(database, "students");
    const q = query(
      studentRef,
      where("rollNo", "==", rollNo),
      where("institute", "==", institute)
    );

    const studentSnapshot = await getDocs(q);
    let students = studentSnapshot.docs.map((student) => ({
      id: student.id,
      ...student.data(),
    }));

    const data = {
      firstname: students[0].firstname,
      lastname: students[0].lastname,
      image: students[0].image,
      rollNo: students[0].rollNo,
      institute: students[0].institute,
      studentId: students[0].id,
      fatherNID: students[0].fatherNID,
      busNo: students[0].busNo,
    };

    setStudentData(data);
    console.log("Passed 1");
    if (students.length > 0) {
      console.log("Passed 1");
      generateQRCode(data);
    }
  };

  const generateQRCode = (data) => {
    console.log("Passed 2");
    QRCode.toDataURL(JSON.stringify(data), (err, url) => {
      if (err) return console.log("ERROR URL : ", err);
      console.log("Passed 3");
      setUrl(url);
    });
  };

  useEffect(() => {
    getStudent();
  }, []);

  return (
    <>
      {url && (
        <PdfExport className="pdf" containerRef={containerRef}>
          <div
            ref={cardRef}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginInline: 40,
            }}
          >
            <div>
              <img
                src={studentData.image}
                style={{ width: 100, height: 100, marginRight: 20 }}
              />
            </div>
            <div style={{ flexDirection: "row" }}>
              <div style={{ flexDirection: "row" }}>
                <label className="label">Student Name: </label>
                <span
                  style={{ marginLeft: 10 }}
                >{`${studentData.firstname} ${studentData.lastname}`}</span>
              </div>
              <div style={{ flexDirection: "row" }}>
                <label className="label">Roll No: </label>
                <span style={{ marginLeft: 10 }}>{studentData.rollNo}</span>
              </div>

              <div style={{ flexDirection: "row" }}>
                <label className="label">Institute Name: </label>
                <span style={{ marginLeft: 10 }}>
                  {studentData.institute.split(" ").length > 3
                    ? studentData.institute.split(" ").slice(0, 2).join(" ")
                    : studentData.institute}
                </span>
              </div>
            </div>
            <div>
              <img src={url} style={{ width: 150, height: 150 }} />
            </div>
          </div>
        </PdfExport>
      )}
      {url && (
        <button className="btn btn-md btn-primary button" onClick={generatePdf}>
          Download PDF
        </button>
      )}
    </>
  );
}

export default PDFFile;
