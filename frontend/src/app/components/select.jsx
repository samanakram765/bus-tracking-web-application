import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";

const Select = ({ name, label, options, classes, inputClasses }) => {
  const { errors, handleChange, touched, setFieldTouched, values } =
    useFormikContext();

  return (
    <div className={`input-container ${classes}`}>
      <label className="label">{label}</label>
      <select
      className={inputClasses}
        name={name}
        onChange={handleChange(name)}
        value={values[name]}
        onBlur={() => setFieldTouched(name)}>
        <option value="Select State" />
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </div>
  );
};

export default Select;
