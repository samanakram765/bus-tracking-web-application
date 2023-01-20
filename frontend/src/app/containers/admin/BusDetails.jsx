import Detail from "./../../components/Detail";
import { useLocation, useNavigate } from "react-router-dom";

const BusDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    id,
    busNo,
    licenseNo,
    image,
    routes,
    // maintainance,
    seatCapacity,
    seatCapacityFilled,
  } = location.state;

  return (
    <>
      <h1>Bus Details</h1>
      <div className="items">
        <h4>Bus Information</h4>
        <div className="items-details">
          <div>
            <Detail label="Bus Number" detail={busNo} />
          </div>
          <div className="right-item">
            <Detail label="License Number" detail={licenseNo} />
          </div>
        </div>
        <div className="line"></div>

        <div className="items-details">
          <div className="input-container">
            <label className="label">License Picture</label>
            <img
              src={image ? image : require("../../assets/driver-avatar.png")}
              className="square-image"
              alt="license"
            />
          </div>
        </div>
        <div className="line"></div>
        <h3>Routes</h3>

        <div className="items-details" style={{ flexDirection: "column" }}>
          {routes.map((route) => (
            <div className="input-container" style={{ flexDirection: "row" }}>
              <Detail label="Latitude" detail={route.latitude} />
              <Detail
                label="Longitude"
                detail={route.longitude}
                margin="0 25px"
              />
            </div>
          ))}
        </div>
        <div className="line"></div>

        <div className="items-details">
          {/* <Detail label="Maintainance" detail={maintainance} /> */}
          <Detail label="Seat Capacity" detail={seatCapacity} />
          <div className="right-item">
            <Detail
              label="Seats Remaining"
              detail={seatCapacity - seatCapacityFilled}
            />
          </div>
          {/* <div className="right-item">
          </div> */}
        </div>

        <button
          className="btn btn-md btn-primary button"
          onClick={() =>
            navigate("/admin/bus_update/" + id, {
              state: {
                ...location.state,
                isUpdated: true,
              },
            })
          }
        >
          Update Bus
        </button>
      </div>
    </>
  );
};

export default BusDetails;
