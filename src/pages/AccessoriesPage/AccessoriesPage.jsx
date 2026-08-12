import Navbar from "../../components/Layout/Navbar/Navbar";
import Accessories from "../../components/Accessories/Accessories";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function AccessoriesPage() {
  return (
    <>
      <Seo
        title="Genuine Bike Accessories — KTM, Royal Enfield, Kawasaki"
        description="Genuine accessories for KTM, Royal Enfield, Yamaha, Bajaj, Benelli and Kawasaki motorcycles at R24 Automotive, Warangal."
        keywords="bike accessories Warangal, KTM accessories, motorcycle riding gear, genuine bike accessories"
        path="/accessories"
      />
      <Navbar />
      <Accessories />
      <Footer />
    </>
  );
}

export default AccessoriesPage;
