import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormPositionUD = () => {
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [positionName, setPositionName] = useState("");
    const [positionDescription, setPositionDescription] = useState("");
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        const token = sessionStorage.getItem("authToken");

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/positions", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setPositions(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách chức vụ:", error);
        }
    };

    const handleEdit = (position) => {
        setSelectedPosition(position);
        setPositionName(position.name);
        setPositionDescription(position.description || "");
        setModalOpen(true);
    };

    const handleDeleteClick = (position) => {
        setSelectedPosition(position);
        setConfirmDeleteModal(true);
    };

    const handleDelete = async () => {
        const token = sessionStorage.getItem("authToken");
        try {
            await axios.delete(`http://127.0.0.1:8000/api/positions/${selectedPosition.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Xóa chức vụ thành công!");
            fetchPositions();
            setConfirmDeleteModal(false);
        } catch (error) {
            setErrorMessage("Có lỗi xảy ra khi xóa chức vụ.");
            console.error("Lỗi khi xóa chức vụ:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("authToken");

        if (!positionName.trim()) {
            setErrorMessage("Tên chức vụ không được để trống.");
            return;
        }
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/positions/${selectedPosition.id}`,
                {
                    name: positionName,
                    description: positionDescription,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Cập nhật chức vụ thành công!");
                setModalOpen(false);
                fetchPositions();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Có lỗi khi cập nhật chức vụ.";
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div>
            <h4>Quản lý chức vụ</h4>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <Table striped>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên chức vụ</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((position) => (
                        <tr key={position.id}>
                            <td>{position.id}</td>
                            <td>{position.name}</td>
                            <td>{position.description || "Không có mô tả"}</td>
                            <td>
                                <Button color="warning" onClick={() => handleEdit(position)} className="me-2">
                                    Sửa
                                </Button>
                                <Button color="danger" onClick={() => handleDeleteClick(position)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Edit Modal */}
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
                <ModalHeader toggle={() => setModalOpen(false)}>Sửa chức vụ</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="positionName">Tên chức vụ</Label>
                            <Input
                                id="positionName"
                                type="text"
                                value={positionName}
                                onChange={(e) => setPositionName(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="positionDescription">Mô tả</Label>
                            <Input
                                id="positionDescription"
                                type="text"
                                value={positionDescription}
                                onChange={(e) => setPositionDescription(e.target.value)}
                            />
                        </FormGroup>
                        <ModalFooter>
                            <Button color="primary" type="submit">
                                Lưu thay đổi
                            </Button>{" "}
                            <Button color="secondary" onClick={() => setModalOpen(false)}>
                                Hủy
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={confirmDeleteModal} toggle={() => setConfirmDeleteModal(false)}>
                <ModalHeader toggle={() => setConfirmDeleteModal(false)}>Xác nhận xóa chức vụ</ModalHeader>
                <ModalBody>
                    Bạn chắc chắn muốn xóa chức vụ <strong>{selectedPosition?.name}</strong> không?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDelete}>
                        Xóa
                    </Button>{" "}
                    <Button color="secondary" onClick={() => setConfirmDeleteModal(false)}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default FormPositionUD;
