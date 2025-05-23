import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query") || "";

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get("http://127.0.0.1:8000/api/products");
        const categoryRes = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        );

        setProducts(productRes.data.data || []);
        setCategories(categoryRes.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_id)
      );
    }


    return filtered;
  }, [products, searchQuery, selectedCategories, selectedOrigins]);

  const handleCategoryChange = (e) => {
    const categoryId = Number(e.target.value);
    setSelectedCategories((prev) =>
      e.target.checked
        ? [...prev, categoryId]
        : prev.filter((id) => id !== categoryId)
    );
  };





  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setSnackbarMessage(`${product.name} đã được thêm vào giỏ hàng!`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bộ lọc sản phẩm
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Loại sản phẩm
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        value={category.id}
                        onChange={handleCategoryChange}
                      />
                    }
                    label={category.name}
                  />
                ))}
              </Box>
            </Box>


          </Paper>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Grid container spacing={2}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      sx={{
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={(product.image_url)}
                        alt={product.name}
                        sx={{ height: 180, objectFit: "contain" }}
                      />
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {product.name}
                        </Typography>
                        <Typography variant="h6" color="error">
                          {product.final_price.toLocaleString()}đ
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tồn kho: {product.stock} sản phẩm
                        </Typography>
                      </CardContent>
                      {product.stock > 0 ? (
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          fullWidth
                          disabled
                        >
                          Hết hàng
                        </Button>
                      )}
                    </Card>
                  </Link>
                </Grid>
              ))
            ) : (
              <Typography
                variant="h6"
                sx={{ width: "100%", textAlign: "center" }}
              >
                Không có sản phẩm nào phù hợp.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductList;
