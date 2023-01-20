import { Navigate } from "react-router-dom";
import useParentAuth from "../context/auth/useParentAuth";

const ParentPrivateRoutes = ({ children }) => {
  const { parent, parentAuthUser } = useParentAuth();

  if (parent === null || parent === undefined)
    return <Navigate to={"/route-not-found"} />;

  return children;
};

export default ParentPrivateRoutes;
