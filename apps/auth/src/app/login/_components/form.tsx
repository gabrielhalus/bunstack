"use client";

import { Constants } from "@bunstack/shared/constants";
import { loginInputSchema } from "@bunstack/shared/contracts/auth";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/lib/http";
import { Button } from "@bunstack/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bunstack/ui/components/card";
import { Input } from "@bunstack/ui/components/input";
import { Label } from "@bunstack/ui/components/label";
import { cn } from "@bunstack/ui/lib/utils";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const form = useForm({
    validators: { onChange: loginInputSchema },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await api.auth.login.$post({ json: value });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem(Constants.accessToken, json.accessToken);
        return router.push(redirectTo);
      }

      toast.error(json.error);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(e);
          }}
          >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <form.Field
                    name="email"
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>Email</Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          type="email"
                          placeholder="m@example.com"
                          required
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid
                          ? (
                              <p className="text-destructive text-sm">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )
                          : null}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <form.Field
                    name="password"
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          type="password"
                          required
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid
                          ? (
                              <p className="text-destructive text-sm">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )
                          : null}
                      </>
                    )}
                  />
                </div>
                <form.Subscribe
                  selector={state => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <>
                      <Button type="submit" disabled={!canSubmit}>
                        {isSubmitting
                          ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                {" "}
                                Signing in...
                              </span>
                            )
                          : "Sign in"}
                      </Button>
                    </>
                  )}
                />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account yet?
                {" "}
                <Link href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ""}`} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
