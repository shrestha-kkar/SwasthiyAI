// Mock user database for development
import { UserRole } from "@/types/index";

export interface MockUser {
  id: string;
  email: string;
  password: string; // plain text for mock only
  name: string;
  role: UserRole;
  hospitalId: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "user-001",
    email: "patient@example.com",
    password: "password123",
    name: "John Doe",
    role: UserRole.PATIENT,
    hospitalId: "hosp-001",
  },
  {
    id: "user-002",
    email: "doctor@example.com",
    password: "password123",
    name: "Dr. Sarah Smith",
    role: UserRole.DOCTOR,
    hospitalId: "hosp-001",
  },
  {
    id: "user-003",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: UserRole.ADMIN,
    hospitalId: "hosp-001",
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.email === email);
}

export function findUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.id === id);
}
