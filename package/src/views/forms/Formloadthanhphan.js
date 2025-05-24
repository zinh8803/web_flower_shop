import React, { useState, useEffect } from "react";
import {
    Container,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    Paper,
    Avatar,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ThanhphanManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/ingredients");
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleEdit = (category) => {
        console.log("Đang sửa loại hàng:", category);
        setSelectedCategory(category);
        setCategoryName(category.description);
        setModalOpen(true);
    };


    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setConfirmDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/categories/${selectedCategory.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
                    },
                }

            );
            toast.success("Xóa loại hàng thành công!");
            fetchCategories();
            setConfirmDeleteModal(false);
        } catch (error) {
            setErrorMessage("Có lỗi xảy ra khi xóa loại hàng.");
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedCategory((prev) => ({
                ...prev,
                newImage: file,
            }));
        }
    };
    const handleSubmit = async (e) => {
        const formData = new FormData();
        formData.append("id", selectedCategory.id);
        formData.append("name", categoryName);
        formData.append("employee_id", parseInt(userDetails.id));

        if (selectedCategory.newImage) {
            formData.append("image", selectedCategory.newImage);
        }
        console.log("Form data chuẩn bị gửi:");
        e.preventDefault();
        if (!categoryName) {
            setErrorMessage("Tên loại hàng không thể trống.");
            return;
        }
        const token = sessionStorage.getItem("authToken");
        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/categories/${selectedCategory.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("Phản hồi từ server:", res.data);
            toast.success("Sửa loại hàng thành công!");
            fetchCategories();
            setModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi gọi API sửa:", error);
            setErrorMessage("Có lỗi xảy ra khi sửa loại hàng.");
        }
    }; const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));


    return (
        <Container maxWidth="md-6" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Quản lý loại hàng
            </Typography>

            <ToastContainer />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên thành phần</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.description}</TableCell>

                                {/* <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => handleEdit(category)}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteClick(category)}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Sửa loại hàng
                    </Typography>
                    {errorMessage && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Tên loại hàng"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mt: 2 }}
                        >
                            Upload Image
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        <Box sx={{ textAlign: "right" }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                                Lưu thay đổi
                            </Button>
                            <Button variant="contained" onClick={() => setModalOpen(false)}>
                                Hủy
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal open={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Xác nhận xóa
                    </Typography>
                    <Typography>
                        Bạn chắc chắn muốn xóa loại hàng <strong>{selectedCategory?.tenLoaiHangHoa}</strong>?
                    </Typography>
                    <Box sx={{ textAlign: "right", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ mr: 1 }}
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                        <Button variant="contained" onClick={() => setConfirmDeleteModal(false)}>
                            Hủy
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default ThanhphanManagement;
