import Navbar from "../../components/Layout/Navbar/Navbar";
import BikeDetailing from "../../components/BikeDetailing/BikeDetailing";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function BikeDetailingPage() {
  return (
    <>
      <Seo
        title="Ceramic & Teflon Coating, Bike Detailing in Warangal"
        description="9H ceramic coating, Teflon coating, polishing and full detailing packages to keep your KTM and other motorcycles showroom-fresh at R24 Automotive, Warangal."
        keywords="ceramic coating bike Warangal, Teflon coating bike, bike detailing Warangal, KTM ceramic coating, motorcycle polishing"
        path="/bike-detailing"
      />
      <Navbar />
      <BikeDetailing />
      <Footer />
    </>
  );
}

export default BikeDetailingPage;
