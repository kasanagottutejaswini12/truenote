import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BouquetProvider } from "@/context/BouquetContext";
import Index from "./pages/Index";
import CreateBouquet from "./pages/CreateBouquet";
import MessageCard from "./pages/MessageCard";
import PreviewPage from "./pages/PreviewPage";
import ViewBouquet from "./pages/ViewBouquet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BouquetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateBouquet />} />
            <Route path="/card" element={<MessageCard />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/view" element={<ViewBouquet />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BouquetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
