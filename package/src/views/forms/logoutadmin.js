import { useEffect } from "react";

const Logout11 = () => {
    useEffect(() => {
        sessionStorage.clear();


        window.location.href = "/admin/login";
    }, []);

    return null;
};

export default Logout11;
