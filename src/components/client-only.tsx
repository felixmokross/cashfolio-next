import type { PropsWithChildren, ReactNode } from "react";
import { useEffect } from "react";
import { useState } from "react";

type ClientOnlyProps = PropsWithChildren<{
  fallback: ReactNode;
}>;

export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? <>{children}</> : <>{fallback}</>;
}
