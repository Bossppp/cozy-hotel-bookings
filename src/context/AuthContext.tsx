
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { 
  AuthState, 
  User, 
  LoginCredentials, 
  RegisterCredentials,
  UpdateUserData
} from "@/types";

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

// Action types
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAIL"; payload: string }
  | { type: "USER_LOADED"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "AUTH_FAIL":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "USER_LOADED":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserData) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Load user on initial load
  useEffect(() => {
    if (state.token) {
      loadUser();
    }
  }, []);

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });
      
      const response = await api.post<{token: string; user: User}>("/auth/login", credentials);
      
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      dispatch({
        type: "AUTH_FAIL",
        payload: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  // Register
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });
      
      const response = await api.post<{token: string; user: User}>("/auth/register", credentials);
      
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
      
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      dispatch({
        type: "AUTH_FAIL",
        payload: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      dispatch({ type: "AUTH_START" });
      
      const response = await api.get<User>("/auth/me");
      
      dispatch({
        type: "USER_LOADED",
        payload: response.data,
      });
    } catch (error) {
      localStorage.removeItem("token");
      
      dispatch({
        type: "AUTH_FAIL",
        payload: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };

  // Update user
  const updateUser = async (data: UpdateUserData) => {
    try {
      dispatch({ type: "AUTH_START" });
      
      const response = await api.put<User>("/auth/updatedetails", data);
      
      dispatch({
        type: "UPDATE_USER",
        payload: response.data,
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch({
        type: "AUTH_FAIL",
        payload: error instanceof Error ? error.message : "Update failed",
      });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        loadUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
