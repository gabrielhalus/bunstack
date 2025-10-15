import { queryClient } from "@/lib/query-client";
import { createAuth } from "@bunstack/react/lib/auth";

export const auth = createAuth({ queryClient });
