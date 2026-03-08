import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageProvider } from "@/context/MessageContext";
import Index from "./pages/Index";
import CreateMessage from "./pages/CreateMessage";
import PreviewMessage from "./pages/PreviewMessage";
import ViewMessage from "./pages/ViewMessage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MessageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateMessage />} />
            <Route path="/preview" element={<PreviewMessage />} />
            <Route path="/m/:slug" element={<ViewMessage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
