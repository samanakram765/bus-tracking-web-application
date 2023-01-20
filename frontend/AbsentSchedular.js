const {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} = require("firebase/firestore");

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyBRk1HgYdYzoqvjnI5aeDPCPu7nkHbqR7U",
  authDomain: "bus-tracking-app-backend.firebaseapp.com",
  projectId: "bus-tracking-app-backend",
  storageBucket: "bus-tracking-app-backend.appspot.com",
  messagingSenderId: "204843320445",
  appId: "1:204843320445:web:6b4979e74317cc1e8c5d14",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

const markAbsent = async () => {
  const studentCollection = collection(database, "students");
  const studentSnapshot = await getDocs(studentCollection);

  let InstitueStudents = [];
  studentSnapshot.forEach((doc) => {
    InstitueStudents.push(doc.data());
  });

  const driverCollection = collection(database, "drivers");

  const driverSnapshot = await getDocs(driverCollection);

  let relavantInstitueDrivers = [];
  driverSnapshot.forEach((doc) => {
    relavantInstitueDrivers.push(doc.data());
  });

  let today = new Date();
  let month = today.getMonth() + 1; // getMonth() returns a 0-based month, so we need to add 1
  let date = today.getDate();
  let year = today.getFullYear();

  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }

  let dateString = date + "/" + month + "/" + year;

  const attendanceCollection = collection(database, "attendance");
  const attendanceQuery = query(
    attendanceCollection,
    where("date", "==", dateString)
  );
  const attendance = await getDocs(attendanceQuery);

  let presentStudentRollNumbers = [];
  attendance.forEach((doc) => {
    presentStudentRollNumbers.push(doc.data().rollNo);
  });

  InstitueStudents.filter((student) => {
    if (!presentStudentRollNumbers.includes(student.rollNo)) {
      const driver = relavantInstitueDrivers.find(
        (driver) => driver.busNo == student.busNo
      );

      let absentObjectBlueprint = {
        busNo: student.busNo,
        openingTime: {
          onBoard: "0:00",
          offBoard: "0:00",
        },
        closingTime: {
          onBoard: "0:00",
          offBoard: "0:00",
        },
        driverName: `${driver.firstname} ${driver.lastname}`,
        fatherNID: student.fatherNID,
        firstname: student.firstname,
        institute: student.institute,
        lastname: student.lastname,
        rollNo: student.rollNo,
        date: dateString,
        timeAndDate: serverTimestamp(),
        month: month.replace(/^0+/, ""),
        year: year,
      };

      console.log(`absent student ${student.rollNo} `, absentObjectBlueprint);

      const abs = pushAbsentStatus(attendanceCollection, absentObjectBlueprint);
    } else {
      console.log("record found");
    }
  }, attendanceCollection);
};

const pushAbsentStatus = async (
  attendanceCollection,
  absentObjectBlueprint
) => {
  await addDoc(attendanceCollection, absentObjectBlueprint);
};

markAbsent();
