import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/components/common/ToastProvider';

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AppRoutes />
      <ToastProvider />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
