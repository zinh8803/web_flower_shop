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
    const Token = sessionStorage.getItem("token");

    if (Token) {
      axios
        .get(`http://127.0.0.1:8000/api/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
        )
        .then((response) => {
          const userData = response.data.data;
          setUserName(userData.name);
          setEmail(userData.email);
          setName(userData.name);
          setPhone(userData.phone_number);
          setAddress(userData.address);
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
    const Token = sessionStorage.getItem("token");
    e.preventDefault();

    try {
      // 1. Gửi thông tin cá nhân trước
      const profileData = {
        name: name,
        email: email,
        address: address,
        phone_number: phone,
      };
      if (!name || !phone || !address) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      const profileResponse = await axios.put(

        "http://127.0.0.1:8000/api/users/UpdateProfile",
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );



      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setErrorMessage("Có lỗi xảy ra khi cập nhật.");
    }
  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/update-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Cập nhật avatar thành công!");
      setAvatar(URL.createObjectURL(file));

    } catch (error) {
      console.error("Lỗi khi cập nhật avatar:", error);
      toast.error("Cập nhật avatar thất bại!");
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
                src={avatar}
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
                label="Tên người dùng"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Chọn Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
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
