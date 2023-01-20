import { useState } from "react";
import { useFormikContext } from "formik";

const MultipleInputs = ({ inputs, setInputs }) => {
  const { values, setFieldValue } = useFormikContext();

  const handleAddRoutesInput = () => {
    const list = [...values["routesList"], { latitude: "", longitude: "" }];
    setInputs(list);
  };

  const handleRemoveRoutesInput = (index) => {
    const list = [...values["routesList"]];
    list.splice(index, 1);
    values["routesList"].splice(index, 1);
    setInputs(list);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputs];
    list[index][name] = value;
    setFieldValue("routesList", list);
  };
  console.log("Inputs : ", inputs);

  return (
    <>
      {inputs.map((routes, index) => (
        <>
          {}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Latitude"
              name={`latitude`}
              value={routes.latitude}
              // onBlur={() => setFieldTouched("routesList")}
              style={{ width: 200, marginRight: 5, padding: 7 }}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="text"
              placeholder="Longitude"
              value={routes.longitude}
              name={`longitude`}
              style={{ width: 200, padding: 7 }}
              // onBlur={() => setFieldTouched("routesList")}
              onChange={(e) => handleChange(e, index)}
            />
            <button
              className="btn btn-danger btn-md"
              onClick={() => handleRemoveRoutesInput(index)}
              disabled={inputs.length >= 2 ? false : true}
            >
              Remove
            </button>
          </div>
        </>
      ))}
      <button
        className="btn btn-secondary btn-md m-0 mt-2"
        onClick={handleAddRoutesInput}
      >
        Add More Routes
      </button>
    </>
  );
};

export default MultipleInputs;
