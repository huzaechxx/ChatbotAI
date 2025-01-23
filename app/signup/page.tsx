import React from "react";
import SignupForm from "./signupform";
import styles from "./signup.module.css";

const SignupPage = () => {
  return (
    <div className="max-w-[400px] mx-auto text-center mt-32">
      <div>
        <h1 style={{ fontSize: 110 }}>Sign Up</h1>
      </div>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
