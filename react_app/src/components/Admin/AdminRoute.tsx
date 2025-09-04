// src/routes/AdminRoute.tsx
import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type AdminCheckStatus = "loading" | "allowed" | "forbidden" | "login";

const ADMIN_CHECK_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/admin/users`
    : "http://localhost:5170/api/admin/users";


function decodeToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1];
    // base64url -> base64
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    // padding
    while (payload.length % 4 !== 0) payload += "=";
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.warn("decodeToken error", e);
    return null;
  }
}


function getRoleFromClaims(decoded: any): string | null {
  if (!decoded) return null;

  const candidates = [
    "role",
    "roles",
    "roles[]",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/roles",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/roles",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
  ];

  for (const key of candidates) {
    const val = decoded[key];
    if (!val) continue;
    if (Array.isArray(val) && val.length) return String(val[0]);
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
  }

  
  for (const k of Object.keys(decoded)) {
    const v = decoded[k];
    if (typeof v === "string" && /admin/i.test(v)) return v;
    if (Array.isArray(v) && v.some((x) => /admin/i.test(String(x)))) return v.find((x) => /admin/i.test(String(x)));
  }

  return null;
}

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminCheckStatus>("loading");

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      setStatus("login");
      return;
    }

    // 1) 
    const decoded = decodeToken(token);
    const role = getRoleFromClaims(decoded);
    if (role && /admin/i.test(role)) {
      setStatus("allowed");
      return;
    }

    // 2) 
    (async () => {
      try {
        const res = await fetch(ADMIN_CHECK_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 200) {
          setStatus("allowed");
          return;
        }
        if (res.status === 401) {
          // 
          localStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          setStatus("login");
          return;
        }
        // 403 
        setStatus("forbidden");
      } catch (err) {
        console.error("Admin check failed:", err);
        setStatus("forbidden");
      }
    })();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Перевірка прав доступу...
      </div>
    );
  }

  if (status === "login") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    // redirect 
    return <Navigate to="/home" replace />;
  }

  // allowed
  return <>{children}</>;
}
