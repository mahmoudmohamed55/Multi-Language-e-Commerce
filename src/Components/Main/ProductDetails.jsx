import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Box, Button, Rating, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Context/Auth/AuthContext";
import { useNavigate } from "react-router";
import { supabase } from "../../../supabaseClient";
import Swal from "sweetalert2";

const ProductDetails = ({ product }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");

    try {
      const { data: existingItem, error: checkError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.log("Check error:", checkError);
        throw checkError;
      }

      // 🛒 المنتج موجود بالفعل في العربة
      if (existingItem) {
        Swal.fire({
          position: "top-end",
          icon: "info",
          title:
            i18n.language === "ar"
              ? "المنتج موجود بالفعل في العربة"
              : "Product already in cart",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }


      const { error } = await supabase
        .from("cart")
        .insert({ user_id: user.id, product_id: product.id, quantity: 1 });

      if (error) throw error;

      Swal.fire({
        position: "top-end",
        icon: "success",
        title:
          i18n.language === "ar"
            ? "تمت إضافة المنتج إلى العربة بنجاح"
            : "Product added to cart successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title:
          i18n.language === "ar"
            ? "حدث خطأ أثناء إضافة المنتج"
            : "Something went wrong while adding product",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (!product) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2.5,
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box sx={{ display: "flex", flexBasis: "50%" }}>
        <img
          style={{
            maxWidth: "100%",
            maxHeight: "500px",
            objectFit: "cover",
          }}
          src={product.image_url}
          alt={t(product.name)}
        />
      </Box>

      <Box sx={{ textAlign: { xs: "center", sm: "left" }, py: 2 }}>
        <Typography variant="h5">{t(product.name)}</Typography>

        <Typography my={0.4} fontSize={"22px"} color={"crimson"} variant="h6">
          {product.price} {t("product.currency")}
        </Typography>

        <Typography variant="body1">{t(product.description)}</Typography>

        <Stack
          sx={{ justifyContent: { xs: "center", sm: "left" } }}
          direction={"row"}
          gap={1}
          my={2}
        >
          <img
            style={{ borderRadius: 3 }}
            height={100}
            width={90}
            src={product.image_url}
            alt={t(product.name)}
          />
        </Stack>
        <Stack gap={3}>
          <Rating
            precision={0.1}
            name="read-only"
            value={Math.floor(Math.random() * 5) + 1}
            readOnly
          />
          <Button
            sx={{ mb: { xs: 1, sm: 0 }, textTransform: "capitalize" }}
            variant="contained"
            onClick={handleAddToCart}
          >
            <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize="small" />
            {t("product.buyNow")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductDetails;
