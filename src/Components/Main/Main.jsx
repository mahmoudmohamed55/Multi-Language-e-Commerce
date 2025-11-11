import {
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import { AddShoppingCartOutlined, Close } from "@mui/icons-material";
import ProductDetails from "./ProductDetails";
import { supabase } from "../../../supabaseClient";

export default function Main() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [alignment, setAlignment] = useState("left");

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("❌", t("Error fetching products:"), error.message);
      } else {
        setProducts(data);
      }
     
      
    };

    fetchProducts();
  }, [t]);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Container sx={{ py: 7 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography variant="h6">{t("Selected Products")}</Typography>
          <Typography variant="body1" fontWeight={300}>
            {t("All our new arrivals in an exclusive brand selection")}
          </Typography>
        </Box>

        {/* Toggle Buttons */}
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          color="error"
          sx={{
            mt: { xs: 3, md: 0 },
            ".Mui-selected": {
              border: "1px solid rgba(233,69,96,0.5)!important",
              color: "#e94560",
              backgroundColor: "initial",
            },
          }}
        >
          <ToggleButton
            className="my-button"
            sx={{ color: theme.palette.text.primary }}
            value="left"
          >
            {t("All Products")}
          </ToggleButton>
          <ToggleButton
            className="my-button"
            sx={{ mx: "16px !important", color: theme.palette.text.primary }}
            value="center"
          >
            {t("Men Category")}
          </ToggleButton>
          <ToggleButton
            className="my-button"
            sx={{ color: theme.palette.text.primary }}
            value="right"
          >
            {t("Women Category")}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Products Grid */}
      <Grid mt={6} container spacing={2}>
        {products.map((item) => (
          <Grid key={item.id} item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                sx={{
                  height: 250,
                  "&:hover": { transform: "scale(1.05)" },
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                }}
                image={item.image_url}
                title={t("Product Image")}
                onClick={() => {
                  setSelectedProduct(item);
                  setOpen(true);
                }}
              />
              <CardContent
                sx={{
                  py: 0.5,
                  textAlign: "left",
                }}
              >
                <Typography gutterBottom variant="h5">
                  {t(item.name)}
                </Typography>
                <Typography variant="body1">
                  {item.price}{" "}
                  <Typography component="span" variant="body1" color="primary">
                    $
                  </Typography>
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ":hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSelectedProduct(item);
                    setOpen(true);
                  }}
                >
                  {t("Details")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 10 }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
        {selectedProduct && <ProductDetails product={selectedProduct} />}
      </Dialog>
    </Container>
  );
}
