export const sidebarLinks = {
  navMain: [
    {
      title: "Actions rapides",
      url: "/home",
      icon: "HouseIcon",
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: "BellIcon",
    },
    {
      title: "Enregistré",
      url: "/save",
      icon: "BookmarkIcon",
    },
    {
      title: "Recherche",
      url: "/search",
      icon: "SearchIcon",
    },
    // {
    //   title: "Statistiques",
    //   url: "/stats",
    //   icon: "ChartColumnIcon",
    // },
    {
      title: "Document",
      url: "/docs",
      items: [
        {
          title: "List des Documents",
          url: "/docs",
          icon: "FileIcon",
        },
        {
          title: "Ajouter un Document",
          url: "/docs/add",
          icon: "FilePlus2Icon",
        },
        {
          title: "Types / État documents",
          url: "/docs/props",
          icon: "FileSpreadsheetIcon",
        },
      ],
    },
    {
      title: "Utilisateur",
      url: "/users",
      items: [
        {
          title: "List des Utilisateurs",
          url: "/users",
          icon: "UserIcon",
        },
        {
          title: "Ajouter un utilisateur",
          url: "/users/add",
          icon: "UserRoundPlus",
        },
      ],
    },
    {
      title: "Directions",
      url: "/directions",
      items: [
        {
          title: "Les Directions",
          url: "/directions",
          icon: "NetworkIcon",
        },
      ],
    },
  ],
};

// * after adding your link here add the icon to app-sidebar.tsx to show the new page in the sidebar
