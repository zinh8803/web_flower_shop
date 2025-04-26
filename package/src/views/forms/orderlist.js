import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Select, MenuItem, Snackbar, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from "@mui/material";
import axios from "axios";

const Orderlist = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const statuses = ["pending", "processing", "completed", "declined"];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const ordersRes = await axios.get("http://127.0.0.1:8000/api/Order");
        setOrders(ordersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleUpdateStatus = async (idDonHang, status) => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    try {
      await axios.put(`http://127.0.0.1:8000/api/Order/${idDonHang}/status`, {
        employee_id: userDetails.id, // TRUYỀN ID NHÂN VIÊN VÀO BODY NÈ
        status: status,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === idDonHang ? { ...order, status: status } : order
        )
      );
      setSuccessSnackbar(true);
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrorSnackbar(true);
    }
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleStatusChange = () => {
    if (selectedOrder) {
      handleUpdateStatus(selectedOrder.id, newStatus); // LẤY id CHO ĐÚNG
    }
    handleCloseStatusDialog();
  };

  return (
    <TableContainer component={Paper}>
      {/* Snackbar Thành công */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Cập nhật trạng thái thành công!
        </Alert>
      </Snackbar>

      {/* Snackbar Lỗi */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorSnackbar(false)} severity="error" sx={{ width: "100%" }}>
          Cập nhật trạng thái thất bại!
        </Alert>
      </Snackbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Đơn hàng</TableCell>
            <TableCell>Khách hàng</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Phương thức thanh toán</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.phone_number}</TableCell>
              <TableCell>{order.payment_method}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.total_price.toLocaleString()} VND</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenStatusDialog(order)}
                >
                  Cập nhật trạng thái
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog chọn trạng thái */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <Select
            value={newStatus}
            defaultValue={selectedOrder?.status || ""}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleStatusChange}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default Orderlist;
