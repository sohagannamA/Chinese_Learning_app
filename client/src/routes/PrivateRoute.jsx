import { Navigate } from "react-router-dom";
import TimeTracker from "../components/TimeTracker";

export default function PrivateRoute({ children }) {
  const userId = localStorage.getItem("userId");

  // যদি user login না থাকে → login page এ redirect
  if (!userId) return <Navigate to="/login" replace />;

  // যদি login থাকে → children render + background timer
  return (
    <>
      <TimeTracker />
      {children}
    </>
  );
}
