
import { toast } from "sonner";
import { ApiResponse } from "@/types";

const API_URL = "https://crappy-cbc-backend.vercel.app/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.error || "Something went wrong";
    toast.error(error);
    throw new Error(error);
  }
  
  return data as T;
}

export async function fetchWithAuth<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers || {}),
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string) => 
    fetchWithAuth<ApiResponse<T>>(endpoint, { method: "GET" }),
  
  post: <T>(endpoint: string, data: any) => 
    fetchWithAuth<ApiResponse<T>>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any) => 
    fetchWithAuth<ApiResponse<T>>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) => 
    fetchWithAuth<ApiResponse<T>>(endpoint, { method: "DELETE" }),
};
