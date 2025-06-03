import type { ReactNode } from "react";
import Header from "../components/shared/header";
import Footer from "@/components/shared/footer";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

export default MainLayout;
