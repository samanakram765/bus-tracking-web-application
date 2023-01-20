import React, { useContext } from "react";
import { GoLocation, GoPerson } from "react-icons/go";
import { BiBusSchool } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { AiFillHome, AiFillNotification } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

import { auth, database } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

import SideItem from "../../components/SideItem";
import AuthContext from "../../context/authContext";
import useAuth from "../../context/auth/useAuth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { async } from "@firebase/util";

const Sidebar = () => {
  const [messagesNumber, setMessagesNumber] = useState(0);
  const [alertsNumber, setAlertsNumber] = useState(0);
  const [messageRead, setMessageRead] = useState();

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { user } = useAuth();
  console.log("User Sidebar :", user);

  const sidebar = [
    { id: 1, text: "Home", Icon: AiFillHome, to: "admin/home" },
    {
      id: 2,
      text: "Profile",
      Icon: CgProfile,
      to: "admin/admin_update",
      isAddId: true,
    },
    {
      id: 3,
      text: "Location",
      Icon: GoLocation,
      to: "admin/location",
      target: "_blank",
    },
    { id: 4, text: "Buses", Icon: BiBusSchool, to: "admin/bus" },
    { id: 5, text: "Drivers", Icon: GoPerson, to: "admin/driver" },
    { id: 6, text: "Students", Icon: BiBusSchool, to: "admin/student" },
    {
      id: 7,
      text: "Messages",
      Icon: FiMessageSquare,
      to: "admin/messages",
      target: "_blank",
      notifications: messagesNumber,
    },
    {
      id: 8,
      text: "Notifications",
      Icon: AiFillNotification,
      to: "admin/notifications",
      notifications: alertsNumber,
      state: { messageRead },
    },
  ];

  const getMessagesNumber = async () => {
    const messagesCollection = collection(database, "notifications");
    const q = query(
      messagesCollection,
      where("notificationReceive", "==", user.institute),
      where("receiverId", "==", user.id),
      where("messageRead", "==", false)
    );

    onSnapshot(q, (messagesSnapshot) =>
      setMessagesNumber(messagesSnapshot.size)
    );
  };

  const getAlertsNumber = async () => {
    const alertsCollection = collection(database, "notifications");
    const q = query(
      alertsCollection,
      where("institute", "==", user.institute),
      where("alert", "==", true),
      where("messageRead", "==", false)
    );

    onSnapshot(q, (alertsSnapshot) => {
      const alerts = alertsSnapshot.docs.map((alerts) => {
        setAlertsNumber(alerts.get("data").length);
        setMessageRead(alerts.id);
      });
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessagesNumber();
    getAlertsNumber();
  }, []);

  return (
    <div className="col-3 sidebar">
      <div className="image-container">
        <img
          className="profile-image"
          src={
            user.image ? user.image : require("../../assets/profile-avatar.jpg")
          }
          alt="Admin"
        />
      </div>

      <h4 className="admin-name">{`${user.firstname} ${user.lastname}`}</h4>
      <p className="admin-designation">{user.designation}</p>

      <div className="mt-2 side-items">
        <ul className="item-list">
          {sidebar.map((item) => (
            <SideItem
              key={item.id}
              Icon={item.Icon}
              to={item.isAddId ? `${item.to}/${user.id}` : item.to}
              text={item.text}
              target={item.target}
              notifications={item.notifications}
              state={item.state}
            />
          ))}
        </ul>

        <SideItem Icon={FiLogOut} handleClick={logout} text={"Logout"} />
      </div>
    </div>
  );
};

export default Sidebar;
