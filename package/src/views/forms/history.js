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
    const userData = (sessionStorage.getItem("token"));

    if (userData) {
      axios
        .get(`http://127.0.0.1:8000/api/Order/User`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData}`,
            },
          }
        )
        .then((response) => {
          setOrderDetails(response.data.data || []);
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
                  Đơn hàng #{detail.id}
                </Typography>
                <Typography>
                  <strong>Tên sản phẩm:</strong> {detail.name}
                </Typography>
                {/* <Typography>
                  <strong>Số lượng:</strong> {detail.stock}
                </Typography> */}
                <Typography>
                  <strong>Đơn giá:</strong> {detail.total_price} VND
                </Typography>
                <Typography>
                  <strong>Trạng thái:</strong> {detail.status}
                </Typography>
                <Box sx={{ textAlign: "right", mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/orderhistory/${detail.id}`)}

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
