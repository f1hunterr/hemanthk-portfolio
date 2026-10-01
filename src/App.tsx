import { Switch, Route, Router as WouterRouter } from "wouter";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollToTop } from "@/components/ScrollToTop";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <TooltipProvider>
          <CustomCursor />
          <ScrollToTop />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
