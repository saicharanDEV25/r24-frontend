import Seo from "../../components/common/Seo/Seo";

function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist on R24 Automotive." path="/404" noindex />
      <h1>404 - Page Not Found</h1>
    </>
  );
}

export default NotFound;