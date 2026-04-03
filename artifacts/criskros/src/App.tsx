import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PortalLogin from "@/pages/portal/PortalLogin";
import PortalDashboard from "@/pages/portal/PortalDashboard";
import PortalGallery from "@/pages/portal/PortalGallery";
import PortalAnnouncements from "@/pages/portal/PortalAnnouncements";
import { isPortalLoggedIn } from "@/lib/portalAuth";

const queryClient = new QueryClient();

function ProtectedPortalRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isPortalLoggedIn()) return <Redirect to="/portal" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portal" component={PortalLogin} />
      <Route path="/portal/dashboard">
        {() => <ProtectedPortalRoute component={PortalDashboard} />}
      </Route>
      <Route path="/portal/gallery">
        {() => <ProtectedPortalRoute component={PortalGallery} />}
      </Route>
      <Route path="/portal/announcements">
        {() => <ProtectedPortalRoute component={PortalAnnouncements} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
