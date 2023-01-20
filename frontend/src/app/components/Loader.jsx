import Lottie from "lottie-react";
import data from "../assets/loader/loader2.json";

const Loader = ({ width = "250px", height = "100vh" }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        margin: "0px auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Lottie animationData={data} loop />
    </div>
  );
};

export default Loader;
