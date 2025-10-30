import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

import Captcha from "./Captcha";

import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Button } from "@/components/ui/shadcn/button";

import { useNotificationPublic } from "@/hooks/useNotificationPublic"; // ✅ import mutation
import type { AxiosError } from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/shadcn/card";

//!  =====================================================================

type RobotCheck = {
  isRobotChecked: boolean;
  onRobotCheck: () => void;
  handleAlert: () => void;
  onPasswordForgotten: () => void;
};

export function ForgotPasswordForm({
  className,
  isRobotChecked,
  onRobotCheck,
  handleAlert,
  onPasswordForgotten,
  ...props
}: React.ComponentProps<"div"> & RobotCheck) {
  const captchaInputRef = useRef<HTMLInputElement | null>(null);
  const [captchaValidated, setCaptchaValidated] = useState<
    boolean | (() => boolean)
  >(false);
  const [wrongCaptcha, setWrongCaptcha] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const {
    mutate: sendNotification,
    isPending,
    error,
  } = useNotificationPublic();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaValidated) {
      setWrongCaptcha(true);
      return;
    }
    setWrongCaptcha(false);
    sendNotification(
      {
        content: `Demande de réinitialisation de mot de passe pour: ${name}, email: [[ ${email} ]]`, // uses [[]] to extract the email
      },
      {
        onSuccess: () => {
          handleAlert();
          onPasswordForgotten();
        },
      },
    );
  };

  type ErrorResponse = {
    message?: string;
  };
  const errorMessage =
    (error as AxiosError<ErrorResponse>)?.response?.data?.message ||
    "Erreur inconnue";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="to-boa-sky/10 bg-linear-to-br">
        <CardHeader>
          <CardTitle className="from-boa-sky to-boa-blue bg-linear-to-l bg-clip-text text-2xl text-transparent">
            Demander un nouveau{" "}
            <span className="whitespace-nowrap">mot de passe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Nom et Prénom</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="flex items-center">
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* captcha */}
                <div className="mt-3">
                  <Captcha
                    captchaInputRef={captchaInputRef}
                    setCaptchaValidated={setCaptchaValidated}
                  />
                  {wrongCaptcha && (
                    <span className="flex justify-end text-sm text-red-400">
                      Code non validé ou incorrect !
                    </span>
                  )}
                </div>
              </div>

              {/* error */}
              {error && (
                <div className="text-sm text-red-500">{errorMessage}</div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full text-sm"
                  disabled={isPending}
                >
                  {isPending ? "Envoi en cours..." : "Envoyer la demande"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Un nouveau mot de passe temporaire vous sera envoyé à votre adresse
            email dès que l'administrateur aura pris connaissance de votre
            requête.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
