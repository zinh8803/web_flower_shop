import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Container,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateUser = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null); // Chỉ hiển thị ảnh, không gửi
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (userData && userData.id) {
      setUserId(userData.id);
      axios
        .get(`http://localhost:7000/api/Khachhang/id?id=${userData.id}`)
        .then((response) => {
          const userData = response.data;
          setUserName(userData.taiKhoan);
          setEmail(userData.email);
          setPassword(userData.matKhau);
          setName(userData.tenKhachHang);
          setGender(userData.gioiTinh);
          setPhone(userData.soDienThoai);
          setAddress(userData.diaChi);
          setAvatar(userData.avatar); 
        })
        .catch((error) => {
          console.error("Có lỗi khi lấy thông tin người dùng:", error);
          setErrorMessage("Không thể lấy thông tin người dùng.");
        });
    } else {
      setErrorMessage("Không tìm thấy thông tin người dùng.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      Id: userId,
      TaiKhoan: userName,
      Matkhau: password,
      Email: email,
      TenKhachHang: name,
      GioiTinh: gender,
      SoDienThoai: phone,
      DiaChi: address,
      Avatar: null, // Theo yêu cầu API
    };
    
    console.log("Updated Data: ", updatedData);
    try {
      const response = await axios.put(
        "http://localhost:7000/api/Khachhang/update",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Phản hồi từ server:", response.data);
      if (response.status === 200) {
        toast.success("Cập nhật thông tin thành công!");
      } else {
        console.error("API trả về lỗi:", response.data);
        setErrorMessage("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Có lỗi khi cập nhật thông tin:", error);
      setErrorMessage(
        "Có lỗi xảy ra khi kết nối đến server. Vui lòng kiểm tra lại."
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#1976d2", fontWeight: "bold" }}
        >
          Cập nhật thông tin
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                src={avatar ? `http://localhost:7000/${avatar}` : ""}
                alt="Avatar"
                sx={{ width: 100, height: 100, margin: "0 auto" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                value={userName}
                disabled
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                disabled
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên người dùng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới tính"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Cập nhật thông tin
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default UpdateUser;
