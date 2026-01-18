import BlogDemo from "../components/BlogDemo";
import Navbar from "../components/navbar.tsx";
import CardGrid from "../components/CardGrid";


 function CompanyGrid() {
  return (
    <>
      <Navbar />
      <h1>Company</h1>
      <CardGrid />
      <BlogDemo />
    </>
  );
}

export default CompanyGrid;
