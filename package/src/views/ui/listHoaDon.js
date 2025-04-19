import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, PaginationItem, PaginationLink, Spinner } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('http://localhost:7000/api/HoaDon/all');
                const data = await response.json();
                setInvoices(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const pageCount = Math.ceil(invoices.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentInvoices = invoices.slice(offset, offset + itemsPerPage);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Danh sách hoá đơn</h2>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner color="primary" />
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center text-muted py-5">
                    Không có hoá đơn nào để hiển thị.
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive className="mb-4">
                        <thead className="thead-light">
                            <tr>
                                <th>Mã hoá đơn</th>
                                <th>Tổng tiền</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày tạo</th>
                                <th>Mã đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentInvoices.map((invoice) => (
                                <tr key={invoice.maHoaDon}>
                                    <td>{invoice.maHoaDon}</td>
                                    <td>{formatCurrency(invoice.tongtien)}</td>
                                    <td>{invoice.phuongThucThahtoan}</td>
                                    <td>{formatDate(invoice.ngayTao)}</td>
                                    <td>{invoice.maDonHang}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted">
                            Hiển thị {offset + 1} - {Math.min(offset + itemsPerPage, invoices.length)} trong {invoices.length} hoá đơn
                        </div>
                        <Pagination>
                            <PaginationItem disabled={currentPage <= 0}>
                                <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
                            </PaginationItem>
                            {[...Array(pageCount)].map((_, index) => (
                                <PaginationItem active={index === currentPage} key={index}>
                                    <PaginationLink onClick={() => setCurrentPage(index)}>{index + 1}</PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem disabled={currentPage >= pageCount - 1}>
                                <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
                            </PaginationItem>
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoiceTable;
