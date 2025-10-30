import { Button } from "@/components/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import {
  useGetNotifications,
  useUpdateNotification,
} from "@/hooks/useNotifications";
import type { Notification } from "@/api/notification.api";
import LoadingSkelaton from "@/components/loading/LoadingSkelaton";
import PageHeader from "@/layouts/PageTitleHeader";

const extractEmail = (content: string) => {
  const match = content.match(/\[\[(.*?)\]\]/);
  return match ? match[1] : "";
}; // extract email from the content, email is between [[...]]

export default function NotificationPage() {
  const { data: notificationsResponse, isLoading } = useGetNotifications();
  const updateNotificationMutation = useUpdateNotification();

  const handleUpdateNotification = (id: number, isRead: boolean) => {
    updateNotificationMutation.mutate({ id, payload: { isRead: !isRead } });
  };

  const notifications = notificationsResponse?.data || [];

  const doneNotifications = notifications.filter(
    (noti: Notification) => noti.attributes.isRead === true,
  );
  const progressNotifications = notifications.filter(
    (noti: Notification) => noti.attributes.isRead === false,
  );
  const allNotifications = [...progressNotifications, ...doneNotifications];

  return (
    <div>
      <PageHeader
        title="Notifications"
        info="Les notifications « Public » sont des demandes de modification de mot de passe par les utilisateurs."
      />
      <div className="grid w-[100vw] justify-center md:w-[100%]">
        {isLoading ? (
          <LoadingSkelaton />
        ) : (
          <Table className="mx-4 w-[100vw] rounded-2xl bg-white sm:w-4xl">
            <TableHeader className="bg-boa-sky/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="rounded-tl-2xl">Nom Complet</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="bg-red-388 rounded-tr-2xl text-center">
                  Statut
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allNotifications.map((item: Notification, i: number) => {
                const authorId = item.relationships.author.data.id;
                const content = item.attributes.content;
                const isRead = item.attributes.isRead;

                const fullName =
                  authorId === 1
                    ? "mp. Oublié"
                    : `${item.relationships.author.data.firstName}. ${item.relationships.author.data.lastName}`;
                const email =
                  authorId === 1
                    ? extractEmail(content)
                    : item.relationships.author.data.email;

                return (
                  <TableRow
                    key={item.id}
                    className="even:bg-boa-sky/10 hover:bg-boa-sky/30"
                  >
                    <TableCell
                      className={`max-w-[150px] overflow-hidden font-medium ${i === notifications.length - 1 ? "rounded-bl-2xl" : ``}`}
                    >
                      {fullName}
                    </TableCell>
                    <TableCell className="max-w-[150px] overflow-hidden">
                      {email}
                    </TableCell>
                    <TableCell className="max-w-[50vw] overflow-auto overflow-y-hidden">
                      {content}
                    </TableCell>
                    <TableCell
                      className={`text-right ${i === notifications.length - 1 ? "rounded-br-2xl" : ``} `}
                    >
                      <Button
                        variant={isRead ? "secondary" : "default"}
                        onClick={() =>
                          handleUpdateNotification(item.id, isRead)
                        }
                      >
                        {isRead ? "Fait" : "en cours"}
                      </Button>
                      <p className="absolute hidden text-xs">{item.id}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableCaption className="text-end">
              Nofications done :{" "}
              <b>
                {notifications.filter((n) => n.attributes.isRead).length} /{" "}
              </b>
              {notifications.length}
            </TableCaption>
          </Table>
        )}
      </div>
    </div>
  );
}
