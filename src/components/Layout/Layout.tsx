import React, { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

import { useTheme } from "@/hooks";

import * as styles from "./Layout.module.scss";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  const [{ mode }] = useTheme();

  useEffect(() => {
    document.documentElement.className = mode;
  }, [mode]);

  return (
    <>
      <div className={styles.layout}>{children}</div>
      <Analytics />
    </>
  );
};

export default Layout;
