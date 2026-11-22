import { BUSINESS } from "@data/client";
import { SITE } from "@data/siteConfig";

export function getLocalBusinessSchema(origin, locale) {
	const sameAs = [];
	if (BUSINESS.socials?.facebook) sameAs.push(BUSINESS.socials.facebook);
	if (BUSINESS.socials?.instagram) sameAs.push(BUSINESS.socials.instagram);

	return {
		"@context": "https://schema.org",
		"@type": ["LocalBusiness", "WebSite"],
		name: BUSINESS.name,
		url: SITE.url,
		logo: origin + BUSINESS.logo,
		image: origin + BUSINESS.logo,
		telephone: BUSINESS.phoneForTel,
		openingHours: ["We-Su 18:45-24:00"],
		servesCuisine: "Dominican",
		priceRange: "RD$60 - RD$600",
		geo: {
			"@type": "GeoCoordinates",
			latitude: BUSINESS.geo.latitude,
			longitude: BUSINESS.geo.longitude,
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: `${BUSINESS.address.lineOne}, ${BUSINESS.address.lineTwo}`,
			addressLocality: BUSINESS.address.city,
			addressRegion: BUSINESS.address.state,
			postalCode: BUSINESS.address.zip,
		},
		sameAs: sameAs,
		inLanguage: locale,
	};
}
