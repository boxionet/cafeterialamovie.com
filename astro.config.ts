import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/data/siteConfig";

export default defineConfig({
	site: SITE.url,
	i18n: {
		defaultLocale: "es",
		locales: ["es"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	trailingSlash: "always",
	compressHTML: true,
	integrations: [
		icon(),
		sitemap({
			filter: (page) => !page.includes("/admin"),
			i18n: {
				defaultLocale: "es",
				locales: { es: "es-DO" },
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Lilita One",
			cssVariable: "--font-display",
			fallbacks: ["Arial Black", "sans-serif"],
			weights: [400],
			styles: ["normal"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Playfair Display",
			cssVariable: "--font-serif",
			fallbacks: ["Georgia", "serif"],
			weights: [600, 700],
			styles: ["normal"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Nunito",
			cssVariable: "--font-primary",
			fallbacks: ["Arial", "sans-serif"],
			weights: [400, 600, 700, 800],
			styles: ["normal"],
		},
	],
});
