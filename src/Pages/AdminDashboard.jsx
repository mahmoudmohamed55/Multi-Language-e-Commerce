import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { adminClient, supabase } from "../../supabaseClient";
import Loading from "../Components/Loading/Loading";
import {
  Add,
  Delete,
  Edit,
  EditSquare,
  List,
  Person,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import styled from "@emotion/styled";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });

  let [setAccept] = useState(false);

  const [editProduct, setEditProduct] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const addProductOpenDialog = () => {
    setAddProductOpen(true);
  };

  const addProductCloseDialog = () => {
    setAddProductOpen(false);
    setEditProduct(null);
    setEditUser(null);
    setEditOrder(null);
    setForm({
      name: "",
      price: "",
      description: "",
      image_url: "",
      role: "",
      status: "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    if (tab === "products") {
      const { data, error } = await supabase.from("products").select("*");
      if (!error) setProducts(data);
      console.log(data);
    } else if (tab === "users") {
      const { data, error } = await adminClient
        .from("profiles")
        .select("id,email,role");
      if (!error) setUsers(data);
      console.log(data);
    } else if (tab === "orders") {
      const { data, error } = await adminClient.from("orders").select("*");
      if (!error) setOrders(data);
      console.log(data);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditProduct(null);
    setEditUser(null);
    setEditOrder(null);

    if (tab === "products") {
      setEditProduct(item);
      setForm({
        name: item.name,
        price: item.price,
        description: item.description,
        image_url: item.image_url,
      });
    } else if (tab === "users") {
      setEditUser(item);
      setForm({ role: item.role });
    } else if (tab === "orders") {
      setEditOrder(item);
      setForm({ status: item.status });
    }

    setAddProductOpen(true);
  };

  const HandleProductActions = async () => {
    setAccept(true);
    if (!form.name || !form.price || !form.description || !form.image_url) {
      return Swal.fire(t("alert.error"), t("alert.fill_all_fields"), "error");
    }
    if (editProduct) {
      const { error } = await adminClient
        .from("products")
        .update(form)
        .eq("id", editProduct.id);
      if (error) return Swal.fire(t("alert.error"), error.message, "error");
      setEditProduct(null);
      Swal.fire(t("alert.success"), t("alert.product_updated"), "success");
    } else {
      const { error } = await adminClient.from("products").insert([form]);
      if (error) return Swal.fire(t("alert.error"), error.message, "error");
      Swal.fire(t("alert.success"), t("alert.product_added"), "success");
    }

    fetchData();
    addProductCloseDialog();
    setForm({
      name: "",
      price: "",
      description: "",
      image_url: "",
    });
    setAccept(false);
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: t("alert.confirm_delete_title"),
      text: t("alert.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("buttons.confirm_delete"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await adminClient
          .from("products")
          .delete()
          .eq("id", id);
        if (error) return Swal.fire(t("alert.error"), error.message, "error");
        Swal.fire(t("alert.success"), t("alert.product_deleted"), "success");
      }
      fetchData();
    });
  };

  const handleEditUser = async () => {
    const { error } = await adminClient
      .from("profiles")
      .update({ role: form.role })
      .eq("id", editUser.id);
    if (error) return Swal.fire(t("alert.error"), error.message, "error");
    fetchData();
    addProductCloseDialog();
    setForm({ role: "" });
    setAccept(false);
    setEditUser(null);
    Swal.fire(t("alert.success"), t("alert.user_updated"), "success");
  };

  const handleEditOrder = async () => {
    const { error } = await adminClient
      .from("orders")
      .update({ status: form.status })
      .eq("id", editOrder.id);
    if (error) return Swal.fire(t("alert.error"), error.message, "error");
    addProductCloseDialog();
    setForm({ status: "" });
    setAccept(false);
    setEditOrder(null);
    Swal.fire(t("alert.success"), t("alert.user_updated"), "success");
    fetchData();
  };

  const renderTabs = () => {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ my: 3 }}
      >
        {[
          { key: "products", label: t("tabs.products") },
          { key: "users", label: t("tabs.users") },
          { key: "orders", label: t("tabs.orders") },
        ].map((item) => (
          <Button
            key={item.key}
            onClick={() => setTab(item.key)}
            variant="contained"
            sx={{
              bgcolor: item.key === tab ? "primary.main" : "grey.300",
              color: item.key === tab ? "white" : "grey.800",
              fontWeight: item.key === tab ? "bold" : "medium",
              px: 3,
              py: 1,
              borderRadius: "20px",
              boxShadow:
                item.key === tab
                  ? "0 2px 8px rgba(0, 0, 0, 0.25)"
                  : "0 1px 3px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: item.key === tab ? "primary.dark" : "grey.400",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    );
  };

  const renderProducts = () => {
    return (
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ my: 3 }}
        >
          <Typography
            sx={{
              fontSize: { xs: "15px", sm: "30px" },
            }}
          >
            {t("headers.products_management")} 🛍️
          </Typography>
          <Button
            onClick={addProductOpenDialog}
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontWeight: "bold",
              px: { xs: 1, sm: 3 },
              py: 1,
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {t("buttons.add_product")}
          </Button>
        </Stack>

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
                  title={t("headers.product_image")}
                />
                <CardContent sx={{ py: 0.5, textAlign: "left" }}>
                  <Typography gutterBottom variant="h5">
                    {t(item.name)}
                  </Typography>
                  <Typography variant="body1">
                    {item.price}{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      color="primary"
                    >
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
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="contained"
                      size="small"
                      color="warning"
                      sx={{
                        minWidth: "32px",
                        height: "32px",
                        p: 0.5,
                        borderRadius: "8px",
                      }}
                    >
                      <EditSquare fontSize="small" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="contained"
                      size="small"
                      color="error"
                      sx={{
                        minWidth: "32px",
                        height: "32px",
                        p: 0.5,
                        borderRadius: "8px",
                      }}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

  const renderUsers = () => {
    return (
      <Container>
        <TableContainer sx={{ p: 2 }} component={Paper}>
          <Typography
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
            variant="h5"
            gutterBottom
          >
            {t("headers.users_management")} <Person />
          </Typography>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>{t("orders.email")}</StyledTableCell>
                <StyledTableCell align="right">
                  {t("form.role")}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {t("buttons.edit")}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.email}
                  </StyledTableCell>
                  <StyledTableCell align="right">{t(row.role)}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleEdit(row)}
                    >
                      {t("buttons.edit")} <Edit />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  };

  const renderOrders = () => {
    return (
      <Container>
        <TableContainer sx={{ p: 2 }} component={Paper}>
          <Typography
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
            variant="h5"
            gutterBottom
          >
            {t("headers.orders_management")} 🧾
          </Typography>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  {t("orders.orderId")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {t("orders.user-id")}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {t("orders.total")}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {t("orders.status")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {t("orders.actions")}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.user_id}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.total_price}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {t(row.status)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleEdit(row)}
                    >
                      {t("buttons.edit")} <Edit />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography textAlign={"center"} variant="h3">
        {t("headers.admin_dashboard")} ⚙️
      </Typography>

      {renderTabs()}

      {loading && <Loading />}
      {tab === "products" && renderProducts()}
      {tab === "users" && renderUsers()}
      {tab === "orders" && renderOrders()}

      <Dialog
        maxWidth="md"
        fullWidth
        open={addProductOpen}
        onClose={addProductCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{ display: "flex", alignItems: "center" }}
          id="alert-dialog-title"
        >
          {editProduct ? (
            <>
              {t("buttons.edit_product")} <Edit />
            </>
          ) : editUser ? (
            <>
              {t("buttons.edit_user")} <Edit />
            </>
          ) : editOrder ? (
            <>
              {t("buttons.edit_order")} <Edit />
            </>
          ) : (
            <>
              {t("buttons.add_product")} <Add />
            </>
          )}
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="alert-dialog-description">
            {editProduct || (!editUser && !editOrder) ? (
              <Stack mt={2} direction="column" spacing={2}>
                <TextField
                  margin="dense"
                  label={t("form.name")}
                  fullWidth
                  value={form.name}
                  name="name"
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label={t("form.price")}
                  type="number"
                  fullWidth
                  value={form.price}
                  name="price"
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label={t("form.image_url")}
                  fullWidth
                  value={form.image_url}
                  name="image_url"
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label={t("form.description")}
                  fullWidth
                  value={form.description}
                  name="description"
                  onChange={handleChange}
                />
              </Stack>
            ) : editUser ? (
              <Stack>
                <TextField
                  sx={{ mt: 2 }}
                  select
                  fullWidth
                  label={t("form.role")}
                  value={form.role}
                  name="role"
                  onChange={(e) => setForm({ role: e.target.value })}
                  helperText={t("form.select_role")}
                >
                  {["user", "admin"].map((role) => (
                    <MenuItem key={role} value={role}>
                      {t(`${role}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            ) : editOrder ? (
              <Stack>
                <TextField
                  sx={{ mt: 2 }}
                  select
                  fullWidth
                  label={t("form.status")}
                  value={form.status}
                  name="status"
                  onChange={(e) => setForm({ status: e.target.value })}
                  helperText={t("form.select_status")}
                >
                  {["pending", "paid", "cancelled"].map((status) => (
                    <MenuItem key={status} value={status}>
                      {t(`${status}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            ) : null}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={
              editProduct
                ? HandleProductActions
                : editUser
                ? handleEditUser
                : editOrder
                ? handleEditOrder
                : HandleProductActions
            }
          >
            {editProduct
              ? t("buttons.edit_product")
              : editUser
              ? t("buttons.edit_user")
              : editOrder
              ? t("buttons.edit_order")
              : t("buttons.add_product")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
