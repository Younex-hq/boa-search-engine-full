import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/shadcn/alert";

export default function LoginAlert() {
  return (
    <div className="absolute top-10 z-50 w-sm p-2 md:w-xl">
      <Alert className="to-boa-gold/10 border-1 bg-linear-to-br shadow-2xl">
        <CheckCircle2Icon color="green" />
        <AlertTitle>Succès ! Votre demande a été envoyée</AlertTitle>
      </Alert>
    </div>
  );
}
