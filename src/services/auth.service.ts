import apiClient from "@/lib/api/client";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
};
