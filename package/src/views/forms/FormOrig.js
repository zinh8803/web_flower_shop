import { useState } from "react";
import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    Toast,
    ToastHeader,
    ToastBody,
} from "reactstrap";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const FormOrig = () => {

    const [product, setproduct] = useState('');
    const [catagories, setcatagories] = useState('');
    const [origin, setorigin] = useState('');

    const handleSubmitCategoris = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7000/api/AddCategoriesProduct', {
                CategoryName: catagories
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }

            });
            if (response.status === 200) {
                toast.success("Thêm thành công");
            }
        } catch (error) {
            toast.error("Thêm thất bại ");

        }
    };






    return (
        <div className="mt-4">
            <Form onSubmit={(e) => { handleSubmitCategoris(e) }}>
                <FormGroup row>
                    <Label
                        for="catagories"
                        sm={2}
                    >
                        Loại hàng hoá
                    </Label>
                    <Col sm={10}>
                        <Input
                            id="catagories1"
                            name="catagories"
                            placeholder=" Loại hàng hoá"
                            type="text"
                            value={catagories}
                            onChange={(e) => setcatagories(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <Button className="btn btn-success" >
                    Lưu
                </Button>
            </Form>


        </div>
    );
};

export default FormOrig;
