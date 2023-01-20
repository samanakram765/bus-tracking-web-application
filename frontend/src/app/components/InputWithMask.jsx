import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import InputMask from "react-input-mask";

const InputWithMask = ({
  label,
  placeholder,
  width = 50,
  classes,
  type,
  inputClasses,
  name,
  mask,
  ...otherProps
}) => {
  const { errors, handleChange, setFieldTouched, touched, values } =
    useFormikContext();

  return (
    <div className={`input-container ${classes}`}>
      <label htmlFor="" className="label">
        {label}
      </label>
      <InputMask
        mask={mask}
        className={inputClasses}
        type={type}
        value={values[name]}
        onBlur={() => setFieldTouched(name)}
        onChange={handleChange(name)}
        placeholder={placeholder}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </div>
  );
};

export default InputWithMask;
