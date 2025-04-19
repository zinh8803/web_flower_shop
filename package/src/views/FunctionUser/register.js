import React, { useState } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    Container,
} from "@mui/material";
import { Link } from "react-router-dom";

const Register = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu và mật khẩu xác nhận không khớp.");
            setSuccessMessage("");
            return;
        }

        const payload = {
            taiKhoan: userName,
            matkhau: password,
            email: email || "",
        };

        try {
            const response = await axios.post(
                "http://localhost:7000/api/Khachhang/register",
                payload
            );

            if (response.status === 200) {
                setSuccessMessage("Đăng ký thành công!");
                setErrorMessage("");
                setUserName("");
                setPassword("");
                setConfirmPassword("");
                setEmail("");
            }
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage("Đăng ký thất bại. Vui lòng thử lại.");
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
                    sx={{ color: "#388E3C", fontWeight: "bold" }}
                >
                    Đăng Ký Tài Khoản
                </Typography>

                {/* Hiển thị thông báo lỗi hoặc thành công */}
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Tên đăng nhập"
                        margin="normal"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Xác nhận mật khẩu"
                        type="password"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{ mt: 2, py: 1.2 }}
                    >
                        Đăng Ký
                    </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography>
                        Đã có tài khoản?{" "}
                        <Link
                            to="/login"
                            style={{
                                color: "#388E3C",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }}
                        >
                            Đăng nhập ngay
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
