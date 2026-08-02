import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Countries } from "@/components/Countries";
import { Articles } from "@/components/Articles";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    console.log("Index page loaded");
  }, []);

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
