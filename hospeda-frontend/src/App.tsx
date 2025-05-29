
import AppRoutes from "@/routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'sonner';
function App() {


  return (
    <AuthProvider>
      <Toaster richColors position="bottom-right" />
      <AppRoutes></AppRoutes>
    </AuthProvider>
  )
}

export default App;
