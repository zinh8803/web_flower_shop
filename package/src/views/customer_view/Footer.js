import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#599eeb",
        color: "white",
        py: 4,
        mt: 5,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Cột Thông Tin Liên Hệ */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: "#4f83cc", mb: 2 }}>
              Liên Hệ
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1 }} />
              230B Võ Thị Sáu, Quận 3, TP.HCM
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1 }} />
              Điện thoại: 028 7300 2010
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              <Email sx={{ mr: 1 }} />
              Email: support@company.com
            </Typography>
          </Grid>

          {/* Cột Liên Kết Nhanh */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: "#4f83cc", mb: 2 }}>
              Liên Kết Nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Trang Chủ
              </Link>
              <Link
                to="/product"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Sản Phẩm
              </Link>
              <Link
                to="/about"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Giới Thiệu
              </Link>
              <Link
                to="/contact"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Liên Hệ
              </Link>
            </Box>
          </Grid>

          {/* Cột Mạng Xã Hội */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" sx={{ color: "#4f83cc", mb: 2 }}>
              Kết Nối Với Chúng Tôi
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "#4f83cc" }} />

        {/* Bản Quyền */}
        <Box textAlign="center">
          <Typography variant="body2" sx={{ color: "gray" }}>
            &copy; {new Date().getFullYear()} Công ty ABC. Mọi quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
