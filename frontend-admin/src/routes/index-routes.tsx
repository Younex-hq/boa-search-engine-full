import RootLayout from "@/layouts/RootLayout";
import PrivateRoute from "@/routes/PrivateRoute";
import LoginRedirectGuard from "@/routes/LoginRedirectGuard";
import NotFoundRedirect from "@/routes/NotFoundRedirect";
import HomeLayout from "@/layouts/HomeLayout";
import HomePage from "@/pages/HomePage";
import { Navigate } from "react-router";
import DocsLayout from "@/layouts/DocsLayout";
import DocsPage from "@/pages/doc-page/DocsPage";
import UsersLayout from "@/layouts/UsersLayout";
import UsersPage from "@/pages/UsersPage";
import AdminRoute from "./AdminRoute";
import StatsLayout from "@/layouts/StatsLayout";
import StatsPage from "@/pages/StatsPage";
import SearchLayout from "@/layouts/SearchLayout";
import SearchPage from "@/pages/Search-page/SearchPage";
import SavedLayout from "@/layouts/SavedLayout";
import SavedPage from "@/pages/SavedPage";
import AddDocumentPage from "@/pages/add-doc-page/AddDocumentPage";
import AddUserPage from "@/pages/AddUserPage";
import NotificationPage from "@/pages/NotificationPage";
import DocsPropertiesPage from "@/pages/DocsPropertiesPage";
import DirectionPage from "@/pages/DirectionPage";

export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <PrivateRoute />, // Protect everything under this
        children: [
          {
            element: <HomeLayout />, // HomeLayout contains <Outlet />
            children: [
              {
                path: "/home",
                element: <HomePage />,
              },
              {
                element: <AdminRoute />,
                children: [
                  {
                    path: "/notifications",
                    element: <NotificationPage />,
                  },
                ],
              },
              {
                path: "/docs",
                element: <DocsLayout />,
                children: [
                  {
                    index: true,
                    element: <DocsPage />,
                  },
                  {
                    path: "props",
                    element: <DocsPropertiesPage />,
                  },
                  {
                    path: "add",
                    element: <AddDocumentPage />,
                  },
                ],
              },
              {
                element: <AdminRoute />,
                children: [
                  {
                    path: "/users",
                    element: <UsersLayout />,
                    children: [
                      {
                        index: true,
                        element: <UsersPage />,
                      },
                      {
                        path: "add",
                        element: <AddUserPage />,
                      },
                    ],
                  },
                ],
              },
              {
                path: "/stats",
                element: <StatsLayout />,
                children: [
                  {
                    index: true,
                    element: <StatsPage />,
                  },
                ],
              },
              {
                path: "/search",
                element: <SearchLayout />,
                children: [
                  {
                    index: true,
                    element: <SearchPage />,
                  },
                ],
              },
              {
                path: "/save",
                element: <SavedLayout />,
                children: [
                  {
                    index: true,
                    element: <SavedPage />,
                  },
                ],
              },
              {
                path: "/directions",
                element: <DirectionPage />,
              },
              {
                index: true, // redirect root `/` to `/home`
                element: <Navigate to="/home" replace />,
              },
            ],
          },
        ],
      },
      {
        path: "login",
        element: <LoginRedirectGuard />,
      },
      {
        path: "*",
        element: <NotFoundRedirect />,
      },
    ],
  },
];

// src/layouts/sideBarLinks is the place to add links to show in the sidebar
