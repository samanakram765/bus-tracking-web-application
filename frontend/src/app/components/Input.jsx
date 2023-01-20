import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";

const Input = ({
  label,
  placeholder,
  width = 50,
  classes,
  type,
  inputClasses,
  name,
  isFieldTouch = true,
  ...otherProps
}) => {
  const { errors, handleChange, setFieldTouched, touched, values } =
    useFormikContext();

  return (
    <div className={`input-container ${classes}`}>
      <label htmlFor="" className="label">
        {label}
      </label>
      <input
        className={inputClasses}
        type={type}
        value={values[name]}
        onBlur={() => isFieldTouch && setFieldTouched(name)}
        onChange={handleChange(name)}
        placeholder={placeholder}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </div>
  );
};

export default Input;
