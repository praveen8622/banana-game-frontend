// hooks/useRegister.ts
import { useState } from "react";
import apiClient from "../services/api-client";

interface RegisterResponse {
  user: any; 
  message: string;
}

const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (username: string, password: string): Promise<RegisterResponse | void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<RegisterResponse>("/register", { username, password });
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;
