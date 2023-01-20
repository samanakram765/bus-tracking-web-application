import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { format } from "timeago.js";
import useParentAuth from "../../context/auth/useParentAuth";
import { getDrivers } from "../../firebase/firebaseCalls/chat";
import { database } from "../../firebase/firebaseConfig";

export default function ParentNotifications() {
  const [alerts, setAlerts] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const { parent } = useParentAuth();

  const getInstituteDrivers = async () => {
    const drivers = await getDrivers(parent);

    setDrivers(drivers);
  };

  const getAlerts = async () => {
    const alertCollection = collection(database, "alert");
    const q = query(
      alertCollection,
      where("institute", "==", parent.institute),
      where("parent", "==", true),
      where("busNo", "==", parent.busNo),
      orderBy("created_at", "desc")
    );

    onSnapshot(q, (alertSnapshot) => {
      const alerts = alertSnapshot.docs.map((alert) => ({
        id: alert.id,
        ...alert.data(),
      }));

      setAlerts(alerts);
    });
  };

  useEffect(() => {
    getInstituteDrivers();
    getAlerts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Notifications</h1>
      <div className="parent_notification-container">
        {alerts.map((alert) => {
          let image = require("../../assets/profile-avatar.jpg");
          drivers.forEach((driver) => {
            if (driver.busNo === alert.busNo) image = driver.image;
          });

          console.log("ALertssss : ", alert);
          if (alert.type){
          if(alert.type === "fee" && alert.fatherNID === parent.nationalIdentityNumber){
            return (
              <>
                <div className="parent_notification">
                  <div className="d-flex">
                    <img src={image} className="profile-image" />
                    <div className="notification-details">
                      <span>{alert.title}</span>
                      <p>{alert.description}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    <span>BY Admin</span>
                    <span>{format(alert.created_at.toDate())}</span>
                  </div>
                </div>
              </>
            );
          }else{
            return null
          }
           }
          return (
            <>
              <div className="parent_notification">
                <div className="d-flex">
                  <img src={image} className="profile-image" />
                  <div className="notification-details">
                    <span>{alert.title}</span>
                    <p>{alert.description}</p>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span>BY Bus No {alert.busNo}</span>
                  <span>{format(alert.created_at.toDate())}</span>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
