import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const { idDonHang } = useParams(); // Lấy ID đơn hàng từ URL
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:7000/api/DonHang/Chitiet?Iddonhang=${idDonHang}`)
      .then((response) => {
        setOrderDetails(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Có lỗi khi lấy chi tiết đơn hàng.");
        setLoading(false);
      });
  }, [idDonHang]);

  const getImageUrl = (url) => {
    if (!url) return "";
    const imagePath = url.split("WebRootPath\\")[1];
    return `http://localhost:7000/${imagePath}`;
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md-4" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Chi Tiết Đơn Hàng #{idDonHang}
      </Typography>
      <Divider sx={{ mb: 4 }} />
      {orderDetails.length === 0 ? (
        <Typography align="center">Không có thông tin chi tiết đơn hàng.</Typography>
      ) : (
        <Grid container spacing={2}>
          {orderDetails.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: "flex", mb: 2, p: 2 }}>
                <CardMedia
                  component="img"
                  image={getImageUrl(item.hangHoa?.hinhAnh)}
                  alt={item.hangHoa?.tenSanPham}
                  sx={{ width: 120, height: 120, objectFit: "cover", borderRadius: 2, mr: 2 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.hangHoa?.tenSanPham}
                  </Typography>
                  <Typography>
                    <strong>Giá:</strong> {item.hangHoa?.gia.toLocaleString()} VND
                  </Typography>
                  <Typography>
                    <strong>Số lượng:</strong> {item.soLuong}
                  </Typography>
                  <Typography>
                    <strong>Tổng:</strong>{" "}
                    {(item.hangHoa?.gia * item.soLuong).toLocaleString()} VND
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderDetailPage;
