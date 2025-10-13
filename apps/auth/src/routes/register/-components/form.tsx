import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "sonner";

import { api } from "@/lib/http";
import { Button } from "@bunstack/react/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bunstack/react/components/card";
import { Input } from "@bunstack/react/components/input";
import { Label } from "@bunstack/react/components/label";
import { PasswordInput } from "@bunstack/react/components/password-input";
import { Spinner } from "@bunstack/react/components/spinner";
import { cn } from "@bunstack/react/lib/utils";
import { passwordChecks, passwordRules, registerInputSchema } from "@bunstack/shared/contracts/auth";
import { debounceAsync } from "@bunstack/shared/lib/debounce";

const checkEmail = debounceAsync(async (email: string): Promise<string | void> => {
  const res = await api.users["check-email"].$get({ query: { email } });

  if (!res.ok) {
    return "failRequestErrorMessage";
  }

  const resData = await res.json();

  if (!resData.available) {
    return "alreadyTakenErrorMessage";
  }
}, 500);

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const { t } = useTranslation("auth");

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
        await api.email["send-account-verification"].$post();
        return navigate({ href: redirectTo, replace: true });
      }

      throw toast.error(json.error);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("register.title")}</CardTitle>
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
                        <Label htmlFor={field.name}>{t("fields.name")}</Label>
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
                                {t(`errors.${field.name}.${field.state.meta.errors[0]?.message}`)}
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
                        const error = await checkEmail(value);
                        return error ? { message: error } : undefined;
                      },
                    }}
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>{t("fields.email")}</Label>
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
                                {t(`errors.${field.name}.${field.state.meta.errors[0]?.message}`)}
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
                        <Label htmlFor={field.name}>{t("fields.password")}</Label>
                        <PasswordInput
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          rules={passwordRules}
                          checks={passwordChecks}
                          showRequirements
                          required
                        />
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
                                <Spinner />
                                {t("register.pending")}
                              </span>
                            )
                          : t("register.submit")}
                      </Button>
                    </>
                  )}
                />
              </div>
              <div className="text-center text-sm">
                <Trans i18nKey="register.cta" ns="auth" components={{ Link: <Link key="link" to="/" search={location.search} className="underline underline-offset-4" /> }} />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
