import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import FormOriginUD from "../forms/FormOriginUD";
import FormCate from "../forms/FormCate";
import Forms from "../forms/Forms";
import FormSP from "../forms/FormSP";
import FormAdd from "../forms/FormAdd";
import ProductList from "../forms/test";
import axios from "axios";
import FormOrigin from "../forms/FormOrigin";

const ProductManagement = () => {
  const [cSelected, setCSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState("");

  const handleChange = (event) => {
    setCSelected(event.target.value);
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/categories");

        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [])
  console.log(categories);

  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi fs-3 bi-newspaper me-2"> </i>
          <span className="fs-3"> Quản lý hàng hoá </span>
        </CardTitle>
        <CardBody>
          <div className="mt-3">
            <Button
              className="btn btn-info"
              onClick={() => setActiveForm(activeForm === "addProduct" ? "" : "addProduct")}>
              {activeForm === "addProduct" ? "Đóng Form Thêm" : "Thêm hàng hoá"}
            </Button>
          </div>

          {activeForm === "addProduct" && <FormAdd />}
          <FormSP />
        </CardBody>
      </Card>

      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi fs-3 bi-newspaper me-2"> </i>
          <span className="fs-3"> Quản lý loại hàng </span>
        </CardTitle>
        <CardBody>
          <div className="mt-3">
            <Button
              className="btn btn-info"
              onClick={() => setActiveForm(activeForm === "addCategory" ? "" : "addCategory")}>
              {activeForm === "addCategory" ? "Đóng Form Thêm Loại" : "Thêm loại hàng"}
            </Button>

          </div>
          {activeForm === "addCategory" && <Forms />}
          <FormCate />


        </CardBody>
      </Card>


      {/* <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi fs-3 bi-newspaper me-2"> </i>
          <span className="fs-3"> Quản lý xuất xứ </span>
        </CardTitle>
        <CardBody>
          <Button
            className="btn btn-info ms-5"
            onClick={() => setActiveForm(activeForm === "addOrigin" ? "" : "addOrigin")}>
            {activeForm === "addOrigin" ? "Đóng Form Thêm Xuất Xứ" : "Thêm xuất xứ"}
          </Button>

          <FormOriginUD />
          {activeForm === "addOrigin" && <FormOrigin />}
        </CardBody>
      </Card> */}

    </div>
  );
};

export default ProductManagement;
