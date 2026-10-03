import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "apps", "calendar-forge");
const years = [2026, 2027];
const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const monthNames = months.map(name => name[0].toUpperCase() + name.slice(1));
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const site = "https://calendarforge.stream";

const usHolidays = {
  2026: {
    "2026-0-1": "New Year's Day", "2026-0-19": "Martin Luther King Jr. Day", "2026-1-16": "Washington's Birthday",
    "2026-4-25": "Memorial Day", "2026-5-19": "Juneteenth", "2026-6-3": "Independence Day (observed)",
    "2026-8-7": "Labor Day", "2026-9-12": "Columbus Day", "2026-10-11": "Veterans Day",
    "2026-10-26": "Thanksgiving Day", "2026-11-25": "Christmas Day"
  },
  2027: {
    "2027-0-1": "New Year's Day", "2027-0-18": "Martin Luther King Jr. Day", "2027-1-15": "Washington's Birthday",
    "2027-4-31": "Memorial Day", "2027-5-18": "Juneteenth (observed)", "2027-6-5": "Independence Day (observed)",
    "2027-8-6": "Labor Day", "2027-9-11": "Columbus Day", "2027-10-11": "Veterans Day",
    "2027-10-25": "Thanksgiving Day", "2027-11-24": "Christmas Day (observed)"
  }
};

const variants = [
  { slug: "printable-calendar", title: year => `Free Printable Calendar ${year}`, description: year => `Download a free printable ${year} calendar in PDF format. Choose a clean yearly layout, print it at home, and use the monthly pages for planning.`, heading: year => `Free Printable Calendar ${year}`, includeHolidays: true, weekStart: 0 },
  { slug: "calendar-pdf", title: year => `${year} Calendar PDF`, description: year => `Download a print-ready ${year} calendar PDF in A4 or US Letter size. The file is free, simple to print, and designed for everyday planning.`, heading: year => `${year} Calendar PDF`, includeHolidays: true, weekStart: 0 },
  { slug: "calendar-with-holidays", title: year => `${year} Calendar With US Holidays`, description: year => `Print a ${year} calendar with US federal holidays marked on the correct dates. Download the yearly calendar as an A4 or US Letter PDF.`, heading: year => `${year} Calendar With US Holidays`, includeHolidays: true, weekStart: 0 },
  { slug: "blank-calendar", title: year => `Blank Printable Calendar ${year}`, description: year => `Download a blank printable ${year} calendar for notes, appointments, school planning, or family schedules.`, heading: year => `Blank Printable Calendar ${year}`, includeHolidays: false, weekStart: 0 },
  { slug: "calendar-monday-start", title: year => `${year} Calendar Monday Start`, description: year => `Download a Monday-start printable ${year} calendar with weeks running from Monday through Sunday.`, heading: year => `${year} Calendar Monday Start`, includeHolidays: true, weekStart: 1 },
  { slug: "calendar-sunday-start", title: year => `${year} Calendar Sunday Start`, description: year => `Download a Sunday-start printable ${year} calendar with weeks running from Sunday through Saturday.`, heading: year => `${year} Calendar Sunday Start`, includeHolidays: true, weekStart: 0 }
];

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function write(file, content) { ensureDir(path.dirname(file)); fs.writeFileSync(file, content); }
function dateKey(year, month, day) { return `${year}-${month}-${day}`; }
function monthInfo(year, month, weekStart = 0) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay - weekStart + 7) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  return { offset, days, rows: Math.ceil((offset + days) / 7) };
}
function orderedWeekdays(weekStart) { return weekdays.slice(weekStart).concat(weekdays.slice(0, weekStart)); }
function holiday(year, month, day, includeHolidays) { return includeHolidays ? usHolidays[year]?.[dateKey(year, month, day)] || "" : ""; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character])); }
function pagePath(slug) { return path.join(appDir, slug, "index.html"); }
function pageUrl(slug) { return `${site}/${slug}/`; }
function downloadPath(year, slug, size) { return `../downloads/${year}/${slug}-${size}.pdf`; }

function calendarMarkup(year, month, { weekStart = 0, includeHolidays = true, large = false } = {}) {
  const info = monthInfo(year, month, weekStart);
  const labels = orderedWeekdays(weekStart);
  const cells = labels.map(label => `<span class="weekday">${label}</span>`);
  for (let index = 0; index < info.offset; index++) cells.push(`<span class="empty" aria-hidden="true"></span>`);
  for (let day = 1; day <= info.days; day++) {
    const name = holiday(year, month, day, includeHolidays);
    cells.push(`<span class="${name ? "holiday" : ""}">${day}${name ? `<small>${escapeHtml(name)}</small>` : ""}</span>`);
  }
  while (cells.length < 7 * (info.rows + 1)) cells.push(`<span class="empty" aria-hidden="true"></span>`);
  return `<div class="${large ? "large-month-grid" : "month-grid"}" role="grid" aria-label="${monthNames[month]} ${year} calendar">${cells.join("")}</div>`;
}

function yearMarkup(year, options) {
  return `<div class="year-grid">${months.map((month, index) => `<article class="month-card"><h3><a href="../${month}-${year}-calendar/">${monthNames[index]} ${year}</a></h3>${calendarMarkup(year, index, options)}</article>`).join("")}</div>`;
}

function relatedLinks(year, currentSlug) {
  const links = [
    ["printable-calendar", `Printable calendar ${year}`], ["calendar-pdf", `${year} calendar PDF`],
    ["calendar-with-holidays", `${year} calendar with holidays`], ["blank-calendar", `Blank calendar ${year}`],
    ["calendar-monday-start", `Monday-start calendar ${year}`], ["calendar-sunday-start", `Sunday-start calendar ${year}`]
  ].filter(([slug]) => slug !== currentSlug).map(([slug, label]) => `<a href="../${year}-${slug}/">${label}</a>`);
  links.push(`<a href="../">Calendar maker</a>`);
  return links.join("");
}

function pageDocument({ title, description, canonical, heading, lead, year, currentSlug, body, facts, downloadSlug }) {
  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: canonical, isPartOf: { "@type": "WebSite", name: "Calendar Forge", url: site } });
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Calendar Forge</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="../seo-pages.css">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header class="site-header"><div class="header-inner"><a class="brand" href="../" aria-label="Calendar Forge home"><span class="brand-mark">CF</span><span>Calendar Forge</span></a><nav class="nav" aria-label="Main navigation"><a href="../">Calendar maker</a><a href="../${year}-printable-calendar/">${year} calendars</a><a href="../${year}-calendar-with-holidays/">US holidays</a></nav></div></header>
  <main class="page-shell">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../">Home</a><span>/</span><a href="../${year}-printable-calendar/">${year} calendars</a><span>/</span><span>${escapeHtml(heading)}</span></nav>
    <p class="kicker">Free printable calendar resource</p>
    <h1>${escapeHtml(heading)}</h1>
    <p class="lead">${escapeHtml(lead)}</p>
    <div class="actions"><a class="button button-primary" href="${downloadPath(year, downloadSlug, "a4")}" download>Download A4 PDF</a><a class="button" href="${downloadPath(year, downloadSlug, "letter")}" download>Download US Letter PDF</a><a class="button" href="../?year=${year}#builder">Open in calendar maker</a></div>
    <div class="facts">${facts.map(([label, value]) => `<div class="fact"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`).join("")}</div>
    ${body}
    <section class="content-grid"><div><h2>How to use this calendar</h2><p>Download the PDF, print it at 100% scale, and choose either A4 or US Letter in your printer settings. The HTML preview above lets you check the dates before printing.</p><ul><li>Free PDF download with no account required.</li><li>Print at home or save the file for later.</li><li>Use the calendar maker to change the region, style, or month.</li></ul></div><aside class="source-note"><strong>Holiday data</strong><p>US holiday dates on this page are based on the federal holiday calendar. For official workplace closures, confirm dates with the <a href="https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/" rel="nofollow">US Office of Personnel Management</a>.</p></aside></section>
    <section class="related"><h2>More printable calendars</h2><div class="related-links">${relatedLinks(year, currentSlug)}</div></section>
  </main>
  <footer class="footer"><div class="footer-inner"><span>© 2026 Calendar Forge</span><span><a href="../">Create a calendar</a> · <a href="mailto:hello@calendarforge.stream">Contact</a></span></div></footer>
</body>
</html>`;
}

function monthPage({ year, month, variant }) {
  const name = monthNames[month];
  const slug = `${months[month]}-${year}-calendar`;
  const weekStart = variant?.weekStart ?? 0;
  const includeHolidays = variant?.includeHolidays ?? true;
  const title = `${name} ${year} Printable Calendar`;
  const description = `Download a free printable ${name} ${year} calendar in PDF format${includeHolidays ? " with US holidays marked" : ""}. Choose A4 or US Letter and print it at home.`;
  const body = `<section class="calendar-board large-month"><h2>${name} ${year}</h2><p>${includeHolidays ? "US federal holidays are highlighted." : "A clean blank month for notes, appointments, and planning."} Weeks start on ${weekStart === 1 ? "Monday" : "Sunday"}.</p>${calendarMarkup(year, month, { weekStart, includeHolidays, large: true })}</section>`;
  return pageDocument({ title, description, canonical: pageUrl(slug), heading: title, lead: description, year, currentSlug: "", body, facts: [["Format", "A4 and US Letter PDF"], ["Month", `${name} ${year}`], ["Week starts", weekStart === 1 ? "Monday" : "Sunday"]], downloadSlug: slug });
}

function createPages() {
  const sitemap = [];
  for (const year of years) {
    for (const variant of variants) {
      const slug = `${year}-${variant.slug}`;
      const title = variant.title(year);
      const description = variant.description(year);
      const body = `<section class="calendar-board"><h2>${year} monthly calendar</h2><p>${variant.includeHolidays ? "Public holidays are highlighted where applicable." : "No holidays are included, leaving space for your own notes."} Weeks start on ${variant.weekStart === 1 ? "Monday" : "Sunday"}.</p>${yearMarkup(year, { weekStart: variant.weekStart, includeHolidays: variant.includeHolidays })}</section>`;
      const html = pageDocument({ title, description, canonical: pageUrl(slug), heading: variant.heading(year), lead: description, year, currentSlug: variant.slug, body, facts: [["Year", String(year)], ["Paper", "A4 or US Letter"], ["Download", "Free PDF"]], downloadSlug: slug });
      write(pagePath(slug), html);
      sitemap.push(pageUrl(slug));
      for (let month = 0; month < 12; month++) {
        const monthSlug = `${months[month]}-${year}-calendar`;
        if (!fs.existsSync(pagePath(monthSlug))) {
          write(pagePath(monthSlug), monthPage({ year, month }));
        }
        sitemap.push(pageUrl(monthSlug));
      }
    }
  }
  return [...new Set(sitemap)];
}

function pdfEscape(value) { return String(value).replace(/[()\\]/g, character => `\\${character}`).replace(/[^\x20-\x7E]/g, ""); }
function pdfNumber(value) { return Number(value.toFixed(2)); }
function rgb(hex) { const value = hex.slice(1); return [0, 2, 4].map(index => (parseInt(value.slice(index, index + 2), 16) / 255).toFixed(3)).join(" "); }
function pdfDocument({ year, month = null, size, weekStart = 0, includeHolidays = true }) {
  const dimensions = size === "letter" ? [612, 792] : [595.28, 841.89];
  const [width, height] = dimensions;
  const commands = [];
  const text = (font, fontSize, x, y, value, color = "0.08 0.14 0.11") => commands.push(`${color} rg BT /${font} ${fontSize} Tf ${pdfNumber(x)} ${pdfNumber(y)} Td (${pdfEscape(value)}) Tj ET`);
  const fill = (x, y, w, h, color) => commands.push(`${rgb(color)} rg ${pdfNumber(x)} ${pdfNumber(y)} ${pdfNumber(w)} ${pdfNumber(h)} re f`);
  const line = (x1, y1, x2, y2) => commands.push(`${pdfNumber(x1)} ${pdfNumber(y1)} m ${pdfNumber(x2)} ${pdfNumber(y2)} l S`);
  commands.push("0.72 0.77 0.73 RG 0.6 w");
  if (month !== null) {
    const margin = 36, top = height - 74, gridWidth = width - margin * 2, headerHeight = 28, bottom = 72;
    const info = monthInfo(year, month, weekStart), cellWidth = gridWidth / 7, cellHeight = (top - headerHeight - bottom) / info.rows;
    text("F1", 26, margin, height - 40, `${monthNames[month]} ${year}`, rgb("#0d4e35"));
    text("F2", 10, margin, height - 57, `United States - ${weekStart === 1 ? "Monday" : "Sunday"} start`, rgb("#617069"));
    fill(margin, top - headerHeight, gridWidth, headerHeight, "#f4f5f0");
    const labels = orderedWeekdays(weekStart);
    labels.forEach((label, index) => text("F1", 8, margin + index * cellWidth + 7, top - 18, label.toUpperCase(), rgb("#0d4e35")));
    for (let column = 0; column <= 7; column++) line(margin + column * cellWidth, top, margin + column * cellWidth, bottom);
    for (let row = 0; row <= info.rows; row++) line(margin, top - headerHeight - row * cellHeight, width - margin, top - headerHeight - row * cellHeight);
    for (let day = 1; day <= info.days; day++) {
      const cell = info.offset + day - 1, row = Math.floor(cell / 7), column = cell % 7, name = holiday(year, month, day, includeHolidays);
      const x = margin + column * cellWidth + 8, y = top - headerHeight - row * cellHeight + cellHeight - 18;
      if (name) fill(margin + column * cellWidth + 1, top - headerHeight - (row + 1) * cellHeight + 1, cellWidth - 2, cellHeight - 2, "#f0f8f2");
      text("F1", 11, x, y, day, rgb("#15231e"));
      if (name) text("F2", 7, x, y - 14, name.slice(0, 24), rgb("#0d4e35"));
    }
    text("F2", 8, margin, 40, "Generated with Calendar Forge", rgb("#617069"));
  } else {
    const margin = 30, gap = 12, columns = 3, rows = 4, cardWidth = (width - margin * 2 - gap * 2) / columns, cardHeight = (height - 112 - gap * 3) / rows;
    text("F1", 25, margin, height - 43, `${year} Calendar`, rgb("#0d4e35"));
    text("F2", 9, margin, height - 59, `United States - ${weekStart === 1 ? "Monday" : "Sunday"} start`, rgb("#617069"));
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const column = monthIndex % columns, row = Math.floor(monthIndex / columns), x = margin + column * (cardWidth + gap), y = height - 88 - (row + 1) * cardHeight - row * gap;
      const info = monthInfo(year, monthIndex, weekStart), cellWidth = cardWidth / 7, headerHeight = 17, cellHeight = (cardHeight - headerHeight) / 6;
      text("F1", 9, x, y + cardHeight - 12, monthNames[monthIndex], rgb("#0d4e35"));
      fill(x, y + cardHeight - headerHeight, cardWidth, headerHeight, "#f4f5f0");
      for (let columnIndex = 0; columnIndex <= 7; columnIndex++) line(x + columnIndex * cellWidth, y + cardHeight, x + columnIndex * cellWidth, y);
      for (let rowIndex = 0; rowIndex <= 6; rowIndex++) line(x, y + cardHeight - headerHeight - rowIndex * cellHeight, x + cardWidth, y + cardHeight - headerHeight - rowIndex * cellHeight);
      orderedWeekdays(weekStart).forEach((label, index) => text("F2", 5, x + index * cellWidth + 2, y + cardHeight - 12, label[0], rgb("#617069")));
      for (let day = 1; day <= info.days; day++) {
        const cell = info.offset + day - 1, dayRow = Math.floor(cell / 7), dayColumn = cell % 7, name = holiday(year, monthIndex, day, includeHolidays);
        const dayX = x + dayColumn * cellWidth + 2, dayY = y + cardHeight - headerHeight - (dayRow + 1) * cellHeight + cellHeight - 8;
        if (name) fill(x + dayColumn * cellWidth + .4, y + cardHeight - headerHeight - (dayRow + 1) * cellHeight + .4, cellWidth - .8, cellHeight - .8, "#f0f8f2");
        text("F2", 6, dayX, dayY, day, rgb("#15231e"));
      }
    }
  }
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`
  ];
  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", offsets = [0];
  objects.forEach((object, index) => { offsets[index + 1] = Buffer.byteLength(pdf, "binary"); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "binary");
}

function createDownloads() {
  for (const year of years) {
    const dir = path.join(appDir, "downloads", String(year));
    for (const variant of variants) {
      for (const size of ["a4", "letter"]) write(path.join(dir, `${year}-${variant.slug}-${size}.pdf`), pdfDocument({ year, size, weekStart: variant.weekStart, includeHolidays: variant.includeHolidays }));
    }
    for (let month = 0; month < 12; month++) {
      const slug = `${months[month]}-${year}-calendar`;
      for (const size of ["a4", "letter"]) write(path.join(dir, `${slug}-${size}.pdf`), pdfDocument({ year, month, size }));
    }
  }
}

function createSitemap(urls) {
  const allUrls = [`${site}/`, ...urls].sort();
  const entries = allUrls.map(url => `<url><loc>${url}</loc><changefreq>monthly</changefreq><priority>${url === `${site}/` ? "1.0" : "0.7"}</priority></url>`).join("\n  ");
  write(path.join(appDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${entries}\n</urlset>\n`);
}

const urls = createPages();
createDownloads();
createSitemap(urls);
console.log(`Generated ${urls.length} calendar SEO pages and ${years.length * (variants.length * 2 + months.length * 2)} PDF files.`);
