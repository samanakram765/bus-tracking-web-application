const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");

// send mail
router.post("/send-email-to-parent", (req, res) => {
  const data = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let subject = "Your information has been registered successfully.";
    if (data.patchMethod) {
      subject = "Your information has been updated successfully";
    }
    let htmlContent = `<h2>Hi ${data.data?.name}, ${subject} </h2>
    <h4> Please login with given below credentials </h4>
    <p>CINC : ${data.data?.cnic}</p>
    <p>Password : ${data.data?.password}</p>
    <p>Institue : ${data.data?.institute}</p>
    `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: data.to,
      subject: subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error" + error);
      } else {
        console.log("Email sent:" + info.response);
        res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    console.log("Error" + error);
    res.status(401).json({ status: 401, error });
  }
});

router.post("/send-alert-email-to-parent", (req, res) => {
  const data = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let subject = `Alert! ${data.data?.title}`;

    let htmlContent = `<h2>Hi ${data.data?.name}, ${subject} </h2>

    <p> ${data.data?.description}</p>

    <p> Time: ${data.data?.time}</p>

    `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: data.to,
      subject: subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error" + error);
      } else {
        console.log("Email sent:" + info.response);
        res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    console.log("Error" + error);
    res.status(401).json({ status: 401, error });
  }
});

module.exports = router;
