"use client";

import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useMutation,
} from "convex/react";
import { ClerkProvider, SignIn, useAuth, useUser } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode, useEffect, useState } from "react";
import { Screenloader } from "./screen-loader";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { HomePage } from "./homepage";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>
          <UserSync>{children}</UserSync>
        </Authenticated>
        <Unauthenticated>
          <HomePage />
        </Unauthenticated>
        <AuthLoading>
          <Screenloader label="loading..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
function UserSync({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeUser = useMutation(api.users.storeuser); // Make sure this matches your mutation name
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  useEffect(() => {
    if (!Authenticated) {
      return;
    }

    async function syncUser() {
      const id = await storeUser();
      setUserId(id);
    }

    syncUser();
  }, [user?.id, storeUser]);

  return <>{children}</>;
}
