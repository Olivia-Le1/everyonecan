import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Countries } from "@/components/Countries";
import { Months } from "@/components/Months";
import { Articles } from "@/components/Articles";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Countries />
        <Months />
        <Articles />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
