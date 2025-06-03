import type { ReactNode } from "react";
import Header from "../components/shared/header";
import Footer from "@/components/shared/footer";

interface MainLayoutProps {
  children: ReactNode;
}

function TopLayout({ children }: MainLayoutProps) {
  return (
    <main>
      <Header />
      <div className="container mt-30 mx-auto px-4 py-8 pb-20">
        {children}
      </div>
      <Footer />

    </main>
  );
}

export default TopLayout;
