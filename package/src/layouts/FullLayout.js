import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Container } from "reactstrap";

const FullLayout = () => {
  return (
    <main>
      {/********header**********/}
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        <div className="contentArea">
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
