import {
  UserRoundCogIcon,
  SearchIcon,
  NetworkIcon,
  ChartColumnIcon,
  FileClockIcon,
  BellIcon,
  BookmarkIcon,
  FileSpreadsheetIcon,
  FilePlus2Icon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/shadcn/card";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";

const SectionCards = () => {
  const { user } = useAuthStore();

  const newNotification = false;
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const Cards = [
    {
      icon: BellIcon,
      title: "Notifications",
      description:
        "Les demandes de réinitialisation des mot de passe oublié pour les utilisateurs.",
      path: "/notifications",
    },
    {
      icon: FilePlus2Icon,
      title: "Ajouter un Document",
      description:
        "Ajouter des documents PDF, textes réglementair et lettres communes",
      path: "/docs/add",
    },
    {
      icon: FileClockIcon,
      title: "Documents",
      description: "Voir les derniers documents ajoutés.",
      path: "/docs",
    },
    {
      icon: BookmarkIcon,
      title: "Docs enregistré",
      description: "Vos documents enregistrés pour un accès rapide.",
      path: "/save",
    },
    {
      icon: SearchIcon,
      title: "Recherche",
      description:
        "Recherchez un document par son nom ou son contenu et obtenez les résultats les plus pertinents.",
      path: "/search",
    },
    {
      icon: FileSpreadsheetIcon,
      title: "Types et Etats",
      description: "Voir les différents types et états de documents possibles.",
      path: "/docs/props",
    },
    {
      icon: NetworkIcon,
      title: "les directions",
      description: "Ajoutez, modifiez ou supprimez les directions.",
      path: "/directions",
    },
    // {
    //   icon: ChartColumnIcon,
    //   title: "Statistiques",
    //   description:
    //     "Suivez les document et l’activité des utilisateurs grâce à des graphiques et rapports clairs.",
    //   path: "/stats",
    // },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:m-auto md:w-[80%] md:[grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
      {Cards.filter(
        (card) => user?.is_admin || card.title !== "Notifications", // don't show notifications card
      ).map((card) => (
        <Card
          key={card.title}
          className="hover:to-boa-sky/10 min-w-[250px] cursor-pointer bg-gradient-to-r from-white via-white hover:bg-gradient-to-br"
          onClick={() => handleCardClick(card.path)}
        >
          <CardHeader className="group grid gap-4">
            <CardTitle className="flex aspect-[4] items-center gap-3 text-2xl">
              <span
                className={
                  newNotification && card.title === "Notifications"
                    ? `text-4xl text-yellow-600`
                    : `text-4xl text-blue-400`
                }
              >
                <card.icon />
              </span>
              <span
                className={
                  newNotification && card.title === "Notifications"
                    ? `bg-boa-gold bg-clip-text text-transparent`
                    : `from-boa-sky to-boa-blue bg-gradient-to-r bg-clip-text text-transparent`
                }
              >
                {card.title}
              </span>
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
