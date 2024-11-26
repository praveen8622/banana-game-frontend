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
    } catch (err: any) {
      // Error handling
      if (err.response) {
        // Server response errors (e.g., 400, 401)
        setError(err.response.data.message || 'Login failed. Please try again.');
      } else if (err.request) {
        // Network errors (e.g., no response from server)
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other errors (e.g., code errors)
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;