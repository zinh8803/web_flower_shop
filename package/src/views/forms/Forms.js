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
import axios from "axios";

const FormOrig = () => {
  const [categoryName, setCategoryName] = useState("");
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

    try {
      const response = await axios.post(
        `http://localhost:7000/api/LoaiHangHoa?loaiHangHoa=${encodeURIComponent(
          categoryName
        )}`
      );
      if (response.status === 200 || response.status === 201) {
        setCategoryName("");
        setSuccessSnackbar(true);
      }
    } catch (error) {
      if (error.response) {
        // If server returns an error
        setErrorMessage(
          error.response.data?.message || "Thêm loại hàng thất bại. Vui lòng thử lại."
        );
      } else if (error.request) {
        // If no response received
        setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        // Other errors
        setErrorMessage("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
      setErrorSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm-5" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Thêm Loại Hàng
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Tên loại hàng"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            variant="outlined"
            required
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ py: 1 }}
        >
          Lưu
        </Button>
      </form>

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
          Thêm loại hàng thành công!
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
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FormOrig;
