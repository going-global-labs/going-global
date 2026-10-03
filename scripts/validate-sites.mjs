import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "config", "sites.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];

for (const site of manifest.sites) {
  const appPath = path.join(root, site.path);
  const entryPath = path.join(appPath, "index.html");
  if (!fs.existsSync(appPath)) errors.push(`${site.id}: missing app directory ${site.path}`);
  if (!fs.existsSync(entryPath)) errors.push(`${site.id}: missing index.html`);

  if (site.id === "calendar-forge") {
    const requiredFiles = ["CNAME", "robots.txt", "sitemap.xml"];
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(appPath, file))) errors.push(`${site.id}: missing ${file}`);
    }
    if (fs.existsSync(path.join(appPath, "CNAME"))) {
      const cname = fs.readFileSync(path.join(appPath, "CNAME"), "utf8").trim();
      if (cname !== site.productionDomain) errors.push(`${site.id}: CNAME does not match productionDomain`);
    }
    for (const file of ["robots.txt", "sitemap.xml", "index.html"]) {
      const content = fs.readFileSync(path.join(appPath, file), "utf8");
      if (content.includes("calendarforge.example")) errors.push(`${site.id}: placeholder domain remains in ${file}`);
    }
    for (const expectedPage of ["2026-printable-calendar/index.html", "2027-printable-calendar/index.html", "january-2026-calendar/index.html", "january-2027-calendar/index.html"]) {
      if (!fs.existsSync(path.join(appPath, expectedPage))) errors.push(`${site.id}: missing generated SEO page ${expectedPage}`);
    }
    const sitemap = fs.readFileSync(path.join(appPath, "sitemap.xml"), "utf8");
    if ((sitemap.match(/<loc>/g) || []).length < 30) errors.push(`${site.id}: sitemap contains fewer than 30 URLs`);
    const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
    for (const url of sitemapUrls) {
      try {
        const parsed = new URL(url);
        if (parsed.origin !== `https://${site.productionDomain}`) {
          errors.push(`${site.id}: sitemap URL uses the wrong origin: ${url}`);
          continue;
        }
        const relativePath = decodeURIComponent(parsed.pathname).replace(/^\/+|\/+$/g, "");
        const filePath = relativePath
          ? path.join(appPath, relativePath, "index.html")
          : path.join(appPath, "index.html");
        if (!fs.existsSync(filePath)) errors.push(`${site.id}: sitemap URL has no matching file: ${url}`);
      } catch {
        errors.push(`${site.id}: sitemap contains an invalid URL: ${url}`);
      }
    }
    if (!fs.existsSync(path.join(appPath, "downloads", "2026", "2026-printable-calendar-a4.pdf"))) errors.push(`${site.id}: missing generated 2026 PDF`);
    if (!fs.existsSync(path.join(appPath, "downloads", "2027", "2027-printable-calendar-a4.pdf"))) errors.push(`${site.id}: missing generated 2027 PDF`);
  }
}

const workflow = path.join(root, ".github", "workflows", "deploy-calendar-forge.yml");
if (!fs.existsSync(workflow)) errors.push("calendar-forge: missing dedicated deployment workflow");
else {
  const workflowText = fs.readFileSync(workflow, "utf8");
  for (const expected of ["apps/calendar-forge/**", "node scripts/generate-calendar-seo-pages.mjs", "node scripts/validate-sites.mjs", "path: apps/calendar-forge", "actions/deploy-pages@v4"]) {
    if (!workflowText.includes(expected)) errors.push(`deploy-calendar-forge.yml: missing ${expected}`);
  }
}

if (errors.length) {
  console.error("Site validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${manifest.sites.length} site applications.`);
for (const site of manifest.sites) console.log(`- ${site.id}: ${site.status} (${site.path})`);
