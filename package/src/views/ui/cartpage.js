import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../assets/css/cartpage.css'
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Divider,
  Paper,
  Tooltip,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((response) => {
        setProducts(response.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Có lỗi khi lấy dữ liệu sản phẩm");
        setLoading(false);
      });
  }, []);

  const total = cart.reduce((total, item) => total + item.final_price * item.quantity, 0);
  const vat = total * 0.08;
  const totalWithVAT = total + vat;

  const updateQuantity = (id, newQuantity, tonKho) => {
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    if (newQuantity > tonKho) return;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const removeFromCart = (idSanPham) => {
    const updatedCart = cart.filter((item) => item.id !== idSanPham);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handlePlaceOrder = () => {
    localStorage.setItem("orderDetails", JSON.stringify({ cart, vat, totalWithVAT }));
    navigate("/cartpage/orderpage");
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            const tonKho = product ? product.stock : 0;

            return (
              <Card key={item.id} sx={{ mb: 2, display: "flex", alignItems: "center", padding: 2 }}>
                {/* Hình ảnh */}
                <CardMedia
                  component="img"
                  image={(item.image_url)}
                  alt={item.name}
                  sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, marginRight: 2 }}
                />

                {/* Nội dung sản phẩm */}
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.final_price.toLocaleString()} đ
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tồn kho: {tonKho}
                  </Typography>
                </CardContent>

                {/* Tăng/Giảm số lượng */}
                <CardActions>
                  <Tooltip title="Giảm số lượng">
                    <IconButton
                      onClick={() => updateQuantity(item.id, item.quantity - 1, tonKho)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value, 10), tonKho)
                    }
                    onBlur={() => updateQuantity(item.id, item.quantity, tonKho)}
                    inputProps={{
                      min: 1,
                      max: tonKho,
                      className: 'centered-input', // Thêm lớp CSS tùy chỉnh
                    }}
                    sx={{ width: 120, mx: 1 }}
                  />

                  <Tooltip title="Tăng số lượng">
                    <IconButton
                      onClick={() => updateQuantity(item.id, item.quantity + 1, tonKho)}
                      disabled={item.quantity >= tonKho}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>

                {/* Xóa sản phẩm */}
                <Tooltip title="Xóa sản phẩm">
                  <IconButton onClick={() => removeFromCart(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Card>
            );
          })}
        </Grid>

        {/* Thanh toán */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thanh Toán
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Tạm tính:</Typography>
              <Typography>{total.toLocaleString()} đ</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>VAT (8%):</Typography>
              <Typography>{vat.toLocaleString()} đ</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6" color="error">
                {totalWithVAT.toLocaleString()} đ
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{ mt: 2 }}
              onClick={handlePlaceOrder}
            >
              Đặt Hàng
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
