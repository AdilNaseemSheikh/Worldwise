import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // if we do not return null, then children will be returned before effect runs cuz
  // jsx is returned before effects runs and one of children is causing some problem is returned before effect
  //  EFFECT ONLY EXECUTED WHEN RENDER HAS HAPPENED

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
