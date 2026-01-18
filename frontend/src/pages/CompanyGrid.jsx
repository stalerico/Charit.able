import BlogDemo from "../components/BlogDemo";
import Navbar from "../components/navbar.tsx";
import CardGrid from "../components/CardGrid";

function SearchBar() {
  return (
    <div className="flex-1 mx-4 hidden md:flex">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 rounded-lg bg-black/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={handleSearch}
        className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-400 text-black rounded-lg hover:bg-green-500 transition"
      >
        Go
      </button>
    </div>
  );
}

export default function CompanyGrid() {
  return (
    <>
      <Navbar />
      <CardGrid />
      <BlogDemo />
    </>
  );
}
