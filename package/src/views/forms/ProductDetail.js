import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

function ProductDetailPage() {
  const { productId } = useParams(); // Retrieve productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [origins, setOrigins] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const isLoggedIn = !!userData;

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}`);
        setProduct(response.data.data);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories");
        setCategories(response.data.data);
      } catch (err) {
        console.error("Lỗi khi gọi API loại sản phẩm:", err);
      }
    };

    // Fetch origins


    fetchProductDetails();
    fetchCategories();
  }, [productId]);



  const addToCart = (product) => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
      toast.success("Đã tăng số lượng sản phẩm trong giỏ hàng.");
    } else {
      cart.push({ ...product, quantity: 1 });
      toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  if (!product)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="textSecondary">
          Không tìm thấy sản phẩm.
        </Typography>
      </Box>
    );

  return (
    <Grid container justifyContent="center" padding={3}>
      <ToastContainer />
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          {/* Product Image */}
          <CardMedia
            component="img"
            alt={product.name}
            height="400"
            image={(product.image_url)}
            sx={{
              height: "400px",
              width: "100%",
              objectFit: "contain",
              backgroundColor: "#f5f5f5",
            }}
          />

          <CardContent>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {product.final_price} VND
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Mô tả: </strong>
              {product.description}
            </Typography>

            <Box display="flex" gap={1} marginBottom={2}>
              {/* <Chip
                label={
                  categories.find((category) => category.id === product.id)
                    ?.name || "Không rõ"
                }
                color="info"
                variant="outlined"
              /> */}

            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: "center", padding: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProductDetailPage;
