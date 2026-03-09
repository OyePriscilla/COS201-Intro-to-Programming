import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;