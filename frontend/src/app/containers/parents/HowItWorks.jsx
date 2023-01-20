import React from "react";

const steps = [
  {
    id: 1,
    description: "Institute Admin will Login to their account.",
    image: require("../../assets/working-1.png"),
  },
  {
    id: 2,
    description: "Setting up user profiles,vehicles,routes,students etc.",
    image: require("../../assets/working-2.jpg"),
  },
  {
    id: 3,
    description:
      "Sharing user credential and mobile app link to parents and drivers.",
    image: require("../../assets/working-3.png"),
  },
  {
    id: 4,
    description:
      "Driver can see the list of students, and can perform many tasks.",
    image: require("../../assets/working-4.png"),
  },
  {
    id: 5,
    description:
      "Mobile app will show the routes, chats, and related information etc in their mobile",
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
      "Parents will get real-time notifications and track vehicle in their mobile",
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
              authorities to create a safe and efficient institute bus management.
              We provide GPS tracking solutions to ensure student safety to and
              from their schools. This system provides real-time location of
              the Institute bus to parents and Institute authorities. Our
              software helps the transport manager to maintain institute bus fleet
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
