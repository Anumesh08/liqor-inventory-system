"use client";

import { useState } from "react";

interface LoginFormProps {
  onSubmit: (mobile_no: string, login_pin: string) => void;
  loading: boolean;
  error: string;
}

export default function LoginForm({
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  const [mobile_no, setMobileNo] = useState("8888098647");
  const [login_pin, setLoginPin] = useState("1234");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mobile_no, login_pin);
  };

  const fillDemoData = () => {
    setMobileNo("8888098647");
    setLoginPin("1234");
  };

  const clearForm = () => {
    setMobileNo("");
    setLoginPin("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mobile Number */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <div className="space-x-2">
            <button
              type="button"
              onClick={fillDemoData}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Fill Demo
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
        <input
          type="tel"
          value={mobile_no}
          onChange={(e) =>
            setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Enter 10-digit mobile number"
          pattern="[0-9]{10}"
          maxLength={10}
          required
          disabled={loading}
        />

        <p className="text-xs text-gray-500 mt-1">10 digits only</p>
      </div>

      {/* PIN - Updated for 4 digits */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Login PIN
          </label>
        </div>
        <input
          type="password"
          value={login_pin}
          onChange={(e) =>
            setLoginPin(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Enter 4-digit PIN"
          pattern="[0-9]{4}"
          maxLength={4}
          required
          disabled={loading}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">4 digits only</p>
          <p className="text-xs text-gray-500">Length: {login_pin.length}/4</p>
        </div>
      </div>

      {/* PIN Visual Indicator (Optional) */}
      <div className="flex justify-center space-x-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index < login_pin.length ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-red-500 mt-1">
            Check console (F12) for details
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
