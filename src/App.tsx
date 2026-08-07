import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Quiz from "./pages/Quiz.tsx";
import Admin from "./pages/Admin.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import CountryArticles from "./pages/CountryArticles.tsx";
import MonthArticles from "./pages/MonthArticles.tsx";
import AllArticles from "./pages/AllArticles.tsx";
import AllMonths from "./pages/AllMonths.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/article/:id" element={<ArticleDetail />} />

          <Route
            path="/country/:name"
            element={<CountryArticles />}
          />

          <Route path="/month/:id" element={<MonthArticles />} />
          <Route path="/articles" element={<AllArticles />} />
          <Route path="/months" element={<AllMonths />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
