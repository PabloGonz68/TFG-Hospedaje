import type { ReactNode } from "react";
import Header from "../components/shared/header";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}

export default MainLayout;
