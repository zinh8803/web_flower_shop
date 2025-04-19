import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  return <Navigate to="/login" />;

  return children;  
};

export default ProtectedRoute;
