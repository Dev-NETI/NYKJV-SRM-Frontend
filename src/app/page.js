import WelcomeLabel from "@/components/home-page/WelcomeLabel";
import NykJvAnimatedLogo from "@/components/home-page/NykJvAnimatedLogo";

export const metadata = {
  title: "Laravel",
};

const Home = () => {
  return (
    <>
      <div className="flex flex-col bg-slate-50 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 p-4">
          <WelcomeLabel />
          <NykJvAnimatedLogo />
        </div>
      </div>
    </>
  );
};

export default Home;
