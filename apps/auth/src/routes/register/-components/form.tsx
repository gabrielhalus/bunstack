import { registerInputSchema } from "@bunstack/shared/contracts/auth";
import { Button } from "@bunstack/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bunstack/ui/components/card";
import { Input } from "@bunstack/ui/components/input";
import { Label } from "@bunstack/ui/components/label";
import { cn } from "@bunstack/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { debounceAsync } from "@/lib/debounce";
import { api } from "@/lib/http";

const checkEmailAvailable = debounceAsync(async (email: string): Promise<string | void> => {
  const res = await api.auth.available.$get({ query: { email } });

  if (!res.ok) {
    return "Failed to check email availability";
  }

  const resData = await res.json();

  if (!resData.available) {
    return "Email is already in use";
  }
}, 500);

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const location = useRouterState({ select: s => s.location });
  const searchParams = new URLSearchParams(location.searchStr);
  const redirectTo = searchParams.get("redirect") || "/";

  const form = useForm({
    validators: {
      onChange: registerInputSchema,
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await api.auth.register.$post({ json: value });
      const json = await res.json();

      if (json.success) {
        return navigate({ href: redirectTo });
      }

      throw toast.error(json.error);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome aboard!</CardTitle>
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
                    name="name"
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>Full Name</Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          type="text"
                          placeholder="John Doe"
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
                    name="email"
                    validators={{
                      onChangeAsync: async ({ value }) => {
                        const error = await checkEmailAvailable(value);
                        return error ? { message: error } : undefined;
                      },
                    }}
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
                                Signing up...
                              </span>
                            )
                          : "Sign up"}
                      </Button>
                    </>
                  )}
                />
              </div>
              <div className="text-center text-sm">
                Already have an account?
                {" "}
                <Link to="/" search={location.search} className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
