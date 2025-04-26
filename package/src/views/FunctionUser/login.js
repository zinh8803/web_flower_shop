import React, { useState } from "react";
import { TextField, Button, Alert, Box, Typography, CircularProgress, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email: userName,
                password: password
            });
            const user = response.data.data;
            const accessToken = response.headers['authorization'] ? response.headers['authorization'].split(' ')[1] : '';
            const expiresIn = response.headers['expiresin'] || '';

            console.log("Đăng nhập thành công!");
            console.log("Token:", accessToken);
            console.log("ExpiresIn:", expiresIn);
            console.log("Customer:", user);

            if (user) {
                sessionStorage.setItem("user", JSON.stringify(user));
                navigate("/");
                window.location.reload();
            } else {
                setErrorMessage("Username hoặc Password không đúng");
            }
        } catch (error) {
            setErrorMessage(`Có lỗi xảy ra khi đăng nhập: ${error.response ? error.response.data : error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#FFFFFF",
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: "#D84315", fontWeight: "bold" }}>
                    Đăng Nhập
                </Typography>
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form onSubmit={handleLogin}>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ py: 1.2 }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Đăng Nhập"}
                    </Button>
                </form>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" style={{ color: "#D84315", textDecoration: "none" }}>
                            Đăng ký ngay
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
