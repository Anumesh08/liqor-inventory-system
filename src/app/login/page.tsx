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
      const response = await axios.post(`${API_BASE_URL}/User/login`, {
        mobile_no: mobile_no,
        login_pin: pinNumber,
      });

      const data = response.data;
      console.log("API Response:", data);

      if (data.status && data.token) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);

        // Decode token to get user info
        try {
          const tokenParts = data.token.split(".");
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Decoded Token Payload:", payload);

          // Save user info
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3">
        {/* Left side - Login Form */}

        <div
          className="hidden md:block md:w-2/2 h-screen rounded-xl"
          style={{
            backgroundImage: `url('/images/drink.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        {/* Right side - Image */}
        <div className="w-full md:w-1/2 flex justify-center px-4 md:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-2xl p-8">
              {/* Logo/Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-white font-bold">LI</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Liquor Inventory
                </h1>
                <p className="text-gray-600 mt-2">Sign in with Mobile & PIN</p>
              </div>

              {/* Login Form */}
              <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
              />

              {/* Demo Info */}
              {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Mobile: 8010901680
                  <br />
                  PIN: 1234
                </p>
              </div> */}

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  © 2026 Liquor Inventory System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
