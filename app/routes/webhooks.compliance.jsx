import { authenticate } from "../shopify.server";

/*
 * Mandatory GDPR/CCPA compliance webhooks:
 *   - customers/data_request
 *   - customers/redact
 *   - shop/redact
 *
 * Featherbyte stores no personal customer data. Consent choices live in the
 * shopper's own browser (localStorage), and we only keep the shop's session
 * token. So there is nothing to return or delete — we simply acknowledge.
 */
export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Compliance webhook received: ${topic} for ${shop}`);

  // No personal data stored → nothing to export or erase. Acknowledge with 200.
  return new Response(null, { status: 200 });
};
