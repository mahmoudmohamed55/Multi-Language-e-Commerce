import { Box, Typography, Paper, Stack } from "@mui/material";
import { useAuth } from "../Context/Auth/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";
import Loading from "../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login");
      } else {
        await fetchOrders(data.user.id);
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.log("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3">
          {t("orders.hello")}{" "}
          <Typography
            component={"span"}
            variant="h3"
            sx={{ color: "warning.main" }}
          >
            {user?.user_metadata?.full_name}
          </Typography>{" "}
          👋
        </Typography>

        <Typography variant="body1" sx={{ mt: 1 }}>
          {t("orders.email")}: {user?.email}
        </Typography>

        {orders.length === 0 ? (
          <Typography variant="h4" sx={{ mt: 3 }}>
            {t("orders.noOrders")}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t("orders.yourOrders")} :{" "}
            <Typography
              component={"span"}
              variant="body1"
              sx={{ color: "warning.main" }}
            >
              {orders.length > 0 ? orders.length : 0}
            </Typography>
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: {
            xs: "calc(100% - 32px)",
            sm: "400px",
            md: "600px",
          },
          mx: "auto",
          mt: 4,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {orders.map((order) => (
          <Paper
            key={order.id}
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t("orders.orderId")} :{" "}
              <Typography
                component={"span"}
                variant="body1"
                sx={{ color: "warning.main" }}
              >
                {order.id.slice(0, 8)}
              </Typography>
            </Typography>
            <Stack spacing={2} direction={"column"}>
              <Typography
                variant="body1"
                sx={{
                  p: 0.5,
                  borderRadius: "12px",
                  width: "90px",
                  textAlign: "center",
                  bgcolor:
                    order.status === "pending"
                      ? "secondary.main"
                      : "success.main",
                  color: "white",
                }}
              >
                {order.status === "pending"
                  ? t("pending")
                  : order.status === "paid"
                  ? t("paid")
                  : t("cancelled")}
              </Typography>
              <Typography variant="body1">
                {t("orders.total")} : {order.total_price} {t("currency")}
              </Typography>
              <Typography variant="body1">
                {new Date(order.created_at).toLocaleString(
                  i18n.language === "ar" ? "ar-EG" : "en-US"
                )}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
