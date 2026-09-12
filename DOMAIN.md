# Domain setup — arcanenft.xyz

The domain is already purchased on Namecheap. Right now it still points at Namecheap parking, not this site.

This is **hosting + DNS only**. It is not Stage 2 (no X login, wallet, mint, or database).

## What you need

1. A free [Vercel](https://vercel.com) account (best host for this Next.js app, including later stages).
2. The Namecheap login that owns `arcanenft.xyz`.
3. This GitHub repo connected to Vercel.

I cannot change Namecheap or Vercel from here. Those two accounts are yours.

## 1. Deploy the site on Vercel

1. Open [vercel.com](https://vercel.com) and sign in with GitHub (`arcanenftarc`).
2. **Add New → Project** → import `arcanenftarc/arcane`.
3. Set the production branch to the branch that currently has the site (`cursor/arcane-stage1-frontend-a83c` until it is on `main`).
4. Environment variable:
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://arcanenft.xyz`
5. Deploy. You should get a temporary URL like `https://arcane-xxxx.vercel.app`. Open it and confirm Home loads.

Do not add secrets. Stage 1 does not need API keys.

## 2. Attach the domain in Vercel

1. Project → **Settings → Domains**.
2. Add `arcanenft.xyz`.
3. Also add `www.arcanenft.xyz` if Vercel offers it.
4. Set **arcanenft.xyz** as the primary domain (www should redirect to apex).
5. Copy the exact DNS values Vercel shows. Prefer those over any example below. Vercel sometimes uses a project-specific CNAME.

Typical values (confirm in the dashboard):

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `10.0.1.2` |
| CNAME | `www` | `cname.vercel-dns.com` |

## 3. Namecheap DNS (keep Namecheap nameservers)

Do **not** change nameservers to Vercel unless you want Vercel to own all DNS (email, future subdomains). Keep **Namecheap BasicDNS**.

1. Namecheap → **Domain List** → **Manage** on `arcanenft.xyz`.
2. **Sharing & Transfer / Redirect Domain**: set redirect to **None**. Parking must be off. The domain currently forwards to `www` via Namecheap URL Forward — that must be removed or HTTPS will fail.
3. Open **Advanced DNS**.
4. Delete parking / forwarding records, including:
   - URL Redirect records
   - A record `@` → `162.255.119.110` (current parking IP)
   - CNAME `www` → `parkingpage.namecheap.com`
5. Add the Vercel records from step 2. On Namecheap, Host for the apex is `@`, Host for www is `www`. TTL can stay Automatic.
6. Leave MX / email records alone if you add email later. Stage 1 does not need mail.

Save. DNS can take a few minutes to a few hours.

## 4. Confirm

When DNS has updated:

```bash
dig +short arcanenft.xyz A
# should be 10.0.1.2 (or the A value Vercel showed)

dig +short www.arcanenft.xyz CNAME
# should be a vercel-dns hostname
```

Then open:

- https://arcanenft.xyz
- https://www.arcanenft.xyz (should redirect to apex)

Vercel issues the SSL certificate automatically after DNS is correct. If the cert stays pending, wait, then click **Refresh** on the domain in Vercel. Conflicting parking or URL-redirect records are the usual cause.

## What not to do

- Do not point the domain at GitHub Pages for this project. Later stages need server routes (X login, APIs). Vercel keeps that path open.
- Do not put API keys in frontend env vars (`NEXT_PUBLIC_*`).
- Do not start whitelist / mint work until the live domain loads Stage 1.

## After it is live

Reply here with the live URL working. Then we can go to the next stage.
