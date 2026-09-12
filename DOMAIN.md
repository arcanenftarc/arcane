# Domain setup — arcanenft.xyz on Cloudflare

Yes. Use Cloudflare. Namecheap only keeps the registration. Cloudflare handles DNS, HTTPS, and hosting.

This is **not** Stage 2. No X login, wallet, mint, or database.

Right now the domain still sits on Namecheap parking. That has to come off before Cloudflare will issue SSL.

## What you need

1. Your usual Cloudflare account
2. The Namecheap login that owns `arcanenft.xyz`
3. This GitHub repo (`arcanenftarc/arcane`)

I cannot change those accounts from here.

## 1. Add the zone in Cloudflare

1. Cloudflare dashboard → **Add a domain** → `arcanenft.xyz`
2. Choose the **Free** plan
3. Cloudflare will show two nameservers, for example:
   - `xxxx.ns.cloudflare.com`
   - `yyyy.ns.cloudflare.com`
4. Copy those exactly. They are unique to your account.

Do not edit DNS records yet. Parking is still at Namecheap until nameservers move.

## 2. Point Namecheap at Cloudflare

1. Namecheap → **Domain List** → **Manage** on `arcanenft.xyz`
2. Turn **Redirect Domain / Parking** off. There is currently a Namecheap URL forward to `www` — leave that on and SSL will fail.
3. **Nameservers** → **Custom DNS**
4. Paste the two Cloudflare nameservers
5. Save. Do not keep Namecheap BasicDNS.

Wait until Cloudflare shows the zone as **Active**. That can be a few minutes to a few hours.

## 3. Deploy the app on Cloudflare

This Next.js app deploys as a **Worker** (OpenNext). That is the current Cloudflare path for App Router, and it still works for later stages.

### Option A — Git (usual)

1. Cloudflare → **Workers & Pages** → **Create** → connect GitHub
2. Select `arcanenftarc/arcane`
3. Production branch: `cursor/arcane-stage1-frontend-a83c` until the site is on `main`
4. Build settings if asked:
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command / framework: Cloudflare’s Next.js / OpenNext preset if shown
5. Environment variable:
   - `NEXT_PUBLIC_SITE_URL` = `https://arcanenft.xyz`
6. Deploy. Confirm the `*.workers.dev` URL loads Home.

### Option B — CLI from this repo

```bash
cp .dev.vars.example .dev.vars
npx wrangler login
npm run deploy
```

## 4. Attach arcanenft.xyz in Cloudflare

After the Worker is live:

1. Worker → **Settings → Domains & Routes** (or **Custom Domains**)
2. Add `arcanenft.xyz`
3. Add `www.arcanenft.xyz`
4. Cloudflare will create the DNS records in the zone. Proxy (orange cloud) is fine.

Then add a **Redirect Rule** (or keep the app redirect):

- From: `www.arcanenft.xyz/*`
- To: `https://arcanenft.xyz/$1`
- Status: 301

Do not add competing A records to Namecheap parking IPs. Once nameservers are Cloudflare, Namecheap Advanced DNS is ignored.

## 5. Confirm

```bash
dig +short NS arcanenft.xyz
# two *.ns.cloudflare.com hosts

dig +short arcanenft.xyz A
# Cloudflare anycast IPs, not 162.255.119.110
```

Open:

- https://arcanenft.xyz
- https://www.arcanenft.xyz (should land on apex)

SSL is issued by Cloudflare automatically when the zone is active and the custom domain is attached.

## What not to do

- Do not keep Namecheap URL Forward or parking on
- Do not mix Vercel A records with Cloudflare nameservers
- Do not put secrets in `NEXT_PUBLIC_*`
- Do not start whitelist / mint until the live domain serves Stage 1

## After it is live

Reply here when https://arcanenft.xyz shows the site. Then we can go to the next stage.
