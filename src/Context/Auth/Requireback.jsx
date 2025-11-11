import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function RequireBack() {
  const { user } = useAuth();
  let navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return !user && <Outlet />;
}
