import { ForgotPasswordForm } from "@/components/forgot-pw-login-form";
import { Button } from "@/components/ui/shadcn/button";
import { XIcon } from "lucide-react";
import { useState } from "react";

type ForgotPasswordProps = {
  onPasswordForgotten: () => void;
  handleAlert: () => void;
};

export default function ForgotPassword({
  onPasswordForgotten,
  handleAlert,
}: ForgotPasswordProps) {
  const [isRobotChecked, setRobotChecked] = useState(false);

  const handleRobotCheck = () => setRobotChecked((prev) => !prev);

  return (
    <div className="relative flex justify-center">
      {/* close button */}
      <Button
        onClick={onPasswordForgotten}
        size={"icon"}
        variant={"outline"}
        className="bg-white2 absolute end-0 top-[-15px] cursor-auto rounded-full bg-white"
      >
        <XIcon />
      </Button>

      {/* Form */}
      <ForgotPasswordForm
        className="w-[90vw]"
        isRobotChecked={isRobotChecked}
        onRobotCheck={handleRobotCheck}
        handleAlert={handleAlert}
        onPasswordForgotten={onPasswordForgotten}
      />
    </div>
  );
}
