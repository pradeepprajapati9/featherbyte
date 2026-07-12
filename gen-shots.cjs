const sharp = require('sharp');

const W = 1600, H = 900;
const cap = (title) => `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#0ea5a4"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="#eef1f7"/>
  <rect width="1600" height="150" fill="url(#bg)"/>
  <text x="60" y="95" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff">${title}</text>
`;
const font = 'Arial, sans-serif';

// ---- Screenshot 1: storefront + banner ----
const s1 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${cap('Feather-light cookie consent — no page-speed hit')}
<rect x="60" y="200" width="1480" height="640" rx="16" fill="#ffffff" stroke="#e3e6ee"/>
<rect x="60" y="200" width="1480" height="64" rx="16" fill="#111827"/>
<rect x="60" y="240" width="1480" height="24" fill="#111827"/>
<text x="740" y="240" font-family="${font}" font-size="22" font-weight="700" fill="#ffffff">Featherbyte</text>
<text x="110" y="240" font-family="${font}" font-size="18" fill="#c7cdd9">Home   Catalog   Contact</text>
<rect x="60" y="264" width="1480" height="576" fill="#dfe7ee"/>
<text x="140" y="430" font-family="${font}" font-size="52" font-weight="800" fill="#1f2937">Your store, still fast</text>
<text x="140" y="480" font-family="${font}" font-size="24" fill="#4b5563">Compliance without the page-speed hit.</text>
<!-- cookie banner card -->
<g>
<rect x="120" y="590" width="470" height="210" rx="14" fill="#ffffff" stroke="#e3e6ee"/>
<text x="150" y="640" font-family="${font}" font-size="19" fill="#1a1a1a">We use cookies to improve your experience,</text>
<text x="150" y="666" font-family="${font}" font-size="19" fill="#1a1a1a">analyze traffic, and for marketing.</text>
<rect x="150" y="700" width="130" height="46" rx="8" fill="#1a1a1a"/>
<text x="215" y="729" font-family="${font}" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">Accept all</text>
<rect x="292" y="700" width="110" height="46" rx="8" fill="#ffffff" stroke="#cbd0da"/>
<text x="347" y="729" font-family="${font}" font-size="17" fill="#1a1a1a" text-anchor="middle">Decline</text>
<rect x="414" y="700" width="150" height="46" rx="8" fill="#ffffff" stroke="#cbd0da"/>
<text x="489" y="729" font-family="${font}" font-size="16" fill="#1a1a1a" text-anchor="middle">Manage prefs</text>
</g>
</svg>`;

// ---- Screenshot 2: admin setup ----
const s2 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${cap('Set up in 2 minutes — one theme toggle')}
<text x="60" y="250" font-family="${font}" font-size="34" font-weight="800" fill="#1f2937">Featherbyte Cookie Banner</text>
<!-- welcome card -->
<rect x="60" y="290" width="900" height="120" rx="14" fill="#ffffff" stroke="#e3e6ee"/>
<text x="90" y="335" font-family="${font}" font-size="24" font-weight="700" fill="#111827">Welcome 👋 Let’s get you compliant</text>
<text x="90" y="372" font-family="${font}" font-size="19" fill="#4b5563">Fast, lightweight GDPR &amp; CCPA banner with Google Consent Mode v2.</text>
<!-- steps card -->
<rect x="60" y="430" width="900" height="380" rx="14" fill="#ffffff" stroke="#e3e6ee"/>
<text x="90" y="480" font-family="${font}" font-size="22" font-weight="700" fill="#111827">Setup — 3 steps</text>
<text x="90" y="535" font-family="${font}" font-size="20" fill="#1f2937">1. Turn the banner on (App embeds → toggle).</text>
<text x="90" y="585" font-family="${font}" font-size="20" fill="#1f2937">2. Customise text, colours &amp; position.</text>
<text x="90" y="635" font-family="${font}" font-size="20" fill="#1f2937">3. Add your privacy policy link.</text>
<rect x="90" y="680" width="200" height="52" rx="9" fill="#4f46e5"/>
<text x="190" y="713" font-family="${font}" font-size="19" font-weight="700" fill="#ffffff" text-anchor="middle">Enable banner</text>
<!-- plan card -->
<rect x="1000" y="290" width="540" height="230" rx="14" fill="#ffffff" stroke="#e3e6ee"/>
<text x="1030" y="340" font-family="${font}" font-size="22" font-weight="700" fill="#111827">Your plan</text>
<text x="1030" y="385" font-family="${font}" font-size="19" fill="#4b5563">Free — full banner, all core features.</text>
<text x="1030" y="430" font-family="${font}" font-size="22" font-weight="800" fill="#111827">Pro — $6.99/mo</text>
<text x="1030" y="465" font-family="${font}" font-size="18" fill="#6b7280">14-day free trial</text>
</svg>`;

// ---- Screenshot 3: features ----
const tile = (x, title, l1, l2) => `
<rect x="${x}" y="300" width="440" height="420" rx="16" fill="#ffffff" stroke="#e3e6ee"/>
<circle cx="${x+70}" cy="380" r="40" fill="#eef2ff"/>
<text x="${x+70}" y="393" font-family="${font}" font-size="34" text-anchor="middle">✔</text>
<text x="${x+40}" y="470" font-family="${font}" font-size="26" font-weight="800" fill="#111827">${title}</text>
<text x="${x+40}" y="515" font-family="${font}" font-size="19" fill="#4b5563">${l1}</text>
<text x="${x+40}" y="543" font-family="${font}" font-size="19" fill="#4b5563">${l2}</text>`;
const s3 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${cap('GDPR, CCPA &amp; Google Consent Mode v2')}
${tile(60,'Feather-light','A tiny script — your','store stays fast.')}
${tile(580,'Checkout-safe','Never touches or breaks','your cart or checkout.')}
${tile(1100,'Consent Mode v2','Keeps your Google Ads','&amp; Analytics working.')}
</svg>`;

const shots = [['screenshot-1.png', s1], ['screenshot-2.png', s2], ['screenshot-3.png', s3]];
(async () => {
  for (const [name, svg] of shots) {
    await sharp(Buffer.from(svg)).png({compressionLevel:9, palette:true}).toFile(name);
    const kb = (require('fs').statSync(name).size/1024).toFixed(0);
    console.log(name + ' -> ' + kb + ' KB');
  }
})();
