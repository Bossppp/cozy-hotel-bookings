
// User types
export interface User {
  _id: string;
  name: string;
  tel: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  tel: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  tel?: string;
  email?: string;
  password?: string;
}

// Hotel types
export interface Address {
  building_number: string;
  street: string;
  district: string;
  province: string;
  postalcode: string;
}

export interface Hotel {
  _id: string;
  name: string;
  address: Address;
  tel: string;
  bookings?: Booking[];
}

// Booking types
export interface Booking {
  _id: string;
  start_date: string;
  end_date: string;
  hotel: string | Hotel;
  user: string | User;
  createdAt: string;
}

export interface BookingFormData {
  start_date: string;
  end_date: string;
  hotel: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}
