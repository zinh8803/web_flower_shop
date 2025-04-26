import { useState, useEffect } from "react";
import {
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormSchedule = () => {
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [shifts, setShifts] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/employees",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setEmployees(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
        fetchEmployees();
    }, []);

    const handleCheckboxChange = (day) => {
        if (daysOfWeek.includes(day)) {
            setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
            const newShifts = { ...shifts };
            delete newShifts[day];
            setShifts(newShifts);
        } else {
            setDaysOfWeek([...daysOfWeek, day]);
        }
    };

    const handleShiftChange = (day, value) => {
        setShifts({ ...shifts, [day]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId || !startDate || !endDate || daysOfWeek.length === 0) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const payload = {
            employee_id: parseInt(employeeId),
            start_date: startDate,
            end_date: endDate,
            day_of_week: daysOfWeek.map(Number),
            shift: shifts,
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/schedules", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Tạo lịch trình thành công!");
                setEmployeeId("");
                setStartDate("");
                setEndDate("");
                setDaysOfWeek([]);
                setShifts({});
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Error creating schedule:", error);
            setErrorMessage("Có lỗi xảy ra khi tạo lịch trình.");
            toast.error("Thêm lịch trình thất bại.");
        }
    };

    return (
        <div className="mt-4">
            <h4>Thêm Lịch Trình Nhân Viên</h4>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <Form onSubmit={handleSubmit}>
                {/* Select Employee */}
                <FormGroup row>
                    <Label for="employee" sm={2}>
                        Nhân viên
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            id="employee"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn nhân viên --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.position?.name})
                                </option>
                            ))}
                        </Input>
                    </Col>
                </FormGroup>

                {/* Start Date */}
                <FormGroup row>
                    <Label for="startDate" sm={2}>
                        Ngày bắt đầu
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </Col>
                </FormGroup>

                {/* End Date */}
                <FormGroup row>
                    <Label for="endDate" sm={2}>
                        Ngày kết thúc
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </Col>
                </FormGroup>

                {/* Days of week and Shifts */}
                <FormGroup>
                    <Label>Chọn ngày trong tuần:</Label>
                    <div className="d-flex flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                            <div key={day} style={{ marginRight: "15px" }}>
                                <Input
                                    type="checkbox"
                                    id={`day-${day}`}
                                    checked={daysOfWeek.includes(day)}
                                    onChange={() => handleCheckboxChange(day)}
                                />
                                <Label for={`day-${day}`} style={{ marginLeft: "5px" }}>
                                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][day - 1]}
                                </Label>
                                {daysOfWeek.includes(day) && (
                                    <Input
                                        type="select"
                                        value={shifts[day] || ""}
                                        onChange={(e) => handleShiftChange(day, e.target.value)}
                                        className="mt-1"
                                    >
                                        <option value="">-- Ca --</option>
                                        <option value="morning">Sáng</option>
                                        <option value="afternoon">Chiều</option>
                                        <option value="full_day">Cả ngày</option>
                                    </Input>
                                )}
                            </div>
                        ))}
                    </div>
                </FormGroup>

                <Button color="success">Lưu</Button>
            </Form>

            <ToastContainer />
        </div>
    );
};

export default FormSchedule;
