// AFTER DELETING I18N THIS BECOMES THE MAIN getSiteContext FILE
import { getContent } from "./getContent";

export async function getSiteContext(url: URL) {
	const content = await getContent("es");

	return {
		locale: "es",
		lang: "es",
		content,
		alternates: [],
		currentHreflang: "es-DO",
		ogLocale: "es_DO",
	};
}
