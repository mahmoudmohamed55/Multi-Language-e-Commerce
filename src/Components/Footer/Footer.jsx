import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as LinkRouter } from "react-router";

import { Facebook, GitHub, Instagram, X } from "@mui/icons-material";
export default function Footer() {
  const { t } = useTranslation();
  const date = new Date();
  const year = date.getFullYear();

  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.bg.main, py: 2.5, mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{
          py: 5,
          borderBlock: "1px solid #777",
          px: {
            xs: 2,
            sm: 0,
          },
          mb: 2,
        }}
      >
        <Stack direction="column">
          <Typography variant="h5" component={"span"} mx={1}>
            {t("E-commerce")}
          </Typography>
          <Typography variant="body1" component={"span"} mx={1}>
            {t("footerDecription")}
          </Typography>
        </Stack>
        <Stack direction="column">
          <Typography variant="h5" component={"span"} mx={1}>
            {t("quickLinks")}
          </Typography>
          <LinkRouter
            style={{ textDecoration: "none", color: "inherit" }}
            to="/"
          >
            <Typography variant="body1" component={"span"} mx={1}>
              {t("homePage")}
            </Typography>
          </LinkRouter>
          <LinkRouter
            style={{ textDecoration: "none", color: "inherit" }}
            to="/orders"
          >
            <Typography variant="body1" component={"span"} mx={1}>
              {t("myOrders")}
            </Typography>
          </LinkRouter>
          <LinkRouter
            style={{ textDecoration: "none", color: "inherit" }}
            to="/cart"
          >
            <Typography variant="body1" component={"span"} mx={1}>
              {t("cart")}
            </Typography>
          </LinkRouter>
        </Stack>
        <Stack direction="column">
          <Typography variant="h5" component={"span"} mx={1}>
            {t("followUs")}
          </Typography>
          <Stack
            sx={{
              mt: {
                xs: 2,
                sm: 0,
              },
            }}
            direction={"row"}
            alignItems={"center"}
            spacing={2}
          >
            <a style={{ color: "inherit" }} href="#">
              <Facebook sx={{ ":hover": { color: "#1877f2" } }} />
            </a>
            <a style={{ color: "inherit" }} href="#">
              <GitHub sx={{ ":hover": { color: "#bd2c00" } }} />
            </a>
            <a style={{ color: "inherit" }} href="#">
              <Instagram sx={{ ":hover": { color: "#c13584" } }} />
            </a>
            <a style={{ color: "inherit" }} href="#">
              <X sx={{ ":hover": { color: "#657786" } }} />
            </a>
          </Stack>
        </Stack>
      </Stack>
      <Box sx={{ textAlign: "center" }}>
        {t("developedBy")}
        <Typography variant="h5" color="#ff7790" component={"span"} mx={1}>
          {t("developerName")}
        </Typography>
        {year === 2025 ? t("year2025") : t("year2026")}
      </Box>
    </Box>
  );
}
