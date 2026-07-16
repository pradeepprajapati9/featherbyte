import { useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate, PRO_PLAN } from "../shopify.server";

async function hasActiveSubscription(admin) {
  try {
    const resp = await admin.graphql(
      `#graphql
      query { currentAppInstallation { activeSubscriptions { status } } }`,
    );
    const data = await resp.json();
    return (
      data?.data?.currentAppInstallation?.activeSubscriptions || []
    ).some((s) => s.status === "ACTIVE");
  } catch (e) {
    return false;
  }
}

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;
  const editorUrl = `https://${shop}/admin/themes/current/editor?context=apps`;
  const isPro = await hasActiveSubscription(admin);
  return { shop, editorUrl, isPro };
};

export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  // Don't create a second charge if one is already active.
  if (await hasActiveSubscription(admin)) {
    return { alreadyActive: true, confirmationUrl: null, errors: [] };
  }

  const returnUrl = `${process.env.SHOPIFY_APP_URL}/app?shop=${session.shop}`;

  const response = await admin.graphql(
    `#graphql
    mutation CreateSubscription($name: String!, $returnUrl: URL!, $test: Boolean!, $trialDays: Int!, $lineItems: [AppSubscriptionLineItemInput!]!) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, test: $test, trialDays: $trialDays, lineItems: $lineItems) {
        userErrors { field message }
        confirmationUrl
        appSubscription { id status }
      }
    }`,
    {
      variables: {
        name: "Featherbyte Pro",
        returnUrl,
        test: false,
        trialDays: 14,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: 6.99, currencyCode: "USD" },
                interval: "EVERY_30_DAYS",
              },
            },
          },
        ],
      },
    },
  );

  const json = await response.json();
  const result = json.data?.appSubscriptionCreate;
  return {
    confirmationUrl: result?.confirmationUrl || null,
    errors: result?.userErrors || [],
  };
};

export default function Index() {
  const { editorUrl, isPro } = useLoaderData();
  const fetcher = useFetcher();

  useEffect(() => {
    const url = fetcher.data?.confirmationUrl;
    if (url) {
      // App Bridge intercepts open(_top) to redirect the top frame to the
      // Shopify charge-approval screen.
      open(url, "_top");
    }
  }, [fetcher.data]);

  const upgrade = () => fetcher.submit({}, { method: "POST" });
  const upgrading = fetcher.state !== "idle";

  return (
    <s-page heading="Featherbyte Cookie Banner">
      <s-button
        slot="primary-action"
        href={editorUrl}
        target="_blank"
        variant="primary"
      >
        Enable banner
      </s-button>

      <s-section heading="Welcome 👋 Let’s get you compliant in 2 minutes">
        <s-paragraph>
          Featherbyte adds a lightweight cookie consent banner to your
          storefront — GDPR &amp; CCPA ready, with Google Consent Mode v2 built
          in. No page-speed hit, no broken checkout.
        </s-paragraph>
      </s-section>

      <s-section heading="Setup — 3 steps">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            <s-text><strong>1. Turn the banner on.</strong></s-text> Click
            “Enable banner” above. In the theme editor, toggle Cookie Banner on
            under App embeds, then Save.
          </s-paragraph>
          <s-paragraph>
            <s-text><strong>2. Customize it.</strong></s-text> Change text,
            colours, position and who sees it (EU/EEA only or all visitors)
            right in the theme editor.
          </s-paragraph>
          <s-paragraph>
            <s-text><strong>3. Add your privacy policy link.</strong></s-text>{" "}
            Paste your store’s privacy policy URL so shoppers can read your
            terms.
          </s-paragraph>
          <s-box>
            <s-button href={editorUrl} target="_blank" variant="primary">
              Open theme editor
            </s-button>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Why merchants choose Featherbyte">
        <s-unordered-list>
          <s-list-item>
            <s-text><strong>Feather-light.</strong></s-text> No heavy scripts —
            your store stays quick and keeps its Google ranking.
          </s-list-item>
          <s-list-item>
            <s-text><strong>Checkout-safe.</strong></s-text> Never touches or
            breaks your cart or checkout.
          </s-list-item>
          <s-list-item>
            <s-text><strong>Google Consent Mode v2.</strong></s-text> Sends the
            correct signals so your Google Ads &amp; Analytics keep working.
          </s-list-item>
          <s-list-item>
            <s-text><strong>Shopify Customer Privacy API.</strong></s-text>{" "}
            Consent is recorded the way Shopify expects.
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Your plan">
        {isPro ? (
          <s-paragraph>
            You’re on <s-text><strong>Featherbyte Pro</strong></s-text> 🎉
            Thanks for supporting us!
          </s-paragraph>
        ) : (
          <s-stack direction="block" gap="base">
            <s-paragraph>
              You’re on the <s-text><strong>Free</strong></s-text> plan. Upgrade
              to Pro for priority support and no branding.
            </s-paragraph>
            <s-paragraph>
              <s-text><strong>$6.99/month</strong></s-text> · 14-day free trial
            </s-paragraph>
            <s-box>
              <s-button
                variant="primary"
                onClick={upgrade}
                {...(upgrading ? { loading: true } : {})}
              >
                Upgrade to Pro
              </s-button>
            </s-box>
            {fetcher.data?.errors?.length > 0 && (
              <s-paragraph>
                <s-text tone="critical">
                  {fetcher.data.errors.map((e) => e.message).join(", ")}
                </s-text>
              </s-paragraph>
            )}
          </s-stack>
        )}
      </s-section>

      <s-section slot="aside" heading="Need help?">
        <s-paragraph>
          Email prajapatipradeepkumar954@gmail.com and we’ll reply fast — a real
          person, not an auto-bot.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
