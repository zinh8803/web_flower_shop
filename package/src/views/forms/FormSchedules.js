import React, { useState, useEffect } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Calendar = () => {
    const [schedules, setSchedules] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = sessionStorage.getItem("authToken");

        try {
            const [schedulesRes, employeesRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/schedules", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://127.0.0.1:8000/api/employees", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setSchedules(schedulesRes.data.data || []);
            setEmployees(employeesRes.data.data || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setErrorMessage("Không thể tải dữ liệu lịch trình.");
        }
    };

    const formatShift = (shift) => {
        switch (shift) {
            case "morning":
                return "Sáng";
            case "afternoon":
                return "Chiều";
            case "full_day":
                return "Cả ngày";
            default:
                return shift;
        }
    };

    const handleEdit = (schedule) => {
        setSelectedEvent(schedule);
        setTitle(schedule.shift || "");
        setDescription(schedule.description || "");
        setDate(schedule.start_date || "");
        setModalOpen(true);
    };

    const handleDeleteClick = (schedule) => {
        setSelectedEvent(schedule);
        setConfirmDeleteModal(true);
    };

    const handleDelete = async () => {
        const token = sessionStorage.getItem("authToken");
        try {
            await axios.delete(`http://127.0.0.1:8000/api/schedules/${selectedEvent.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Xóa lịch trình thành công!");
            fetchData();
            setConfirmDeleteModal(false);
        } catch (error) {
            setErrorMessage("Có lỗi xảy ra khi xóa lịch trình.");
            console.error("Lỗi khi xóa lịch trình:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !date) {
            setErrorMessage("Ca làm và ngày không được để trống.");
            return;
        }

        const token = sessionStorage.getItem("authToken");

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/schedules/${selectedEvent.id}`,
                {
                    shift: title,
                    start_date: date,
                    employee_id: selectedEvent.employee_id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Cập nhật lịch trình thành công!");
                setModalOpen(false);
                fetchData();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Có lỗi khi cập nhật lịch trình.";
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div>
            <h4>📅 Danh sách lịch làm việc theo nhân viên</h4>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {schedules.map((empSchedule) => {
                const employee = employees.find((emp) => emp.id === empSchedule.employee_id) || {};

                return (
                    <div key={empSchedule.employee_id} style={{ marginBottom: "2rem" }}>
                        <h5>👤 {employee.name || `Nhân viên ID: ${empSchedule.employee_id}`}</h5>
                        <ul>
                            <li><strong>ID:</strong> {empSchedule.employee_id}</li>
                            {employee.email && <li><strong>Email:</strong> {employee.email}</li>}
                            {employee.phone && <li><strong>SĐT:</strong> {employee.phone}</li>}
                            {employee.address && <li><strong>Địa chỉ:</strong> {employee.address}</li>}
                        </ul>

                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Ngày</th>
                                    <th>Ca làm</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empSchedule.schedules.length > 0 ? (
                                    empSchedule.schedules.map((sch) => (
                                        <tr key={sch.id}>
                                            <td>{sch.id}</td>
                                            <td>{new Date(sch.start_date).toLocaleDateString("vi-VN")}</td>
                                            <td>{formatShift(sch.shift)}</td>
                                            <td>
                                                <Button
                                                    color="warning"
                                                    size="sm"
                                                    onClick={() => handleEdit(sch)}
                                                    className="me-2"
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(sch)}
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">Không có lịch làm việc</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                );
            })}

            {/* Modal Sửa */}
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
                <ModalHeader toggle={() => setModalOpen(false)}>Sửa lịch trình</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="title">Ca làm</Label>
                            <Input
                                id="title"
                                type="select"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            >
                                <option value="morning">Sáng</option>
                                <option value="afternoon">Chiều</option>
                                <option value="full_day">Cả ngày</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="date">Ngày</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <ModalFooter>
                            <Button color="primary" type="submit">
                                Lưu thay đổi
                            </Button>
                            <Button color="secondary" onClick={() => setModalOpen(false)}>
                                Hủy
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

            {/* Modal Xóa */}
            <Modal isOpen={confirmDeleteModal} toggle={() => setConfirmDeleteModal(false)}>
                <ModalHeader toggle={() => setConfirmDeleteModal(false)}>Xác nhận xóa</ModalHeader>
                <ModalBody>
                    {selectedEvent ? (
                        <p>
                            Bạn có chắc muốn xóa lịch làm việc ca{" "}
                            <strong>{formatShift(selectedEvent.shift)}</strong> ngày{" "}
                            <strong>{new Date(selectedEvent.start_date).toLocaleDateString("vi-VN")}</strong>{" "}
                            không?
                        </p>
                    ) : (
                        <p>Không tìm thấy lịch trình.</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                    <Button color="secondary" onClick={() => setConfirmDeleteModal(false)}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default Calendar;