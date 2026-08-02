import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Countries } from "@/components/Countries";
import { Articles } from "@/components/Articles";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  return (
    <div>
      TEST PAGE
    </div>
  );
};

export default Index;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Countries />
        <Articles />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
