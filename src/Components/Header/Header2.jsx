import {
  AccountCircle,
  ExpandMore,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  Container,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Button,
  useMediaQuery,
  Box,
  TextField,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../Context/Auth/AuthContext";
import logoLight from "../../images/Logo.png";
import logoDark from "../../images/Free.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";

const Search = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  borderRadius: "22px",
  border: "1px solid #777",
  flexGrow: 0.5,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "200px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
}));

export default function Header2() {
  const options = ["All Categories", "CAR", "Clothes", "Electronics"];
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [role, setRole] = useState(null);
  let [cartCount, setCartCount] = useState(0);
  const isWide = useMediaQuery("(min-width:700px)");

  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(options[0]);
  const [userName, setUserName] = useState(null);
  const [runSideEffect, setRunSideEffect] = useState(true);
  const openCategory = Boolean(categoryAnchorEl);
  const openProfile = Boolean(profileAnchorEl);

  const handleClickCategory = (event) =>
    setCategoryAnchorEl(event.currentTarget);
  const handleCloseCategory = () => setCategoryAnchorEl(null);
  const handleSelectCategory = (option) => {
    setSelectedCategory(option);
    handleCloseCategory();
  };
  const handleClickProfile = (event) => setProfileAnchorEl(event.currentTarget);
  const handleCloseProfile = () => setProfileAnchorEl(null);

  useEffect(() => {
    if (!user) return setRole(null);

    let getRole = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (error) return setRole(null);
        setRole(data.role);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      getRole();
    }
  }, [user, runSideEffect]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) return setCartCount(0);
      const { count, error } = await supabase
        .from("cart")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (!error) setCartCount(count || 0);
    };
    fetchCartCount();
  }, [user]);

  const handleUpdateUserName = async () => {
    if (!user) return;
    if (userName === "") return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: userName },
      });

      if (error) throw error;

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: t("header.nameUpdated"),
        showConfirmButton: false,
        timer: 1500,
      });
      setRunSideEffect(!runSideEffect);
      setOpen(false);
    } catch (err) {
      console.error("Error updating name:", err.message);
      Swal.fire({
        icon: "error",
        title: t("header.updateFailed"),
        text: err.message,
      });
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: isWide ? "row" : "column",
        alignItems: "center",
        justifyContent: "space-between",
        my: 1,
        gap: isWide ? 0 : 2,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src={theme.palette.mode === "dark" ? logoDark : logoLight}
            alt="logo"
            width="170px"
            height="50px"
          />
        </Link>
      </Box>

      {user && isWide && (
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t("header.searchPlaceholder")}
            inputProps={{ "aria-label": "search" }}
          />
          <List
            component="nav"
            sx={{
              borderBottomRightRadius: 22,
              borderTopRightRadius: 22,
              borderLeft: "1px solid #777",
              p: "0",
              height: "100%",
            }}
          >
            <ListItem
              id="category-button"
              aria-controls="category-menu"
              aria-haspopup="listbox"
              aria-expanded={openCategory ? "true" : undefined}
              onClick={handleClickCategory}
              sx={{
                px: 1,
                "&:hover": { cursor: "pointer" },
                width: { xs: "150px" },
                height: "100%",
              }}
            >
              <ListItemText
                sx={{
                  ".MuiTypography-root": { fontSize: "15px" },
                }}
                secondary={t(selectedCategory)}
              />
              <ExpandMore sx={{ color: theme.palette.favColor.main }} />
            </ListItem>
          </List>
          <Menu
            id="category-menu"
            anchorEl={categoryAnchorEl}
            open={openCategory}
            onClose={handleCloseCategory}
            MenuListProps={{
              "aria-labelledby": "category-button",
              role: "listbox",
            }}
          >
            {options.map((option) => (
              <MenuItem
                onClick={() => handleSelectCategory(option)}
                key={option}
                sx={{ fontSize: "11px", p: "10px 20px", minHeight: "10px" }}
              >
                {t(option)}
              </MenuItem>
            ))}
          </Menu>
        </Search>
      )}

      <Stack
        direction={isWide ? "row" : "row"}
        gap={1.5}
        alignItems="center"
        justifyContent="center"
      >
        <Link to="/cart" aria-label="cart">
          <StyledBadge
            badgeContent={cartCount}
            color="secondary"
            showZero={false}
          >
            <ShoppingCart
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
              }}
            />
          </StyledBadge>
        </Link>

        {user && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleClickProfile}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={profileAnchorEl}
              open={openProfile}
              onClose={handleCloseProfile}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleCloseProfile}>
                {user.user_metadata?.full_name || t("header.user")}
              </MenuItem>
              <MenuItem onClick={handleClickOpen}>
                {t("header.editProfile")}
              </MenuItem>
              <MenuItem onClick={() => navigate("/orders")}>
                {t("orders.yourOrders")}
              </MenuItem>
            </Menu>
          </div>
        )}

        {role === "admin" && (
          <Typography
            variant="body2"
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              cursor: "pointer",
              color: "primary.main",
              ":hover": { backgroundColor: "primary.main", color: "white" },
            }}
            onClick={() => navigate("/admin")}
          >
            {t("header.adminDashboard")}
          </Typography>
        )}

        {user && (
          <Typography
            variant="body2"
            sx={{
              border: "1px solid",
              borderColor: "error.main",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              cursor: "pointer",
              color: "error.main",
              ":hover": { backgroundColor: "error.main", color: "white" },
            }}
            onClick={() => supabase.auth.signOut()}
          >
            {t("header.logout")}
          </Typography>
        )}

        {user === null && (
          <>
            <Typography
              variant="body2"
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                cursor: "pointer",
                color: "primary.main",
                ":hover": { backgroundColor: "primary.main", color: "white" },
              }}
              onClick={() => navigate("/login")}
            >
              {t("register.login")}
            </Typography>
          </>
        )}
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("header.editProfile")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("header.updateDisplayName")}
          </DialogContentText>

          <TextField
            fullWidth
            margin="dense"
            label={t("header.name")}
            value={userName ?? user?.user_metadata?.full_name ?? ""}
            onChange={(e) => setUserName(e.target.value)}
            error={userName === ""}
            helperText={userName === "" ? t("header.nameRequired") : ""}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            {t("header.cancel")}
          </Button>
          <Button
            onClick={handleUpdateUserName}
            color="primary"
            variant="contained"
          >
            {t("header.update")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
