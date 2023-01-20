import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";

const SelectImageInput = ({ name, accept, classes, inputClasses }) => {
  const { setFieldValue, setFieldTouched, errors, values, touched } =
    useFormikContext();
  return (
    <div className={`input-container ${classes}`}>
      <input
      className={inputClasses}
        type="file"
        key={values[name] ? values[name][0]?.name : null}
        accept={accept}
        style={{ marginLeft: "10px", marginRight: "10px", height: "40px" }}
        onChange={(e) => setFieldValue(name, e.target.files)}

        // onChange={(e) => console.log("Files : ", e.target.files)}
      />
      {values[name] && <span className="ms-4">{values[name][0].name}</span>}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </div>
  );
};

export default SelectImageInput;
