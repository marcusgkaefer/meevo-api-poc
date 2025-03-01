import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Point to your local server
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Add CORS headers if needed
    // "Access-Control-Allow-Origin": "*", // This is usually set by the server
  },
  // Uncomment if the server requires credentials
  withCredentials: true,
});

const authClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

interface TokenResponse {
  access_token: string;
  // Add other properties if the response includes more data
}

export const getToken = async (): Promise<TokenResponse> => {
  try {
    const response = await authClient.post<TokenResponse>("", {
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
    });

    localStorage.setItem("authToken", response.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

export const createApiClientWithToken = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Define the expected structure of the response
interface AppointmentCategory {
  id: number;
  name: string;
  // Add other properties as needed
}

export const fetchAppointmentCategories = async (): Promise<AppointmentCategory[]> => {
  try {
    const response = await apiClient.get<AppointmentCategory[]>('/api/appointment-categories');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment categories:", error);
    throw error;
  }
};
