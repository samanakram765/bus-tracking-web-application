import { useFormikContext } from "formik";
import { BarLoader } from "react-spinners";

const SubmitButton = ({ title, isLoading, isParentButton, disabled }) => {
  const { handleSubmit } = useFormikContext();

  if (isLoading)
    return (
      <div
        className={isParentButton ? "button" : "btn btn-md btn-primary button"}
        style={{
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <BarLoader loading={isLoading} color="#fff" />
      </div>
    );

  return (
    <button
      disabled={disabled}
      className={isParentButton ? "button" : "btn btn-md btn-primary button"}
      onClick={handleSubmit}>
      {title}
    </button>
  );
};

export default SubmitButton;
