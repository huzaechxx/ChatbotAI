"use client";

import React, { useState } from "react";
import styles from "./signup.module.css";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill out all fields");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Signup failed. Please try again.");
      }
      const data = await response.json();

      // Assuming the response contains a token
      if (data.token) {
        localStorage.setItem("token", data.token); // Store token in localStorage
        localStorage.setItem("currentuser", data.currentuser);
      }
      setTimeout(() => {
        router.push("/chat");
      }, 2000);
      setSuccess("Signup successful! You can now log in.");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-[0%] flex flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="p-2 text-base rounded-lg"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="p-2 text-base rounded-lg"
      />
      <button
        type="submit"
        className="cursor-pointer text-black bg-white p-2 text-base rounded-lg hover:text-white hover:bg-gray-700 transition duration-300"
      >
        Log in
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default LoginForm;
