import DatalistInput from "react-datalist-input";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";

const Datalist = ({ name, options, width = 350, classes, label }) => {
  const { setFieldValue, touched, setFieldTouched, errors } =
    useFormikContext();

  return (
    <div className={`input-container ${classes}`}>
      <DatalistInput
        items={options}
        style={{ width: width, color: "#aaabad" }}
        label={label}
        onBlur={() => setFieldTouched(name)}
        onSelect={(item) => setFieldValue(name, item.value)}
        onChange={(e) => setFieldValue(name, e.target.value)}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </div>
  );
};

export default Datalist;
