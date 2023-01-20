import React from "react";
import {
  AiFillLinkedin,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineWhatsApp,
  AiFillMail, 
  AiFillPhone,
} from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import useParentAuth from "../../context/auth/useParentAuth";

const Footer = () => {
  const navigate = useNavigate();
  const { parent } = useParentAuth();

  return (
    <footer className="footer">
      <section className="first-footer-section">
        <div className="information" data-aos="fade-right">
          <h2>Bus Tracking App</h2>
          <p>Bus Tracking System is an easy-to-use <br />
           website and app that enables parents to <br /> 
           see the location of their child’s institute <br /> 
           bus on a smartphone, tablet, or personal <br /> computer.</p>
          {/* <p>0404500415</p>
          <p>bustrackingsystem9@gmail.com</p> */}
        </div>

        <div className="authentication" data-aos="fade-left">
          {!parent && (
            <>
              <h4 className="mb-4">Contact US</h4>
              <p><AiFillPhone className="icon ml-4" />&nbsp;0404500415</p>
              <p><AiFillMail className="icon ml-4" />&nbsp;bustrackingsystem9@gmail.com</p>
              {/* <button className="button m-2" onClick={() => navigate("/Login")}>
                Login
              </button> */}
            </>
          )}
        </div>
      </section>
      <section className="second-footer-section">
        <div>
          <span className="copyright-text">
            Copyright All Right Reserved 2022, Bus Tracking System
          </span>
        </div>
        <div className="footer-icons">
          <AiOutlineFacebook className="icon" />
          <AiOutlineInstagram className="icon" />
          <AiOutlineWhatsApp className="icon" />
          <AiOutlineTwitter className="icon" />
          <AiFillLinkedin className="icon" />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
