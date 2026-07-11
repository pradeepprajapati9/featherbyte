/*
 * Featherbyte Cookie Banner
 * Lightweight (no dependencies) GDPR/CCPA consent banner for Shopify.
 * - Integrates with Shopify Customer Privacy API
 * - Updates Google Consent Mode v2 signals
 * - Never touches checkout, only the storefront
 */
(function () {
  "use strict";

  var cfg = window.FeatherbyteCookieConfig || {};
  var STORAGE_KEY = "featherbyte_consent_v1";

  /* ---- Google Consent Mode v2: default everything to denied ASAP ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  if (cfg.consentMode) {
    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500
    });
  }

  function pushConsentMode(consent) {
    if (!cfg.consentMode) return;
    var g = consent.analytics ? "granted" : "denied";
    var m = consent.marketing ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: g,
      ad_storage: m,
      ad_user_data: m,
      ad_personalization: m,
      functionality_storage: consent.preferences ? "granted" : "denied",
      personalization_storage: consent.preferences ? "granted" : "denied"
    });
  }

  /* ---- Shopify Customer Privacy API ---- */
  function applyShopifyConsent(consent) {
    try {
      var api = window.Shopify && window.Shopify.customerPrivacy;
      if (api && typeof api.setTrackingConsent === "function") {
        api.setTrackingConsent({
          analytics: !!consent.analytics,
          marketing: !!consent.marketing,
          preferences: !!consent.preferences,
          sale_of_data: !!consent.marketing
        }, function () {});
      }
    } catch (e) { /* never break the storefront */ }
  }

  function saveConsent(consent) {
    consent.ts = Date.now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (e) {}
    applyShopifyConsent(consent);
    pushConsentMode(consent);
  }

  function getStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  var GRANT_ALL = { analytics: true, marketing: true, preferences: true };
  var DENY_ALL = { analytics: false, marketing: false, preferences: false };

  /* ---- Decide whether to show the banner ---- */
  function shouldShow(cb) {
    if (getStored()) return cb(false); // already chose
    if (cfg.regionMode === "all") return cb(true);
    // EEA/UK only: rely on Shopify's region detection when available
    try {
      var api = window.Shopify && window.Shopify.customerPrivacy;
      if (api && typeof api.shouldShowBanner === "function") {
        return cb(api.shouldShowBanner());
      }
    } catch (e) {}
    // Fallback: rough timezone check for Europe
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      return cb(tz.indexOf("Europe") === 0);
    } catch (e) { return cb(true); }
  }

  /* ---- UI ---- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function styleVars(root) {
    root.style.setProperty("--fb-bg", cfg.bgColor || "#ffffff");
    root.style.setProperty("--fb-text", cfg.textColor || "#1a1a1a");
    root.style.setProperty("--fb-btn", cfg.btnColor || "#1a1a1a");
    root.style.setProperty("--fb-btn-text", cfg.btnTextColor || "#ffffff");
    root.style.setProperty("--fb-radius", (cfg.borderRadius != null ? cfg.borderRadius : 12) + "px");
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildBanner() {
    var wrap = el("div", "fb-cookie fb-pos-" + (cfg.position || "bottom-left"));
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Cookie consent");
    styleVars(wrap);

    var policyLink = cfg.policyUrl
      ? ' <a class="fb-link" href="' + escapeHtml(cfg.policyUrl) + '" target="_blank" rel="noopener">' + escapeHtml(cfg.policyText || "Privacy policy") + "</a>"
      : "";

    var card = el("div", "fb-card");
    card.appendChild(el("p", "fb-msg", escapeHtml(cfg.message) + policyLink));

    var actions = el("div", "fb-actions");
    var accept = el("button", "fb-btn fb-primary", escapeHtml(cfg.acceptText || "Accept all"));
    var decline = el("button", "fb-btn fb-ghost", escapeHtml(cfg.declineText || "Decline"));
    var prefs = el("button", "fb-btn fb-ghost", escapeHtml(cfg.prefsText || "Manage preferences"));
    actions.appendChild(accept);
    actions.appendChild(decline);
    actions.appendChild(prefs);
    card.appendChild(actions);

    /* preferences panel */
    var panel = el("div", "fb-prefs");
    panel.style.display = "none";
    var cats = [
      { key: "analytics", label: "Analytics" },
      { key: "marketing", label: "Marketing" },
      { key: "preferences", label: "Preferences" }
    ];
    var checks = {};
    cats.forEach(function (c) {
      var row = el("label", "fb-row");
      var cb = el("input");
      cb.type = "checkbox";
      cb.checked = true;
      checks[c.key] = cb;
      row.appendChild(cb);
      row.appendChild(el("span", null, c.label));
      panel.appendChild(row);
    });
    var save = el("button", "fb-btn fb-primary fb-save", escapeHtml(cfg.saveText || "Save preferences"));
    panel.appendChild(save);
    card.appendChild(panel);

    wrap.appendChild(card);

    function close() { wrap.parentNode && wrap.parentNode.removeChild(wrap); }

    accept.addEventListener("click", function () { saveConsent(Object.assign({}, GRANT_ALL)); close(); });
    decline.addEventListener("click", function () { saveConsent(Object.assign({}, DENY_ALL)); close(); });
    prefs.addEventListener("click", function () {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    });
    save.addEventListener("click", function () {
      saveConsent({
        analytics: checks.analytics.checked,
        marketing: checks.marketing.checked,
        preferences: checks.preferences.checked
      });
      close();
    });

    return wrap;
  }

  function show() {
    if (document.querySelector(".fb-cookie")) return;
    document.body.appendChild(buildBanner());
  }

  function init() {
    // re-apply stored consent on every page load
    var stored = getStored();
    if (stored) { applyShopifyConsent(stored); pushConsentMode(stored); return; }
    shouldShow(function (yes) { if (yes) show(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
