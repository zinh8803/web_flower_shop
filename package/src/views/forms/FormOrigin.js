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

const FormOrigin = () => {
  const [originName, setOriginName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingOrigins, setExistingOrigins] = useState([]);

  useEffect(() => {
    const fetchOrigins = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/XuatXu");
        setExistingOrigins(response.data || []); // Save existing origins to state
      } catch (error) {
        console.error("Error fetching origins:", error);
      }
    };
    fetchOrigins();
  }, []);

  const checkOriginExists = (name) => {
    return existingOrigins.some(
      (origin) => origin.tenXuatXu.toLowerCase() === name.toLowerCase()
    );
  };

  const handleSubmitOrigin = async (e) => {
    e.preventDefault();

    // Input validation
    if (!originName.trim()) {
      setErrorMessage("Vui lòng nhập tên nguồn gốc.");
      return;
    }

    if (checkOriginExists(originName)) {
      setErrorMessage("Nguồn gốc này đã tồn tại.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/api/XuatXu",
        `"${originName}"`, // Send as a JSON string
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Thêm nguồn gốc sản phẩm thành công!");
        setOriginName("");
        setErrorMessage("");
        // Refresh the origins list
        setExistingOrigins((prev) => [
          ...prev,
          { tenXuatXu: originName, idXuatXu: response.data.idXuatXu },
        ]);
      }
    } catch (error) {
      console.error("Error adding origin:", error);
      setErrorMessage("Có lỗi xảy ra khi thêm nguồn gốc sản phẩm.");
      toast.error("Thêm thất bại.");
    }
  };

  return (
    <div className="mt-4">
      <h4>Thêm Nguồn Gốc Sản Phẩm</h4>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Form onSubmit={handleSubmitOrigin}>
        <FormGroup row>
          <Label for="originName" sm={2}>
            Tên nguồn gốc
          </Label>
          <Col sm={10}>
            <Input
              id="originName"
              name="originName"
              placeholder="Nhập tên nguồn gốc"
              type="text"
              value={originName}
              onChange={(e) => {
                setOriginName(e.target.value);
                setErrorMessage(""); // Clear error message while typing
              }}
              required
            />
          </Col>
        </FormGroup>
        <Button className="btn btn-success">Lưu</Button>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default FormOrigin;
