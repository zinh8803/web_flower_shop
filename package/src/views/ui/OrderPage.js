import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Divider,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [totalWithVAT, setTotalWithVAT] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = (sessionStorage.getItem("token"));
    if (token) {

      axios
        .get(`http://127.0.0.1:8000/api/user/profile`, {

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data.data;
          setName(userData.name);
          setPhone(userData.phone_number);
          setAddress(userData.address);
        })
        .catch(() => {
          console.error("Error fetching user info.");
        });

      const orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || {};
      const { cart = [], totalWithVAT = 0 } = orderDetails;
      setCart(cart);
      setTotalWithVAT(totalWithVAT);
    }
  }, []);

  const createVNPayPaymentUrl = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }
    const paymentData = {
      orderType: "online",
      amount: Math.round(totalWithVAT),
      orderDescription: "Đơn hàng thanh toán qua VNPay",
      name: name || "Tên khách hàng",
    };
    const response = await axios.post(
      "http://localhost:7000/api/Payment/CreatePaymentUrlVnpay",
      paymentData
    );
    return response.data.paymentUrl;
  };

  const createMoMoPaymentUrl = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }
    const paymentData = {
      orderId: "online",
      amount: Math.round(totalWithVAT),
      orderInfo: "Đơn hàng thanh toán qua MoMo",
      fullName: name || "Tên khách hàng",
    };
    const response = await axios.post(
      "http://localhost:7000/api/Momo/CreatePaymentUrlmomo",
      paymentData
    );
    return response.data.paymentUrl?.result?.payUrl;
  };

  const placeCashOrder = async () => {
    if (cart.length === 0 || cart.quantity === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }
    const orderData = {
      khachhangId: userId,
      tenKhachHang: name,
      diaChi: address,
      sodienthoai: phone,
      tongtien: totalWithVAT,
      phuongThucThanhToan: "tiền mặt",
      chiTietDonHangs: cart.map((item) => ({
        hangHoaId: item.idSanPham,
        soLuong: item.quantity,
      })),
    };
    await axios.post("http://localhost:7000/api/DonHang", orderData);
  };

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng!");
      return;
    }

    try {
      if (paymentMethod === "vnpay") {
        const paymentUrl = await createVNPayPaymentUrl();
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert("Có lỗi xảy ra khi tạo đường dẫn thanh toán VNPay.");
        }
      } else if (paymentMethod === "momo") {
        const paymentUrl = await createMoMoPaymentUrl();
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert("Có lỗi xảy ra khi tạo đường dẫn thanh toán MoMo.");
        }
      } else if (paymentMethod === "cash") {
        if (cart.length === 0) {
          alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
          return;
        }
        await placeCashOrder();
        setSuccessSnackbar(true);
        setTimeout(() => navigate("/"), 2000);
        localStorage.removeItem("cart");
        localStorage.removeItem("orderDetails");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success">
          Đặt hàng thành công! Chuyển về trang chủ...
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Thông Tin Đặt Hàng
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Thông tin khách hàng</Typography>
          <TextField
            label="Họ và Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"

          />
          <TextField
            label="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"

          />
          <TextField
            label="Địa chỉ giao hàng"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"

          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Phương thức thanh toán</Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="momo"
              control={<Radio />}
              label="Thanh toán qua MoMo"
            />
            <FormControlLabel
              value="vnpay"
              control={<Radio />}
              label="Thanh toán qua VNPay"
            />
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label="Thanh toán tiền mặt"
            />
          </RadioGroup>
        </Box>

        <Box>
          <Typography variant="h6">Chi tiết đơn hàng</Typography>
          {cart.map((item) => (
            <Box
              key={item.idSanPham}
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>{item.gia} x {item.quantity}</Typography>
              <Typography>{(item.gia * item.quantity).toLocaleString()} VND</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Tổng cộng:</Typography>
            <Typography variant="h6" color="error">
              {totalWithVAT.toLocaleString()} VND
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handlePlaceOrder}
        >
          Đặt hàng
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderPage;
