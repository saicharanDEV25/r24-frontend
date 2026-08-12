import Navbar from "../../components/Layout/Navbar/Navbar";
import CustomPainting from "../../components/CustomPainting/CustomPainting";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function CustomPaintingPage() {
  return (
    <>
      <Seo
        title="Custom Bike Painting & Colour Customization in Warangal"
        description="Pick your bike model and colour — professional custom painting for KTM and other motorcycles at R24 Automotive, Vardhannapeta, Warangal."
        keywords="custom bike painting Warangal, KTM custom paint, motorcycle painting, bike colour customization"
        path="/custom-painting"
      />
      <Navbar />
      <CustomPainting />
      <Footer />
    </>
  );
}

export default CustomPaintingPage;
