import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './user/dashboard/page';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <div>
        <DashboardPage/>
      </div>
    </QueryClientProvider>
  );
}

export default App;