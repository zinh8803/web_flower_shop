import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const FormOrig = () => {
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setErrorMessage("Tên loại hàng không thể để trống.");
      setErrorSnackbar(true);
      return;
    }

    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const token = sessionStorage.getItem("authToken");

    const formData = new FormData();

    formData.append("name", categoryName);
    formData.append("employee_id", parseInt(userDetails.id));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/categories`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Thêm sản phẩm thành công");
        setCategoryName("");
        setImageFile(null);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data?.message || "Thêm loại hàng thất bại. Vui lòng thử lại."
        );
      } else if (error.request) {
        setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        setErrorMessage("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
      setErrorSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
        <Typography variant="h4" gutterBottom align="center">
          Thêm loại hàng mới
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Tên loại hàng"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
            Chọn hình ảnh
            <input
              type="file"
              hidden
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
          </Button>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Lưu loại hàng
          </Button>
        </form>
      </Box>

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
          Thêm loại hàng thành công!
        </Alert>
      </Snackbar>

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
          {errorMessage}
        </Alert>
      </Snackbar>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default FormOrig;
