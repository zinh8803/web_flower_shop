import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Orderlist = () => {
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const statuses = ["Đang chuẩn bị hàng", "Đang giao hàng", "Hoàn thành"];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [ordersRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:7000/api/DonHang"),
          axios.get("http://localhost:7000/api/NhanVien"),
        ]);
        setOrders(ordersRes.data || []);
        setEmployees(employeesRes.data || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchOrderDetails = async (idDonHang) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:7000/api/DonHang/HoaDon/${idDonHang}`
      );
      setOrderDetails(response.data || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (idDonHang, status) => {
    try {
      await axios.put(
        `http://localhost:7000/api/DonHang/Chitiet?Iddonhang=${idDonHang}&TrangThai=${encodeURIComponent(
          status
        )}`
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.idDonHang === idDonHang ? { ...order, trangThai: status } : order
        )
      );
      setSuccessSnackbar(true);
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrorSnackbar(true);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.idDonHang);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
    setSelectedEmployee("");
    setOrderDetails([]);
  };

  const handleAssignDelivery = async () => {
    if (!selectedOrder || !selectedEmployee) {
      setErrorSnackbar(true);
      return;
    }

    const deliveryData = {
      donHangID: selectedOrder.idDonHang,
      nhanvienid: selectedEmployee,
      chitietPhieuGiaoDTO: orderDetails.map((detail) => ({
        idHangHoa: detail.hangHoaId,
        soLuong: detail.soLuong,
      })),
    };

    try {
      await axios.post("http://localhost:7000/api/PhieuGiaoHang", deliveryData);
      setSuccessSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error("Error assigning delivery:", error);
      setErrorSnackbar(true);
    }
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.trangThai);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleStatusChange = () => {
    if (selectedOrder) {
      handleUpdateStatus(selectedOrder.idDonHang, newStatus);
    }
    handleCloseStatusDialog();
  };

  return (
    <TableContainer component={Paper}>
      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thành công!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Có lỗi xảy ra!
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
            <TableRow key={order.idDonHang}>
              <TableCell>{order.idDonHang}</TableCell>
              <TableCell>{order.tenKhachHang}</TableCell>
              <TableCell>{order.diaChi}</TableCell>
              <TableCell>{order.sodienthoai}</TableCell>
              <TableCell>{order.phuongThucThanhToan}</TableCell>
              <TableCell>{order.trangThai}</TableCell>
              <TableCell>{order.tongtien.toLocaleString()} VND</TableCell>
              <TableCell>{new Date(order.createDate).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenStatusDialog(order)}
                >
                  Trạng thái
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleOpenDialog(order)}
                  sx={{ ml: 1 }}
                >
                  Giao hàng
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Delivery Assignment */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Giao hàng</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">
                <em>Chọn nhân viên</em>
              </MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.idNhanVien} value={employee.idNhanVien}>
                  {employee.tenKhachHang}
                </MenuItem>
              ))}
            </Select>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignDelivery}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Status Update */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>Cập nhật trạng thái</DialogTitle>
        <DialogContent>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            displayEmpty
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
