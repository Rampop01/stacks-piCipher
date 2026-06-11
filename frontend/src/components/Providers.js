"use client";

import { Connect } from "@stacks/connect-react";
import { AppConfig, UserSession } from "@stacks/connect";

export const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export default function Providers({ children }) {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "PiCipher",
          icon: typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "",
        },
        userSession,
      }}
    >
      {children}
    </Connect>
  );
}
