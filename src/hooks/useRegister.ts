import { useState } from "react";
import apiClient from "../services/api-client";

interface RegisterResponse {
  user: any;
  message: string;
}


const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<RegisterResponse | null>(null);

  const register = async (formData: {
    full_name: string;
    email: string;
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    if (!formData.full_name || !formData.email || !formData.username || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    

    // Create FormData for multipart/form-data request
    const form = new FormData();
    form.append("full_name", formData.full_name);
    form.append("email", formData.email);
    form.append("username", formData.username);
    form.append("password", formData.password);

   

    try {
      // Send the FormData object
      const { data } = await apiClient.post<RegisterResponse>("users/register", form, {
        headers: {
          "Content-Type": "application/json", 
        },
      });
      // Handle successful registration
      console.log('Registration successful', data);
      setResponse(data);
      return data;
    } catch (err: any) {
      // Error handling
      if (err.response) {
        // Server response errors (e.g., 400, 401)
        setError(err.response.data.message || 'Registration failed. Please try again.');
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

  return { register, loading, error, response };
};

export default useRegister;
