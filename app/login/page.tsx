import React from "react";
import styles from "./signup.module.css";
import LoginForm from "./loginform";

const LoginPage = () => {
  return (
    <div className="max-w-[400px] mx-auto text-center mt-40">
      <div>
        <h1 style={{ fontSize: 110 }}>LOG IN</h1>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
