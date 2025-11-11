import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";
import Loading from "../Components/Loading/Loading";
import { useAuth } from "../Context/Auth/AuthContext";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login");
      } else {
        await fetchCartItems(data.user.id);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("id, quantity, product:product_id (id, name, price, image_url)")
        .eq("user_id", userId);
      if (error) {
        console.log("Error fetching cart items:", error);
      } else {
        setCartItems(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ حذف المنتج
  const handleRemove = async (id) => {
    // اللغة الحالية
    const lang = i18n.language;

    Swal.fire({
      title: t("confirmDeleteTitle"),
      showCancelButton: true,
      confirmButtonText: t("confirmYes"),
      cancelButtonText: t("confirmNo"),
      reverseButtons: lang === "ar" ? true : false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("cart").delete().eq("id", id);
        if (error) console.log(error);
        else {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
          Swal.fire({
            icon: "success",
            text: t("removeSuccess"),
            confirmButtonText: t("confirmYes"),
          });
        }
      }
    });
  };
  // Handle Order
  const handleOrder = async () => {
    if (cartItems.length === 0)
      return Swal.fire({
        icon: "error",
        title: t("emptyCart"),
        confirmButtonText: t("confirmYes"),
      });
    setOrderLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_price: total,
            status: "pending",
            // service_role: "user"
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      await supabase.from("cart").delete().eq("user_id", user.id);
      if (orderItemsError) throw orderItemsError;
      setCartItems([]);
      Swal.fire({
        icon: "success",
        title:
          i18n.language === "ar"
            ? "تم الطلب بنجاح"
            : "Order placed successfully",
        confirmButtonText: i18n.language === "ar" ? "موافق" : "OK",
      });
      navigate("/orders");
    } catch (err) {
      console.log(err);
    } finally {
      setOrderLoading(false);
    }
  };
  const total = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  if (!authChecked) return <Loading />;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Typography mt={5} textAlign="center" variant="h4">
            {t("cartTitle")}
          </Typography>

          <Box
            sx={{
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            {cartItems.length === 0 ? (
              <Typography color="text.secondary" variant="h6">
                {t("emptyCart")}
              </Typography>
            ) : (
              cartItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={3}
                  sx={{
                    width: {
                      xs: "calc(100% - 32px)",
                      sm: "400px",
                      md: "600px",
                    },

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={90}
                      height={90}
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  </Box>

                  <Stack sx={{ flexGrow: 1, mx: 2 }}>
                    <Typography fontWeight="bold">
                      {item.product.name}
                    </Typography>
                    <Typography color="primary" fontSize="15px">
                      {item.product.price} {t("currency")}
                    </Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemove(item.id)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    {t("delete")}
                  </Button>
                </Paper>
              ))
            )}
            <Box
              sx={{
                width: {
                  xs: "calc(100% - 32px)",
                  sm: "400px",
                  md: "600px",
                },
              }}
            >
              {cartItems.length > 0 && (
                <Typography textAlign="left" variant="h4">
                  {t("totalPrice")} {total.toFixed(2)} {t("currency")}
                </Typography>
              )}
              {cartItems.length > 0 && (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleOrder}
                  sx={{ mx: "auto", mt: 1 }}
                >
                  {orderLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    t("completeOrder")
                  )}
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
