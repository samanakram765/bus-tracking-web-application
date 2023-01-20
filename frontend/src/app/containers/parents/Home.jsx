import { BiChat } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { BsFilePerson } from "react-icons/bs";

import { FaRoute } from "react-icons/fa";

import CardHeaderDetails from "../../components/Parent/CardHeaderDetails";

const cardHeader = [
  { id: 1, Icon: BsFilePerson, heading: "Bus Attendence" },
  {
    id: 2,
    Icon: FaRoute,
    heading: "View Schedule Route",
  },
  {
    id: 3,
    Icon: IoLocationSharp,
    heading: "Real-Time Location",
  },
  { id: 4, Icon: BiChat, heading: "Real-Time Chat" },
];

const features = [
  {
    id: 1,
    label: "Real Time Notifications",
    image: require("../../assets/feature-1.png"),
  },
  {
    id: 2,
    label: "View Scheduled Routes",
    image: require("../../assets/feature-2.png"),
  },
  {
    id: 3,
    label: "Bus Allocations",
    image: require("../../assets/feature-3.png"),
  },
  {
    id: 4,
    label: "Live Vehicle Tracking",
    image: require("../../assets/feature-4.png"),
  },
  {
    id: 5,
    label: "QR Code Scan",
    image: require("../../assets/feature-5-1.png"),
  },
  {
    id: 6,
    label: "Live Chat",
    image: require("../../assets/feature-6.png"),
  },
];

const users = [
  { id: 1, label: "Parents", image: require("../../assets/parent.png") },
  { id: 2, label: "Institutes", image: require("../../assets/Institute.png") },
  { id: 3, label: "Drivers", image: require("../../assets/taxi-driver.png") },
];

const Home = () => {
  return (
    <>
      <div className="slider-container">
        <div className={`slider active`}>
          <img
            src={require("../../assets/edit 2.png")}
            className="slider-image"
            alt=""
          />
          <div className="slider-text">
            <div className="left-details">
              <h1 className="heading">Bus Tracking System</h1>
              <p>Right Bus, Right Stop, Right Time</p>
            </div>
          </div>
        </div>
      </div>

      <section className="card-section">
        <section className="card">
          <div className="row card-header h-md-25 h-lg-25 h-sm-50 m-0">
            {cardHeader.map((cardDetails) => (
              <CardHeaderDetails cardDetails={cardDetails} />
            ))}
          </div>
          <div className="row h-100 m-0 overflow-hidden">
            <div className="col-md-6 col-sm-12 p-0 overflow-hidden">
              <img
                src={require("../../assets/2ND_CARD_1_1200x700.png")}
                className="w-100 h-100 m-0 card-left-image"
                alt=""
              />
            </div>
            <div className="col-md-6 col-sm-12 position-relative overflow-hidden">
              {/* <img
                src={require("../../assets/school-4.jpg")}
                className="w-100 h-100 m-0 card-right-image"
                alt=""
              /> */}
              <div className="card-image-detail p-5 py-sm-3 ">
                <h1
                  className="card-image-heading"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  Safe and Secured Institute Bus Management!
                </h1>

                <p
                  className="card-image-description"
                  data-aos="flip-right"
                  data-aos-delay="300"
                >
                  <b>Are you worried about your school going children?</b>
                  <p className="card-image-description">
                    We have the solution. Our parent app can make you feel safe
                    and happy. With our app, you can track the real-time where
                    abouts of your children, and many more.
                  </p>
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      <div className="line"></div>

      <section className="features-container">
        <h2>Our Features</h2>
        <div className="features">
          {features.map((feature) => (
            <div key={feature.id} className="feature-item">
              <img src={feature.image} alt="" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="line"></div>

      <section className="users">
        <h2>Who can use our System?</h2>
        <div className="users-container">
          {users.map((user) => (
            <div key={user.id} className="user">
              <img src={user.image} alt="" />
              <span>{user.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
