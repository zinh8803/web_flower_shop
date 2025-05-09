import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Container,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

function Header() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Lấy token string, KHÔNG cần parse

    if (token) {
      axios
        .get(`http://127.0.0.1:8000/api/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setUser(response.data.data))
        .catch((error) => {
          console.error("Có lỗi khi lấy thông tin người dùng:", error);
          // Nếu lỗi 401 (token hết hạn, sai), thì xóa luôn token
          if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("token");
            navigate("/login");
          }
        });
    }

    // Lấy số lượng giỏ hàng từ localStorage
    const getCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalItems);
      }
    };
    getCartCount();
    window.addEventListener("storage", getCartCount);

    return () => {
      window.removeEventListener("storage", getCartCount);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("cart");
    sessionStorage.removeItem("token"); // <-- Đúng là phải xóa token
    setUser(null);
    setCartCount(0);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/product?query=${searchQuery}`);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#f0f4f8", color: "black" }}>
      <Container>
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Flower Shop
          </Typography>

          {/* Thanh tìm kiếm */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", mr: 3 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>
              <SearchIcon />
            </Button>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button component={Link} to="/" color="inherit">
              Trang Chủ
            </Button>
            <Button component={Link} to="/product" color="inherit">
              Sản Phẩm
            </Button>
            <Button component={Link} to="/contact" color="inherit">
              Liên Hệ
            </Button>

            {/* Giỏ hàng */}
            {user && (
              <IconButton component={Link} to="/cartpage" color="inherit">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}

            {/* Dropdown khi đăng nhập */}
            {user ? (
              <Box>
                <Tooltip title={user?.name || "Tài khoản"}>
                  <IconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { width: 200 } }}
                >
                  <MenuItem onClick={() => navigate("/updateuser")}>
                    Chỉnh sửa thông tin
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/orderhistory")}>
                    Lịch sử mua hàng
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button component={Link} to="/login" color="inherit">
                Đăng Nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
