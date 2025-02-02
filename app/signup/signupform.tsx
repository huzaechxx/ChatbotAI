"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill out all fields");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      if (response.status !== 200) {
        throw new Error("Signup failed. Please try again.hel");
      } else {
        setSuccess("Signup successful! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000); // Delay to show the success message before redirecting
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred. Please try again.");
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-[0%] flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="p-2 text-base rounded-lg"
      />
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
        Sign Up
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default SignupForm;
