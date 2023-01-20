import React, { useState } from "react";
import * as Yup from "yup";

import Form from "../../components/Form";
import Input from "../../components/Input";
import SubmitButton from "../../components/SubmitButton";

const validationSchema = Yup.object().shape({
  nationalIdentityNumber: Yup.number(
    "National Identity Number should be a number"
  )
    .required()
    .label("National Identity Card."),
  password: Yup.string().required().label("Password"),
});

function ParentInformationForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const handleStudentInformation = () => {};

  return (
    <>
      <div className="admin">
        {/* <h1>{isUpdated ? "Update" : "Add"} Student Information</h1> */}
        <div className="items">
          <Form
            initialValues={{
              nationalIdentityNumber: "",
              password: "",
            }}
            onSubmit={handleStudentInformation}
            validationSchema={validationSchema}
          >
            <h4>Create Parent Login</h4>
            <div className="line"></div>

            <div className="items-details">
              <Input
                label="National Identity Number"
                name="nationalIdentityNumber"
                type="number"
              />
              <Input label="Password" name="password" type="text" />
            </div>
            <SubmitButton title="SAVE STUDENT" isLoading={isProcessing} />
          </Form>
        </div>
      </div>
    </>
  );
}

export default ParentInformationForm;
