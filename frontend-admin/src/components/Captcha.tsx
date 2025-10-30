// react-simple-captcha component
import { useEffect } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

import { Input } from "./ui/shadcn/input";
import { Button } from "./ui/shadcn/button";
import { CheckIcon } from "lucide-react";

type CaptchaProps = {
  captchaInputRef?: React.RefObject<HTMLInputElement | null>;
  setCaptchaValidated: React.Dispatch<
    React.SetStateAction<boolean | (() => boolean)>
  >;
};

export default function Captcha({
  captchaInputRef,
  setCaptchaValidated,
}: CaptchaProps) {
  const unvisibleCharacter: string = "‎ ‎ ‎ "; // to avoid the reload button being too close to the input field

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const submitCaptcha = () => {
    const inputValue = captchaInputRef?.current?.value || "";
    if (validateCaptcha(inputValue)) {
      setCaptchaValidated(true);
    } else {
      setCaptchaValidated(false);
    }
    loadCaptchaEnginge(6);
  };

  return (
    <div>
      {/* <LoadCanvasTemplate /> */}
      <div className="flex gap-2 rounded-xl border-1 border-gray-200 p-2 pt-4">
        <LoadCanvasTemplate
          reloadText={unvisibleCharacter + "Changer le code"}
          reloadColor="gray"
        />
        <div className="flex md:gap-3">
          <Input
            ref={captchaInputRef}
            id="captcha"
            name="captcha"
            placeholder="...code"
            autoComplete="off"
            className="max:w-[150px] bg-white sm:w-[200px]"
          />
          <Button
            onClick={submitCaptcha}
            size={"icon"}
            variant={"outline"}
            type="submit"
          >
            <CheckIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
