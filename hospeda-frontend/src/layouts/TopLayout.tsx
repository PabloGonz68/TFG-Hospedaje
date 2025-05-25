import type { ReactNode } from "react";
import Header from "../components/shared/header";

interface MainLayoutProps {
  children: ReactNode;
}

function TopLayout({ children }: MainLayoutProps) {
  return (
    <main>
      <Header />
      <div className="container mt-30 mx-auto px-4 py-8">
        {children}
      </div>

    </main>
  );
}

export default TopLayout;
