import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

const DeliveryReceiptPage = () => {
  const [deliveryReceipts, setDeliveryReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveryReceipts = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/PhieuGiaoHang");
        console.log(response.data);
        setDeliveryReceipts(response.data);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu phiếu giao hàng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryReceipts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!deliveryReceipts || deliveryReceipts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="textSecondary">Không có phiếu giao hàng nào.</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Danh Sách Phiếu Giao Hàng
      </Typography>
      {deliveryReceipts.map((receipt) => (
        <Paper key={receipt.idPhieuGiaoHang} elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Thông tin Phiếu Giao Hàng
          </Typography>
          <Typography>
            <strong>ID Phiếu Giao Hàng:</strong> {receipt.idPhieuGiaoHang || "Không rõ"}
          </Typography>
          <Typography>
            <strong>Thời gian:</strong> {new Date(receipt.dateTime).toLocaleString() || "Không rõ"}
          </Typography>
          <Typography>
            <strong>ID Nhân Viên:</strong> {receipt.nhanVienId || "Không rõ"}
          </Typography>
          <Typography>
            <strong>Tên Nhân Viên:</strong> {receipt.nhanvien?.tenKhachHang || "Không rõ"}
          </Typography>
          <Typography>
            <strong>Email Nhân Viên:</strong> {receipt.nhanvien?.email || "Không rõ"}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default DeliveryReceiptPage;
