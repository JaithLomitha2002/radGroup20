import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
// import SearchBar from "../components/SearchBar";


//In summary, using an interface for props in React with TypeScript helps enforce correct prop types, improves code readability, enhances the development experience with better IntelliSense, and provides consistent and clear documentation for the component.

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto">
        <SearchBar />
      </div>
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
