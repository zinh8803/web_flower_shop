import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
} from "@mui/material";

const OrderHistoryPage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (userData && userData.id) {
      axios
        .get(`http://localhost:7000/api/DonHang/User/${userData.id}`)
        .then((response) => {
          setOrderDetails(response.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Có lỗi khi lấy lịch sử đơn hàng.");
          setLoading(false);
        });
    } else {
      setError("Bạn chưa có lịch sử đơn hàng nào.");
      setLoading(false);
    }
  }, []);

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md-4" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Lịch Sử Đơn Hàng
      </Typography>
      {orderDetails.length === 0 ? (
        <Typography variant="body1" align="center" color="textSecondary">
          Bạn chưa có lịch sử đơn hàng nào.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {orderDetails.map((detail, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Đơn hàng #{detail.donHangId}
                </Typography>
                <Typography>
                  <strong>Tên sản phẩm:</strong> {detail.tenHangHoa}
                </Typography>
                <Typography>
                  <strong>Số lượng:</strong> {detail.soLuong}
                </Typography>
                <Typography>
                  <strong>Đơn giá:</strong> {detail.donGia.toLocaleString()} VND
                </Typography>
                <Typography>
                  <strong>Trạng thái:</strong> {detail.trangThaiDonHang}
                </Typography>
                <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
  variant="outlined"
  color="primary"
  onClick={() => navigate(`/orderhistory/${detail.donHangId}`)}

>
  Chi Tiết
</Button>
                </Box>
                <Divider sx={{ my: 2 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
