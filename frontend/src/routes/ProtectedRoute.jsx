import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sends signed-out visitors to /login, and users without the required role
// back to their dashboard.
export default function ProtectedRoute({ role, children }) {
  const { user, loggedOut } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={loggedOut ? null : { from: location.pathname }}/>;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace/>;
  return children;
}
