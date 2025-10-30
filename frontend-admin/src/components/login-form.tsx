import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import InputPasswordToggle from "./input-password-toggle";

import { useLogin } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth";

export function LoginForm({
  className,
  onPasswordForgotten,
  ...props
}: React.ComponentProps<"div"> & { onPasswordForgotten: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);

  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: (res) => {
          authLogin(res.data.token, res.data.user);
          navigate("/dashboard");
        },
      },
    );
  };

  type ErrorResponse = {
    message?: string;
  };

  const getErrorMessage = () => {
    if (!error) {
      return null;
    }
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      if (axiosError.response.status === 500) {
        return "can't connect right now";
      }
      return axiosError.response.data?.message || "Login failed";
    }
    return "try login in later, server is down";
  };
  const errorMessage = getErrorMessage();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="to-boa-sky/10 bg-linear-to-br">
        <CardHeader>
          <CardTitle className="from-boa-sky to-boa-blue bg-linear-to-l bg-clip-text text-center text-transparent">
            <h3>Connexion</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                minLength={5}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <InputPasswordToggle
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && (
              <div className="text-sm text-red-500">{errorMessage}</div>
            )}
            <Button
              type="submit"
              className="from-boa-sky to-boa-blue w-full bg-linear-to-l"
              disabled={isPending}
            >
              {isPending ? "Connecter..." : "Se connecter"}
            </Button>
          </form>
          <div className="mt-4 flex w-full">
            <Button
              variant={"link"}
              className="mx-auto text-center text-xs"
              onClick={onPasswordForgotten}
            >
              Mot de passe oublié ?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
