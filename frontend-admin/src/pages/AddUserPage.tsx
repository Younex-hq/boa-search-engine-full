import PageHeader from "@/layouts/PageTitleHeader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { UserPlusIcon, XIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/shadcn/input";
import { DirectionSelection } from "./UsersPage";
import { useGetDirections } from "@/hooks/useDirections";
import InputPasswordToggle from "@/components/input-password-toggle";
import { useAddUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";
import { type AddUserPayload } from "@/api/user.api";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function AddUserPage() {
  const { data: directionsResponse } = useGetDirections();
  const { mutate: addUser } = useAddUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
    directionId: "1",
  });

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (
      formData.password !== formData.confirmPassword &&
      formData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [formData.password, formData.confirmPassword]);

  const handleCancel = () => {
    navigate("/users");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) {
      return;
    }
    const payload: AddUserPayload = {
      data: {
        attributes: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.isAdmin,
        },
        relationships: {
          direction: {
            data: {
              name: Number(formData.directionId),
            },
          },
        },
      },
    };
    addUser(payload, {
      onSuccess: () => {
        navigate("/users");
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <PageHeader
        title="Ajouter un nouvel utilisateur"
        // responsive={true}
        // info="les utilisateurs qui peuvent accéder à ce panneau d'administration"
      />
      {isMobile && <br />}
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full">
        <Card className="z-50 w-xl">
          <CardHeader>
            <div className="flex justify-between sm:items-center">
              <div className="flex gap-4 sm:items-center">
                <span className="text-boa-sky">
                  <UserPlusIcon />
                </span>
                <div className="boa-gradient grid gap-2">
                  <CardTitle>
                    <h4>Nouvel utilisateur Info</h4>
                  </CardTitle>
                  <CardDescription>L'e-mail doit être unique</CardDescription>
                </div>
              </div>
              <Button
                variant={"ghost"}
                className="rounded-full bg-gray-50 text-2xl"
                onClick={handleCancel}
              >
                <XIcon />
              </Button>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex w-full gap-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="direction">Direction</Label>
                  <DirectionSelection
                    directions={
                      directionsResponse?.data.filter(
                        (direction) => direction.attributes.isActive !== 0,
                      ) || []
                    }
                    directionId={formData.directionId}
                    setDirection={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        directionId: value || "",
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <InputPasswordToggle
                    id="password"
                    label="mot de passe"
                    value={formData.password}
                    required={true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Update Password"
                  />
                  <InputPasswordToggle
                    id="confirmPassword"
                    label="Confirmez le mot de passe"
                    value={formData.confirmPassword}
                    required={true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="mot de passe"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="isAdmin">Admin</Label>
                  <RadioGroup
                    defaultValue={formData.isAdmin ? "true" : "false"}
                    onValueChange={(value) =>
                      handleRadioChange("isAdmin", value)
                    }
                    className="flex items-center gap-8 rounded-md border-1 p-1 pl-3 shadow-xs"
                  >
                    <div className="hover:bg-boa-sky/5 flex items-center space-x-2 rounded-full">
                      <RadioGroupItem value="false" id="NoAdmin" />
                      <Label htmlFor="NoAdmin">No</Label>
                    </div>
                    <div className="hover:bg-boa-sky/5 flex items-center space-x-2 rounded-full">
                      <RadioGroupItem value="true" id="YesAdmin" />
                      <Label htmlFor="YesAdmin">Oui</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-8 flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={!!passwordError}
              >
                confirmer
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                Annuler
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
