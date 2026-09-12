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
  }
}

const workflow = path.join(root, ".github", "workflows", "deploy-calendar-forge.yml");
if (!fs.existsSync(workflow)) errors.push("calendar-forge: missing dedicated deployment workflow");
else {
  const workflowText = fs.readFileSync(workflow, "utf8");
  for (const expected of ["apps/calendar-forge/**", "path: apps/calendar-forge", "actions/deploy-pages@v4"]) {
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
