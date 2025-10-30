import DocumentTypes from "@/components/DocumentTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";

import PageHeader from "@/layouts/PageTitleHeader";
import { FileWarningIcon } from "lucide-react";

export default function DocsPropertiesPage() {
  return (
    <>
      <PageHeader
        title="Propriétés des documents"
        info="Les propriétés que les documents peuvent avoir"
      />
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full">
        <DocumentStatusInfo />

        {/* //! document types card : */}
        <DocumentTypes />
      </div>
    </>
  );
}

function DocumentStatusInfo() {
  const description =
    '"État Du Document", Les documents peuvent adopter différents statuts pour refléter leurs relations.';

  const items = [
    {
      id: 1,
      title: "Nouveau",
      content:
        "Le document est nouveau et n’a aucun lien avec d’autres documents.",
    },
    {
      id: 2,
      title: "Mise à jour (Modifiant, Completan)",
      content:
        "Le document est lié à un autre document qu’il met à jour avec de nouvelles informations.",
    },
    {
      id: 3,
      title: "Annulation",
      content:
        "Le document est lié à un autre document et l’annule entièrement. L’ancien document devient obsolète.",
    },
    {
      id: 4,
      title: "Mis à jour",
      content:
        "Ce document a été remplacé par un autre document qui en met à jour le contenu.",
    },
    {
      id: 5,
      title: "Annulé",
      content: "Ce document est obsolète car un autre document l’a annulé.",
    },
  ];

  return (
    <div className="flex h-fit w-md justify-center">
      <Card className="relative m-5 w-full max-w-sm bg-gradient-to-br from-white via-white to-gray-50">
        <FileWarningIcon className="text-foreground/10 absolute top-3 right-2 h-16 w-16 stroke-[1.5px]" />
        <CardHeader className="pt-5">
          <div className="flex flex-col gap-3">
            <span className="boa-gradient text-2xl leading-none font-semibold">
              Document Statuts (État)
            </span>
            <span className="text-muted-foreground text-sm leading-none">
              {description}
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <Accordion type="single" collapsible className="my-4 w-full max-w-lg">
            {items.map(({ title, content, id }) => (
              <AccordionItem key={id} value={`item-${id}`}>
                <AccordionTrigger className="cursor-pointer">
                  {title}
                </AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
