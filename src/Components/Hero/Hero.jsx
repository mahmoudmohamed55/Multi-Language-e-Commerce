import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./style.css";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import img1 from "../../images/banner-16.jpg";
import img2 from "../../images/banner-17.jpg";
import { ArrowForward } from "@mui/icons-material";
import IconSection from "./IconSection";

export default function Hero() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const mySlider = [
    {
      textKey: "Lifestyle Collection",
      saleKey: "Sale Up To",
      off: "50%",
      img: "https://github.com/alielrayes/t-shirts/blob/react-ecomerce-dev-ali-youtube-channel/banner-15.jpg",
    },
    {
      textKey: "Lifestyle Collection",
      saleKey: "Sale Up To",
      off: "30%",
      img: "https://github.com/alielrayes/t-shirts/blob/react-ecomerce-dev-ali-youtube-channel/banner-15.jpg",
    },
  ];

  return (
    <Container
      sx={{
        boxShadow: "0px 4px 4px rgba(85, 85, 85, 0.25)",
        borderRadius: "12px",
        backgroundColor: theme.palette.bg.main,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: 4,
        }}
      >
        <Swiper
          key={i18n.language}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          navigation
          modules={[Pagination]}
          className="mySwiper"
        >
          {mySlider.map((item, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  flex: 1,
                  flexBasis: "50%",
                  textAlign: { xs: "center", md: "left" },
                  my: { xs: 4, md: 0 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    letterSpacing: 2,
                    mb: 1,
                  }}
                >
                  {t(item.textKey)}
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {t("MEN")}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {t(item.saleKey)}
                  <Typography
                    component="span"
                    variant="h4"
                    sx={{
                      color: theme.palette.error.main,
                      fontWeight: "bold",
                      mx: 0.5,
                    }}
                  >
                    {t(item.off)}
                  </Typography>
                  {t("OFF")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t("Free Shipping Text")}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    px: 5,
                    py: 1.5,
                    backgroundColor: theme.palette.text.primary,
                    color: theme.palette.background.default,
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: theme.palette.error.main,
                      color:
                        theme.palette.mode === "dark"
                          ? "#000"
                          : theme.palette.background.default,
                    },
                  }}
                >
                  {t("Shop Now")}
                </Button>
              </Box>

              <Box
                sx={{
                  flexBasis: "70%",
                  height: "100%",
                }}
              >
                <img
                  src={item.img}
                  alt="hero-banner"
                  style={{
                    width: "100%",
                    maxHeight: "100%",
                    borderRadius: "12px",
                    objectFit: "contain",
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 4px 20px rgba(0,0,0,0.1)"
                        : "0 4px 20px rgba(255,255,255,0.05)",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        <Box
          sx={{
            display: { xs: "none", md: "block", minWidth: "26.6%" },
            pt: 2,
          }}
        >
          <Box sx={{ position: "relative", height: "150px" }}>
            <img
              width={"100%"}
              style={{ borderRadius: "12px" }}
              src={img2}
              alt="hero-banner"
              height={"100%"}
            />

            <Stack
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [i18n.language === "ar" ? "right" : "left"]: 30,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#2B3445",
                  fontSize: "18px",
                }}
              >
                {t("New Arrivals")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#2B3445",
                  lineHeight: "16px",
                  mt: 1,
                }}
              >
                {t("Summer")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#2B3445",
                }}
              >
                {t("Sale 20% OFF")}
              </Typography>

              <Link
                sx={{
                  color: "#2B3445",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "0.2s",

                  "&:hover": {
                    color: "#D23F57",
                  },
                }}
                href="#"
                underline="none"
              >
                {t("Shop Now")}
                <ArrowForward sx={{ fontSize: "13px" }} />
              </Link>
            </Stack>
          </Box>

          <Box sx={{ position: "relative", height: "150px", mt: 2 }}>
            <img
              width={"100%"}
              style={{ borderRadius: "12px" }}
              src={img1}
              alt=""
              height={"100%"}
            />
            <Stack
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [i18n.language === "ar" ? "right" : "left"]: 30,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#2B3445",
                  fontSize: "18px",
                  fontWeight: 300,
                }}
              >
                {t("Gaming 4K")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#2B3445",
                  lineHeight: "16px",
                  mt: 1,
                }}
              >
                {t("Desktops &")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#2B3445",
                }}
              >
                {t("Laptops")}
              </Typography>

              <Link
                sx={{
                  color: "#2B3445",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "0.2s",

                  "&:hover": {
                    color: "#D23F57",
                  },
                }}
                href="#"
                underline="none"
              >
                {t("Shop Now")}
                <ArrowForward sx={{ fontSize: "13px" }} />
              </Link>
            </Stack>
          </Box>
        </Box>
      </Box>
      <IconSection />
    </Container>
  );
}
