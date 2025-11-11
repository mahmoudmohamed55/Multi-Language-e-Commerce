import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h1" color="error">
        403{" "}
      </Typography>
      <Typography variant="h5">{t("errors.403.message")}</Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        {t("go_home")}
      </Button>
    </Box>
  );
}
