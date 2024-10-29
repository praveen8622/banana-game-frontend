// hooks/useLogin.ts
import { useState } from "react";
import apiClient from "../services/api-client"; // Adjust according to your project structure

interface LoginResponse {
  token: string; // Adjust this based on your actual response structure
  user: any; // Define a user type if possible
}

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<LoginResponse | void> => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await apiClient.post<LoginResponse>("/login", { username, password });
      // Handle successful login (store token, redirect, etc.)
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token); // Store token
      // Redirect logic could be added here
      return response.data; // Return the response data if needed
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
