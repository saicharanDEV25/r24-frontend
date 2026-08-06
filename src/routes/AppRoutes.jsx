import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ContactPage from "../pages/ContactPage/ContactPage";
import BikeServicePage from "../pages/BikeServicePage/BikeServicePage";
import CustomPaintingPage from "../pages/CustomPaintingPage/CustomPaintingPage";
import BikeWrappingPage from "../pages/BikeWrappingPage/BikeWrappingPage";
import BikeDetailingPage from "../pages/BikeDetailingPage/BikeDetailingPage";
import TyresWheelsPage from "../pages/TyresWheelsPage/TyresWheelsPage";
import AccessoriesPage from "../pages/AccessoriesPage/AccessoriesPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import HelpPage from "../pages/Help/HelpPage";
import NotFound from "../pages/NotFound/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/bike-service" element={<BikeServicePage />} />
        <Route path="/custom-painting" element={<CustomPaintingPage />} />
        <Route path="/bike-wrapping" element={<BikeWrappingPage />} />
        <Route path="/bike-detailing" element={<BikeDetailingPage />} />
        <Route path="/tyres-wheels" element={<TyresWheelsPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;