import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";
import App from "./App";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="search" element={<SearchPage />} />
    </Route>
  )
);

export default router;