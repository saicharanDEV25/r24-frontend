import Navbar from "../../components/Layout/Navbar/Navbar";
import TyresWheels from "../../components/TyresWheels/TyresWheels";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function TyresWheelsPage() {
  return (
    <>
      <Seo
        title="Bike Tyres, Wheels & Alloys — Installation in Warangal"
        description="Top-quality tyres, alloy wheels and wheel accessories for KTM and other motorcycles at R24 Automotive, Vardhannapeta, Warangal."
        keywords="bike tyres Warangal, KTM tyres, motorcycle alloy wheels, tyre installation Warangal"
        path="/tyres-wheels"
      />
      <Navbar />
      <TyresWheels />
      <Footer />
    </>
  );
}

export default TyresWheelsPage;
