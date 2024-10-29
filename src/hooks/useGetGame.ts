import { useState, useEffect } from "react";
import apiClient from "../services/api-client";
import { AxiosResponse } from "axios";

interface Game {
  question: string;
  solution: number;
}

const useGameData = () => {
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Change error to string for simpler handling

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      setError(null); // Reset error state on new fetch
      try {
        const response: AxiosResponse<Game> = await apiClient.get("/banana_api");
        setGameData(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching game data:", errorMessage); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, []); // Fetch data once on mount

  return { gameData, loading, error };
};

export default useGameData;
