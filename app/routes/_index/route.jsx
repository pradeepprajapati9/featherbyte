import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Featherbyte Cookie Banner</h1>
        <p className={styles.text}>
          A fast, lightweight GDPR &amp; CCPA cookie consent banner for Shopify —
          with Google Consent Mode v2 built in. No page-speed hit, no broken
          checkout.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Feather-light</strong>. A tiny script — your store stays fast
            and keeps its Google ranking.
          </li>
          <li>
            <strong>Checkout-safe</strong>. Never touches or breaks your cart or
            checkout.
          </li>
          <li>
            <strong>Google Consent Mode v2</strong>. Sends the correct signals so
            your Google Ads &amp; Analytics keep working.
          </li>
        </ul>
      </div>
    </div>
  );
}
