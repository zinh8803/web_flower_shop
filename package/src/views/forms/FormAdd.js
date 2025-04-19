import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const FormAddProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");
  const [originId, setOriginId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [urlImage, setUrlImageFile] = useState(null);

  const [origins, setOrigins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [priceError, setPriceError] = useState("");
  const [inventoryError, setInventoryError] = useState("");

  useEffect(() => {


    const fetchData = async () => {
      try {
        const [categoriesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/categories"),
        ]);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setPriceError("Giá không thể là số âm");
    } else {
      setPriceError("");
    }
    setPrice(value);
  };

  const handleInventoryChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setInventoryError("Số lượng không thể là số âm");
    } else {
      setInventoryError("");
    }
    setInventory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!urlImage) {
      setErrorMessage("Vui lòng chọn hình ảnh.");
      return;
    }

    if (priceError || inventoryError) {
      setErrorMessage("Vui lòng sửa lỗi trước khi gửi.");
      return;
    }
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (!userDetails || !userDetails.id) {
      setErrorMessage("Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.");
      return;
    }
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    formData.append("stock", parseInt(inventory, 10));
    formData.append("employee_id", parseInt(userDetails.id));
    formData.append("category_id", parseInt(categoryId, 10));
    formData.append("image", urlImage);

    try {
      const token = sessionStorage.getItem("authToken");
      console.log("Token:", token);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
            // withCredentials: true
          },



        },
        // withCredentials: true,
      );

      if (response.status === 201) {
        toast.success("Thêm sản phẩm thành công");
        setProductName("");
        setDescription("");
        setPrice("");
        setInventory("");
        setOriginId("");
        setCategoryId("");
        setUrlImageFile(null);
        setErrorMessage("");
      }
    } catch (error) {
      // console.error("Error adding product:", error);
      // setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm.");


      console.error("Error adding product:", error);
      console.error(error.response.data);  // Log the full error response from backend
      setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
        <Typography variant="h4" gutterBottom align="center">
          Thêm sản phẩm mới
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Tên sản phẩm"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Giá"
            type="number"
            fullWidth
            value={price}
            onChange={handlePriceChange}
            sx={{ mb: 2 }}
            required
          />
          {priceError && <Alert severity="warning" sx={{ mb: 2 }}>{priceError}</Alert>}
          <TextField
            label="Số lượng"
            type="number"
            fullWidth
            value={inventory}
            onChange={handleInventoryChange}
            sx={{ mb: 2 }}
            required
          />
          {inventoryError && <Alert severity="warning" sx={{ mb: 2 }}>{inventoryError}</Alert>}

          <TextField
            label="Loại hàng"
            select
            fullWidth
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="">Chọn loại hàng</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
            Chọn hình ảnh
            <input
              type="file"
              hidden
              onChange={(e) => setUrlImageFile(e.target.files[0])}
              required
            />
          </Button>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Lưu sản phẩm
          </Button>
        </form>
      </Box>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default FormAddProduct;
