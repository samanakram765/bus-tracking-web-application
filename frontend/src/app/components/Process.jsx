import { ClipLoader } from "react-spinners";
const Process = () => {
  return (
    <div
      style={{
        width: "140vh",
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader color="rgb(121, 95, 205)" size={70} />
    </div>
  );
};

export default Process;
