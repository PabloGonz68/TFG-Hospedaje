
import AppRoutes from "@/routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
function App() {


  return (
    <AuthProvider>
      <AppRoutes></AppRoutes>
    </AuthProvider>
  )
}

export default App;
