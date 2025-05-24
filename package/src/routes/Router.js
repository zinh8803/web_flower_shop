import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../views/FunctionUser/ProtectedRoute";
import { element } from "prop-types";
import FormPositionUD from "../views/forms/FormPosition.js";
import Calendar from "../views/forms/FormSchedules.js";
import FormPosition from "../views/forms/FormthemPosition.js";
import { Logout } from "@mui/icons-material";
import Logout11 from "../views/forms/logoutadmin.js";
/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const UserLayout = lazy(() => import("../layouts/UserLayout.js"));

/***** Pages ****/
const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const OrderManagement = lazy(() => import("../views/ui/OrderManagement"));
const ProductList = lazy(() => import("../views/forms/test.js"));
const EmployeeManagement = lazy(() => import("../views/ui/EmployeeManagement.js"));
const ProductManagement = lazy(() => import("../views/ui/ProductManagement.js"));
const Giaohang = lazy(() => import("../views/ui/giaohang.js"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/forms/Forms.js"));
const History = lazy(() => import("../views/forms/history.js"));
const FormSP = lazy(() => import("../views/forms/FormSP.js"));
const FormAdd = lazy(() => import("../views/forms/FormAdd.js"));
const Header = lazy(() => import("../views/customer_view/Header.js"));
const Footer = lazy(() => import("../views/customer_view/Footer.js"));
const FormCate = lazy(() => import("../views/forms/FormCate.js"));
const FormOrigin = lazy(() => import("../views/forms/FormOrigin.js"));
const FormOriginUD = lazy(() => import("../views/forms/FormOriginUD.js"));
const Banner = lazy(() => import("../views/customer_view/Banner.js"));
const Login = lazy(() => import("../views/FunctionUser/login.js"));
const Register = lazy(() => import("../views/FunctionUser/register.js"));
const UserContext = lazy(() => import("../views/forms/UserContext.js"));
const UpdateUser = lazy(() => import("../views/forms/UpdateUser.js"));
const Orderlist = lazy(() => import("../views/forms/orderlist.js"));
const DeliveryReceiptPage = lazy(() => import("../views/forms/listgiaohang.js"));
const OrderDetailPage = lazy(() => import("../views/forms/OrderDetailPage.js"));
const Contact = lazy(() => import("../views/forms/Contacts.js"));
const CartPage = lazy(() => import("../views/ui/cartpage.js"));
const OderPage = lazy(() => import("../views/ui/OrderPage.js"));
const CreatePayment = lazy(() => import("../views/ui/createPayment.js"));
const PaymentCallbackVnpay = lazy(() => import("../views/ui/PaymentCallbackVnpay.js"));
const ProductDetailPage = lazy(() => import("../views/forms/ProductDetail.js"));
const AdminLogin = lazy(() => import("../views/FunctionUser/AdminLogin.js"));
const ThanhphanManagement = lazy(() => import("../views/forms/formthanhphan.js"));
const ThemeRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", element: <Starter /> },
      { path: "/Header", element: <Header /> },
      { path: "/Banner", element: <Banner /> },
      { path: "/Login", element: <Login /> },
      { path: "/Register", element: <Register /> },
      { path: "/product", element: <ProductList /> },
      { path: "/UserContext", element: <UserContext /> },
      { path: "/updateuser", element: <UpdateUser /> },
      { path: "/cartpage", element: <CartPage /> },
      { path: "/products/:productId", element: <ProductDetailPage /> },
      { path: "/footer", element: <Footer /> },
      { path: "/cartpage/orderpage", element: <OderPage /> },
      { path: "/PaymentCallbackVnpay", element: <PaymentCallbackVnpay /> },
      { path: "/payment", element: <CreatePayment /> },
      { path: "/orderhistory", element: <History /> },
      { path: "orderhistory/:idDonHang", element: <OrderDetailPage /> },
      { path: "/Contact", element: <Contact /> },
    ],
  },
  {
    path: "/admin",
    element: <FullLayout />,
    children: [
      { path: "about", element: <About /> },
      {
        path: "OrderManagement",
        element: (
          <ProtectedRoute>
            <OrderManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "EmployeeManagement",
        element: (
          <ProtectedRoute>
            <EmployeeManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "ProductManagement",
        element: (
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "chucvu&lichtrinh",
        element:
          <ProtectedRoute>
            <Giaohang />
          </ProtectedRoute>

      },

      { path: "cards", element: <Cards /> },
      { path: "grid", element: <Grid /> },
      { path: "table", element: <Tables /> },
      { path: "forms", element: <Forms /> },
      { path: "test", element: <ProductList /> },
      { path: "formSP", element: <FormSP /> },
      { path: "formAdd", element: <FormAdd /> },
      { path: "formCate", element: <FormCate /> },
      { path: "formOrigin", element: <FormOrigin /> },
      { path: "formOriginUD", element: <FormOriginUD /> },
      { path: "login", element: <AdminLogin /> },
      
      { path: "chucvu", element: <FormPositionUD /> },
      { path: "themchucvu", element: <FormPosition /> },
      { path: "lichtrinh", element: <Calendar /> },
      { path: "logout", element: <Logout11 /> }
    ],
  },
];


export default ThemeRoutes;
