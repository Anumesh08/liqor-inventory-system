"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoginForm from "@/components/auth/LoginForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (mobile_no: string, login_pin: string) => {
    setLoading(true);
    setError("");

    try {
      console.log("Making API call to:", `${API_BASE_URL}/User/login`);

      // Convert login_pin to number
      const pinNumber = parseInt(login_pin);
      // API expects mobile_no and login_pin (as number)
      const response = await axios.post(`${API_BASE_URL}/User/login`, {
        mobile_no: mobile_no,
        login_pin: pinNumber,
      });

      const data = response.data;
      console.log("API Response:", data);

      // ✅ FIX: Check if login successful
      if (data.status && data.token) {
        // ✅ Save token to localStorage
        localStorage.setItem("token", data.token);

        // ✅ Decode token to get user info
        try {
          const tokenParts = data.token.split(".");
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Decoded Token Payload:", payload);

          // ✅ Save user info
          localStorage.setItem(
            "user",
            JSON.stringify({
              employee_id: payload.employee_id,
              employee_name: payload.employee_name,
              mobile_no: payload.mobile_no,
              shop_id: payload.shop_id,
              employee_type: payload.employee_type,
              shop: payload.shop,
            }),
          );
        } catch (decodeError) {
          console.error("Token decode error:", decodeError);
        }

        // ✅ REDIRECT TO DASHBOARD - YEH MISSING THA!
        console.log("Login successful, redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        // Login failed
        setError(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message?.includes("Network Error")) {
        setError("Cannot connect to server. Please check backend.");
      } else if (err.response?.status === 401) {
        setError("Invalid mobile number or PIN");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-white font-bold">LI</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Liquor Inventory
            </h1>
            <p className="text-gray-600 mt-2">Sign in with Mobile & PIN</p>
            <p className="text-xs text-gray-500 mt-1">
              API: {API_BASE_URL}/User/login
            </p>
          </div>

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

          {/* Demo Info - PIN update karein */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Demo Credentials:</strong>
              <br />
              Mobile: 8010901680
              <br />
              PIN: 123456 {/* 6-digit PIN */}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Liquor Inventory System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
