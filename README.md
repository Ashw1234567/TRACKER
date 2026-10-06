# Batch Checklist Tracker — self-hosted version

A standalone version of your tracker: plain HTML/CSS/JS front end, plus a tiny
serverless API (`api/state.js`) that reads and writes one shared JSON record
in Vercel KV (a small free key-value database). No claude.ai dependency —
any browser that can load the page can read and save to it.

## Deploy it (about 5 minutes)

1. **Push to GitHub.** Create a new repo and push these three files, keeping
   the folder structure exactly as given (the `api/state.js` path matters —
   that's what makes Vercel treat it as a serverless function):
   - `index.html`
   - `package.json`
   - `api/state.js`

2. **Import into Vercel.** Go to vercel.com, sign in (GitHub login is
   easiest), choose **Add New → Project**, and import that repo. No build
   settings to change — click Deploy.

3. **Add a KV database.** Once the project exists, open it in the Vercel
   dashboard → **Storage** tab → **Create Database** → choose the KV option
   → create it → when asked, **connect it to this project**. Vercel wires
   up the needed environment variables automatically — you don't need to
   copy any keys yourself.

4. **Redeploy.** Connecting storage usually prompts a redeploy; if it
   doesn't, go to the **Deployments** tab and redeploy the latest one so the
   function picks up the new environment variables.

5. **Open it.** Visit the URL Vercel gives you (something like
   `https://your-project-name.vercel.app`) on your phone and your laptop.
   Both load and save through the same small API, so changes on one show up
   on the other (open the page again, or tap **Refresh**, to pull the
   latest — it's not instant push-sync, just a quick re-fetch).

6. **Send me the final URL.** The daily pending-students reminder email
   needs to know where to check — once you've deployed, give me the URL and
   I'll point the scheduled reminder at `https://your-project.vercel.app/api/state`.

## Optional: lock it down a little

By default the API has no password — anyone who finds the exact URL could
read or write your tracker. For a personal tool this is a minor risk (the
URL isn't listed anywhere public), but if you want a basic lock: in Vercel,
add an environment variable `TRACKER_SECRET` set to any random string, and
tell me — I'll update the page to send it with every request. Without it
set, the API stays open to anyone with the link.

## If something breaks

The page shows a small status line at the top right ("Synced", "Syncing…",
or "Couldn't sync (reason)"). If it ever shows an error, tap **Retry** — or
send me the error text in the parentheses and I'll fix it.
