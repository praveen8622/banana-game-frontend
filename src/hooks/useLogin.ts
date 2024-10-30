// hooks/useLogin.ts
import { useState } from "react";
import apiClient from "../services/api-client"; 

interface LoginResponse {
  access_token: string; 
  user: any; 
}

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<LoginResponse | void> => {
    setLoading(true);
    setError(null); 

    try {
      
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await apiClient.post<LoginResponse>("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
        },
      });
      
      console.log("Login successful:", response.data);
      localStorage.setItem("access_token", response.data.access_token); 
      return response.data; 
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
