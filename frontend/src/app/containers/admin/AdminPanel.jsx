import { Routes, Route, Navigate } from "react-router-dom";
import DriversList from "./DriversList";
import BusLists from "./BusLists";
import DriverDetails from "./DriverDetails";
import BusDetails from "./BusDetails";
import UpdateAdminInfo from "./UpdateAdminInfo";
import StudentsList from "./StudentsList";
import StudentDetails from "./StudentDetails";
import Admin from "./Admin";
import BusInformationForm from "./BusInformationForm";
import DriverInformationForm from "./DriverInformationForm";
import StudentInformationForm from "./StudentInformationForm";
import PDFFile from "./PDFFile";
import AdminNotifications from "./AdminNotifications";
import FeeManagement from "./FeeManagement";
import OpeningAndClosingTime from "./OpeningAndClosingTime";
import AttendanceRecord from "./AttendanceRecord";

const AdminPanel = () => {
  return (
    <div className="col-9">
      <div className="admin">
        <>
          <Routes>
            <Route path="/home" element={<Admin />} />
            <Route path="/admin_update/:id" element={<UpdateAdminInfo />} />
            <Route
              path="/student_update/:id"
              element={<StudentInformationForm />}
            />
            <Route path="/student/:id" element={<StudentDetails />} />
            <Route path="/student" element={<StudentsList />} />
            <Route
              path="/driver_update/:id"
              element={<DriverInformationForm />}
            />
            <Route path="/driver/:id" element={<DriverDetails />} />
            <Route path="/driver" element={<DriversList />} />
            <Route path="/bus_update/:id" element={<BusInformationForm />} />
            <Route path="/bus/:id" element={<BusDetails />} />
            <Route path="/bus" element={<BusLists />} />
            <Route path="/fee" element={<FeeManagement />} />

            <Route path="/pdf" element={<PDFFile />} />

            <Route path="/notifications" element={<AdminNotifications />} />
            {/* <Route path="/location" element={<Location />} /> */}
          </Routes>
        </>
      </div>
    </div>
  );
};

export default AdminPanel;
