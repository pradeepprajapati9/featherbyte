const wrap = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "48px 20px 80px",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#1a1a1a",
  lineHeight: 1.6,
};
const h1 = { fontSize: 32, marginBottom: 4 };
const h2 = { fontSize: 20, marginTop: 32, marginBottom: 8 };
const muted = { color: "#666", fontSize: 14 };

export const meta = () => [{ title: "Privacy Policy — Featherbyte Cookie Banner" }];

export default function Privacy() {
  return (
    <main style={wrap}>
      <h1 style={h1}>Privacy Policy</h1>
      <p style={muted}>Featherbyte Cookie Banner · Last updated: 11 July 2026</p>

      <p style={{ marginTop: 24 }}>
        Featherbyte Cookie Banner (“Featherbyte”, “we”, “us”) is a Shopify app
        that helps merchants show a GDPR/CCPA cookie consent banner on their
        storefront. This policy explains what data we handle.
      </p>

      <h2 style={h2}>Data we collect from merchants</h2>
      <p>
        When you install the app, Shopify provides us with your store domain and
        an access token so the app can run inside your admin. We store only this
        session information. We do not collect your products, orders, or customer
        lists.
      </p>

      <h2 style={h2}>Data about your shoppers</h2>
      <p>
        Featherbyte does <strong>not</strong> collect, store, or transmit any
        personal data about your storefront visitors. A shopper’s cookie consent
        choice is saved in that shopper’s own browser (localStorage) and is also
        passed to Shopify’s Customer Privacy API and, if enabled, Google Consent
        Mode. It never reaches our servers.
      </p>

      <h2 style={h2}>How we use data</h2>
      <p>
        The merchant session data is used solely to authenticate your store,
        render the app, and process app subscription billing through Shopify. We
        never sell or share it.
      </p>

      <h2 style={h2}>Data retention & deletion</h2>
      <p>
        When you uninstall the app, your session data is deleted. Because we hold
        no shopper personal data, GDPR/CCPA data-access and erasure requests
        (via Shopify’s compliance webhooks) have nothing to return or delete, and
        we acknowledge them automatically.
      </p>

      <h2 style={h2}>Sub-processors</h2>
      <p>
        We host the app on Render and store session data with Neon (PostgreSQL).
        Billing is handled by Shopify.
      </p>

      <h2 style={h2}>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:prajapatipradeepkumar954@gmail.com">
          prajapatipradeepkumar954@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
