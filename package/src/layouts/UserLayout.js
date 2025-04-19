import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import Header from "../views/customer_view/Header";
import Banner from "../views/customer_view/Banner";
import ProductList from "../views/forms/test";
import Footer from "../views/customer_view/Footer";

const UserLayout = () => {
    return (
        <main>

            {/********header**********/}
            <Header />
            <div className="">
                <Banner />
                {/********Content Area**********/}
                <div className="contentArea">

                    <Container className="p-4" fluid>
                        <Outlet />
                    </Container>
                </div>
                <Footer />
            </div>
        </main>
    );
};

export default UserLayout;