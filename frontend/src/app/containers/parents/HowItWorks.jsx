import React from "react";

const steps = [
  {
    id: 1,
    description: "Institute Admin will Register their account.",
    image: require("../../assets/working-1.png"),
  },
  {
    id: 2,
    description: "Setting up user profiles, vehicles,routes, students etc",
    image: require("../../assets/working-2.jpg"),
  },
  {
    id: 3,
    description:
      "Sharing user credential and mobile app link to parents and driver",
    image: require("../../assets/working-3.png"),
  },
  {
    id: 4,
    description:
      "Driver can see the list of students, and can do live chat with the admin.",
    image: require("../../assets/working-4.png"),
  },
  {
    id: 5,
    description:
      "Mobile app will show the route, bus stops, students, etc in their mobile",
    image: require("../../assets/working-5.png"),
  },
  {
    id: 6,
    description: "Students can mark their attendance by scanning QR",
    image: require("../../assets/working-6-1.png"),
  },
  {
    id: 7,
    description:
      "Parents will get notification about the real-time location of the vehicle in their mobile",
    image: require("../../assets/working-7.gif"),
  },
];

const HowItWorks = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="how-it-works-hero">
        <div className="how-it-works-text-container">
          <div className="text">
            <span className="heading">How Bus Tracking System Works?</span>
            <p className="description">
              Bus Tracking System is a solution to parents, Driver and Institute
              authorities to create a safe and efficient school bus management.
              We provide GPS tracking solutions to ensure student safety to and
              from their schools. Trackschoolbus provides real-time location of
              the Institute bus to parents and Institute authorities. Our
              software helps the transport manager to maintain school bus fleet
              efficiently.
            </p>
          </div>
        </div>
        <div className="how-it-works-image-container">
          <div className="how-it-works-image">
            <img
              src={require("../../assets/school-tracking-feat.png")}
              alt=""
            />
          </div>
        </div>
      </section>

      {/* How Our System Works */}
      <section className="working-container">
        <h2>How Our System Works?</h2>
        <div className="working-items">
          {steps.map((step, index) => (
            <div className="item">
              <div className="image-container">
                <img src={step.image} className="image" alt="" />
                <span>STEP {index + 1}</span>
              </div>
              <div className="description">
                <span>{step.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
