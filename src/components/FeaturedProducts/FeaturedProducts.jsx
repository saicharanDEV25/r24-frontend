import "./FeaturedProducts.css";

const products = [
  {
    image: "/images/helmet.jpg",
    name: "Premium KTM Helmet",
    price: "₹5,999",
  },
  {
    image: "/images/gloves.jpg",
    name: "Riding Gloves",
    price: "₹1,499",
  },
  {
    image: "/images/headlight.jpg",
    name: "LED Headlight",
    price: "₹2,499",
  },
  {
    image: "/images/crashguard.jpg",
    name: "Crash Guard",
    price: "₹3,299",
  },
  {
    image: "/images/alloy.jpg",
    name: "Alloy Wheels",
    price: "₹12,999",
  },
  {
    image: "/images/exhaust.jpg",
    name: "Performance Exhaust",
    price: "₹8,999",
  },
];

function FeaturedProducts() {
  return (
    <section className="featured-products">

      <div className="section-title">
        <h2>Featured Products</h2>
        <p>
          Premium accessories and genuine spare parts for KTM motorcycles.
        </p>
      </div>

      <div className="products-grid">

        {products.map((product, index) => (
          <div className="product-card" key={index}>

            <img
              src={product.image}
              alt={product.name}
            />

            <div className="product-info">

              <h3>{product.name}</h3>

              <span>{product.price}</span>

              <button>View Details</button>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FeaturedProducts;