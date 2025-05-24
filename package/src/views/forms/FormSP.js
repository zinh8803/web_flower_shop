import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Avatar,
  Alert,
} from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [priceError, setPriceError] = useState("");

  const [inventoryError, setInventoryError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products"),
          axios.get("http://127.0.0.1:8000/api/categories"),
        ]);

        setProducts(productRes.data.data || []);
        setCategories(categoryRes.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "Unknown";
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      axios
        .delete(`http://127.0.0.1:8000/api/products/${id}`)
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
          );
          alert("Xóa sản phẩm thành công!");
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              alert("Không thể xóa sản phẩm vì ràng buộc dữ liệu.");
            } else {
              alert("Lỗi không xác định. Vui lòng thử lại.");
            }
          } else {
            alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc thử lại.");
          }
        });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenDialog(true);
    setPriceError(""); // Reset errors when opening dialog
    setInventoryError("");
  };

  const handleSave = () => {
    if (!editingProduct) return;

    if (editingProduct.price < 0) {
      setPriceError("Giá không thể là số âm");
      return;
    } else {
      setPriceError("");
    }

    if (editingProduct.stock < 0) {
      setInventoryError("Số lượng tồn kho không thể là số âm");
      return;
    } else {
      setInventoryError("");
    }

    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    const formData = new FormData();
    formData.append("id", editingProduct.id);
    formData.append("name", editingProduct.name);
    formData.append("price", editingProduct.price);
    formData.append("stock", editingProduct.stock);
    formData.append("description", editingProduct.description);
    formData.append("employee_id", parseInt(userDetails.id));
    formData.append("category_id", parseInt(editingProduct.category_id));

    if (editingProduct.newImage) {
      formData.append("image", editingProduct.newImage);
    }
    const token = sessionStorage.getItem("authToken");
    axios
      .post(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === editingProduct.id
              ? { ...editingProduct, ImageFile: editingProduct.newImage || p.image_url }
              : p
          )
        );
        setOpenDialog(false);
        alert("Sản phẩm đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "price" || name === "stock") {
      newValue = Math.max(0, parseInt(value, 10)); // Ensure non-negative
    }

    setEditingProduct((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingProduct((prev) => ({
        ...prev,
        newImage: file,
      }));
    }
  };

  if (loading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Danh sách sản phẩm
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell>Thành phần</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  {console.log('Product Image:', product.image_url)} {/* Log đường dẫn ảnh */}
                  <Avatar
                    src={product.image_url}
                    alt={product.name}
                    variant="square"
                    sx={{ width: 80, height: 80 }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price?.toLocaleString()} VND</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {product.ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                          {ingredient.description || 'Không có mô tả'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Không có thành phần'
                  )}
                </TableCell>
                {console.log('Product :', product.ingredients.description)} {/* Log đường dẫn ảnh */}
                <TableCell>{getCategoryName(product.category_id)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(product.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa sản phẩm</DialogTitle>
        <DialogContent>
          {priceError && <Alert severity="error">{priceError}</Alert>}
          {inventoryError && <Alert severity="error">{inventoryError}</Alert>}

          <TextField
            fullWidth
            margin="normal"
            label="Tên sản phẩm"
            name="name"
            value={editingProduct?.name || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mô tả"
            name="description"
            value={editingProduct?.description || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Giá"
            name="price"
            value={editingProduct?.price || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Tồn kho"
            name="stock"
            value={editingProduct?.stock || ""}
            onChange={handleInputChange}
          />
          <Select
            fullWidth
            margin="normal"
            value={editingProduct?.category_id || ""}
            name="category_id"
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary">
            Lưu
          </Button>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" color="secondary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;