import { writeFile } from "node:fs/promises";
import { loadEnv } from "vite";
import { categories, products } from "../src/data/products";

const domain = "https://mediline.asia";
const environment = loadEnv("production", process.cwd(), "VITE_");
const sitemapProducts =
  environment.VITE_SHOW_DEMO_PRODUCTS === "false"
    ? products.filter((product) => !product.isDemo)
    : products;
const locales = ["ru", "kz", "en"] as const;
const paths = ["", "/catalog", "/about", "/contacts"];

for (const category of categories) paths.push(`/catalog/${category.slug}`);
for (const product of sitemapProducts) paths.push(`/product/${product.slug}`);

const urls = locales.flatMap((locale) =>
  paths.map((path) => `${domain}/${locale}${path}`),
);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;

await writeFile("public/sitemap.xml", sitemap);
process.stdout.write(`Создан sitemap.xml: ${urls.length} адресов\n`);
