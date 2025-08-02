"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();

  const hiddenRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/verify-code"];
  const shouldHideFooter = hiddenRoutes.includes(pathname);

  if (shouldHideFooter) return null;

  return <Footer />;
};

export default FooterWrapper;
