import Navbar from "../../components/Layout/Navbar/Navbar";
import BikeService from "../../components/BikeService/BikeService";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function BikeServicePage() {
  return (
    <>
      <Seo
        title="Bike Service & Repair for KTM, Royal Enfield, Kawasaki Z900 in Warangal"
        description="Transparent pricing, genuine parts and certified technicians for KTM, Royal Enfield, Yamaha, Bajaj, Benelli and Kawasaki Z900 servicing at R24 Automotive, Vardhannapeta, Warangal."
        keywords="bike service Warangal, KTM service Warangal, Kawasaki Z900 service, motorcycle repair Warangal, genuine bike service"
        path="/bike-service"
      />
      <Navbar />
      <BikeService />
      <Footer />
    </>
  );
}

export default BikeServicePage;
