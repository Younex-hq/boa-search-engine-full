import { useState } from "react";

import { LoginForm } from "@/components/login-form";
import ForgotPassword from "./ForgotPassword";
import LoginAlert from "@/components/LoginAlert";

export default function Login() {
  const [isPasswordForgotten, setIsPasswordForgotten] = useState(false);

  const handlePasswordForgotten = () => setIsPasswordForgotten((prev) => !prev);

  const [showAlert, setShowAlert] = useState(false);
  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center gap-10">
      {showAlert && <LoginAlert />}
      {!isPasswordForgotten ? (
        <div className="w-sm translate-y-[-20%] p-5 sm:p-0">
          <LoginForm onPasswordForgotten={handlePasswordForgotten} />
        </div>
      ) : (
        <div className="w-sm translate-y-[-20%] md:w-[30rem]">
          <ForgotPassword
            handleAlert={handleAlert}
            onPasswordForgotten={handlePasswordForgotten}
          />
        </div>
      )}
    </div>
  );
}
