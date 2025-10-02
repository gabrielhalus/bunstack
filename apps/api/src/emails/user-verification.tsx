import { env } from "../lib/env";

type UserVerificationProps = {
  name: string;
  link: string;
};

export function UserVerification({ name, link }: UserVerificationProps) {
  return (
    <div style={{
      fontFamily: "sans-serif",
      lineHeight: 1.6,
      color: "#333",
      width: "100%",
      maxWidth: "800px",
      marginBlock: "16px",
      marginInline: "auto",
    }}
    >
      <h1>{`Hello ${name}`}</h1>
      <p>Thank you for signing up! Please confirm your email by clicking the link below:</p>
      <a
        href={link}
        style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "oklch(0.6716 0.1368 48.513)", color: "oklch(1 0 0)", textDecoration: "none", borderRadius: "0.125rem" }}
        target="_blank"
      >
        Confirm Email
      </a>
      <p>If you did not create an account, you can safely ignore this email.</p>

      <footer style={{ marginTop: "40px", fontSize: "12px", color: "#777" }}>
        <p>
          Sent by
          {" "}
          <strong>Bunstack.</strong>
          {" "}
          <a href={env.SITE_URL} target="_blank">{env.SITE_URL}</a>
        </p>
        <p>
          Need help? Contact us at
          {" "}
          <a href={`mailto:${env.SUPPORT_EMAIL}`} target="_blank">{env.SUPPORT_EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};
