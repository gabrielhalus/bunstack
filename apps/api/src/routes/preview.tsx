import { Hono } from "hono";
import ReactDOMServer from "react-dom/server";

import { AccountVerification } from "@bunstack/api/emails/account-verification";

export default new Hono()
  /**
   * Send account verification email
   * @param c - The context
   * @returns
   */
  .get("/account-verification", async (c) => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <AccountVerification
        name="Preview User"
        link=""
      />,
    );
    return c.html(html);
  });
