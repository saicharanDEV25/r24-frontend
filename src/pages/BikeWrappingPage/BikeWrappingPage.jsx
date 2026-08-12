import Navbar from "../../components/Layout/Navbar/Navbar";
import BikeWrapping from "../../components/BikeWrapping/BikeWrapping";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function BikeWrappingPage() {
  return (
    <>
      <Seo
        title="Bike Wrapping & Vinyl Wrap Services in Warangal"
        description="Change your bike's finish with premium vinyl wrapping, no factory paint damage. KTM and multi-brand bike wrapping at R24 Automotive, Warangal."
        keywords="bike wrapping Warangal, KTM wrap, vinyl wrap motorcycle, bike vinyl wrapping"
        path="/bike-wrapping"
      />
      <Navbar />
      <BikeWrapping />
      <Footer />
    </>
  );
}

export default BikeWrappingPage;
