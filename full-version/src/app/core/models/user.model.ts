/**
 * User Model - Represents a user in the SA Dressage system
 */

export enum UserRole {
  PUBLIC = 'PUBLIC',
  RIDER = 'RIDER',
  CLUB = 'CLUB',
  PROVINCIAL = 'PROVINCIAL',
  SAEF = 'SAEF',
  SHOW_HOLDING_BODY = 'SHB',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  profileImage?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    role: string;
  };
}

export interface RegisterRequest {
  // Step 1: Personal Information
  title: string;
  firstName: string;
  maidenName?: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;

  // Step 2: Contact & Address Information
  addressLine1: string;
  addressLine2?: string;
  town: string;
  suburb?: string;
  country: string;
  city: string;
  province: string;
  postalCode: string;
  mobileNumber: string;
  marketingEmails?: boolean;

  // Step 3: Account Credentials
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

