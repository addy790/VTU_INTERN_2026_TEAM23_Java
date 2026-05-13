import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "student" | "admin" | "coordinator" | "recruiter";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface RoleCtx {
  role: Role;
  user: User | null;
  token: String | null;
  setAuth: (token: string, user: { id: string, email: string, name: string, role: string }) => void;
  logout: () => void;
}

const Ctx = createContext<RoleCtx | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("pat:token"));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("pat:user");
    return saved ? JSON.parse(saved) : null;
  });

  const role = user?.role || "student";

  const setAuth = (newToken: string, userData: { id: string, email: string, name: string, role: string }) => {
    const formattedUser: User = {
      ...userData,
      role: (userData.role || "student").toLowerCase() as Role
    };
    setToken(newToken);
    setUser(formattedUser);
    localStorage.setItem("pat:token", newToken);
    localStorage.setItem("pat:user", JSON.stringify(formattedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("pat:token");
    localStorage.removeItem("pat:user");
  };

  return (
    <Ctx.Provider value={{ role, user, token, setAuth, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRole() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

export const roleMeta: Record<Role, { label: string; tagline: string }> = {
  student: { label: "Student", tagline: "Track drives, applications & interviews" },
  admin: { label: "TPO / Admin", tagline: "Run placements end-to-end" },
  coordinator: { label: "Coordinator", tagline: "Verify profiles & manage flow" },
  recruiter: { label: "Recruiter", tagline: "Source, shortlist & hire" },
};
