import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Loading from "../../Components/Loading/Loading";

export default function RequireAuth() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // لسه بيتحقق من المستخدم

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const getRole = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          navigate("/403", { replace: true });
        } else if (data.role === "user") {
          navigate("/403", { replace: true });
        } else {
          setRole(data.role);
        }
      } catch (err) {
        console.error(err);
        navigate("/403", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    getRole();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) return <Loading />;

  return <Outlet />;
}
