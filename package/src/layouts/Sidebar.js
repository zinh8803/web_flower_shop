import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";

const navigation = [
  {
    title: "Dashboard",
    href: "about",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Quản lý  hàng hoá ",
    href: "ProductManagement",
    icon: "bi bi-flower2",
  },

  {
    title: "Quản lý đơn hàng",
    href: "OrderManagement",
    icon: "bi bi-newspaper",
  },
  {
    title: "Quản lý nhân viên ",
    href: "EmployeeManagement",
    icon: "bi  bi-person-fill",
  },
  {
    title: "chức vụ lịch trình",
    href: "chucvu&lichtrinh",
    icon: "bi  bi-person-fill",
  },
  {
    title: "Đăng xuất ",
    href: "logout",
    icon: "bi  bi-person-fill",
  },

];

const Sidebar = () => {

  let location = useLocation();

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat` }}
      >
        <div className="p-3 d-flex">
          <img src={user1} alt="user" width="50" className="rounded-circle" />

        </div>
        <div className="bg-dark text-white p-2 opacity-75">Admin</div>
      </div>
      <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}

        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
