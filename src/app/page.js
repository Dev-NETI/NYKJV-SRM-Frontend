import WelcomeLabel from "@/components/home-page/WelcomeLabel";
import NykJvAnimatedLogo from "@/components/home-page/NykJvAnimatedLogo";
import Footer from "@/components/home-page/Footer";
import SrmLogo from "@/components/home-page/SrmLogo";

export const metadata = {
  title: "NYK-JV Supplier Relationship Management",
};

const Home = () => {
  return (
    <>
      <div className="flex flex-col custom-bg-nyk min-h-screen">
        <SrmLogo />
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 p-2">
          <WelcomeLabel />

          <NykJvAnimatedLogo />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
