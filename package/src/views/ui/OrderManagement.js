import React, { useState, useEffect } from "react";
import Orderlist from "../forms/orderlist";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";

const OrderManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "khách",
    phone: "",
    address: "",
  });
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, originRes] = await Promise.all([
          axios.get("http://localhost:7000/api/HangHoa"),
          axios.get("http://localhost:7000/api/LoaiHangHoa"),
          axios.get("http://localhost:7000/api/XuatXu"),
        ]);

        setProducts(productRes.data || []);
        setFilteredProducts(productRes.data || []);
        setCategories(categoryRes.data || []);
        setOrigins(originRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((prod) => prod.idLoaiHangHoa === parseInt(selectedCategory));
    }

    if (selectedOrigin) {
      filtered = filtered.filter((prod) => prod.idXuatXu === parseInt(selectedOrigin));
    }

    if (searchTerm) {
      filtered = filtered.filter((prod) =>
        prod.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedOrigin, products]);

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.idSanPham === product.idSanPham);
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.idSanPham === product.idSanPham
            ? { ...item, quantity: Math.min(item.quantity + 1, item.tonKho) }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (idSanPham) => {
    setCart(cart.filter((item) => item.idSanPham !== idSanPham));
  };

  const handleQuantityChange = (idSanPham, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.idSanPham === idSanPham
          ? { ...item, quantity: Math.max(1, Math.min(item.tonKho, newQuantity)) }
          : item
      )
    );
  };

  const totalAmount = cart.reduce((total, item) => total + item.gia * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }

    if (cart.some((item) => item.quantity == 0)) {
      alert("Không thể đặt hàng. Một số sản phẩm trong giỏ có số lượng bằng 0.");
      return;
    }
    
    const orderData = {
      khachhangId: 1,
      tenKhachHang: customerInfo.name,
      diaChi: customerInfo.address,
      sodienthoai: customerInfo.phone,
      phuongThucThanhToan: "Tại quầy",
      tongtien: totalAmount,
      chiTietDonHangs: cart.map((item) => ({
        hangHoaId: item.idSanPham,
        soLuong: item.quantity,
      })),
    };
    try {
      await axios.post("http://localhost:7000/api/DonHang/admin", orderData);
      setSuccessSnackbar(true); // Show success notification
      setCart([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Có lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const getImageUrl = (path) => {
    return `http://localhost:7000/${path.split("WebRootPath\\")[1]}`;
  };

  return (
    <Container maxWidth="lg-6">
      <Typography variant="h4" align="center" gutterBottom>
        Quản lý đơn hàng tại quầy
      </Typography>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Đặt hàng thành công!
        </Alert>
      </Snackbar>
      {/* Bộ lọc */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Tìm kiếm sản phẩm"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Loại sản phẩm"
          select
          fullWidth
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.idLoaiHangHoa} value={cat.idLoaiHangHoa}>
              {cat.tenLoaiHangHoa}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Nguồn gốc"
          select
          fullWidth
          value={selectedOrigin}
          onChange={(e) => setSelectedOrigin(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {origins.map((origin) => (
            <MenuItem key={origin.idXuatXu} value={origin.idXuatXu}>
              {origin.tenXuatXu}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: "auto", mb: 4 }}>
  {filteredProducts.map((product) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product.idSanPham}>
      <Card>
        <CardMedia
          component="img"
          height="120"
          image={getImageUrl(product.hinhAnh)}
          alt={product.tenSanPham}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="h6" textAlign="center">
            {product.tenSanPham}
          </Typography>
          <Typography color="textSecondary" textAlign="center">
            Giá: {product.gia.toLocaleString()} VND
          </Typography>
          <Typography color={product.tonKho > 0 ? "textPrimary" : "error"} textAlign="center">
            {product.tonKho > 0 ? `Tồn kho: ${product.tonKho}` : "Hết hàng"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color={product.tonKho > 0 ? "primary" : "secondary"}
            fullWidth
            onClick={() => handleAddToCart(product)}
            disabled={product.tonKho === 0}
          >
            {product.tonKho > 0 ? "Thêm vào giỏ" : "Hết hàng"}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* Giỏ hàng */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Giỏ hàng
        </Typography>
        {cart.length === 0 ? (
          <Typography>Giỏ hàng trống</Typography>
        ) : (
          cart.map((item) => (
            <Box key={item.idSanPham} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CardMedia
                component="img"
                image={getImageUrl(item.hinhAnh)}
                alt={item.tenSanPham}
                sx={{ width: 80, height: 80, objectFit: "contain", marginRight: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography>{item.tenSanPham}</Typography>
                <Typography color="textSecondary">Tồn kho: {item.tonKho}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={() => handleQuantityChange(item.idSanPham, item.quantity - 1)}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={item.quantity}
                  type="number"
                  size="small"
                  sx={{ width: 100, textAlign: "center", }}
                  onChange={(e) => handleQuantityChange(item.idSanPham, Number(e.target.value))}
                  inputProps={{ min: 1, max: item.tonKho }}
                />
                <IconButton onClick={() => handleQuantityChange(item.idSanPham, item.quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography sx={{ width: 100, textAlign: "right" }}>
                {(item.gia * item.quantity).toLocaleString()} VND
              </Typography>
              <IconButton color="error" onClick={() => handleRemoveFromCart(item.idSanPham)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" align="right">
          Tổng cộng: {totalAmount.toLocaleString()} VND
        </Typography>
        <Button variant="contained" color="success" fullWidth onClick={handleSubmitOrder}>
          Tạo đơn hàng
        </Button>
      </Paper>
<Orderlist/>
    </Container>
  );
};

export default OrderManagement;
