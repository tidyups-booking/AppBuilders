import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';

import Dashboard from '@/pages/dashboard';
import BookingsList from '@/pages/bookings';
import NewBooking from '@/pages/new-booking';
import BookingDetail from '@/pages/booking-detail';
import PrivacyPolicy from '@/pages/privacy';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/new" component={NewBooking} />
            <Route path="/bookings" component={BookingsList} />
            <Route path="/bookings/:id" component={BookingDetail} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
