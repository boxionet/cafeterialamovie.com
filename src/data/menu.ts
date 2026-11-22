import type { ImageMetadata } from "astro";
import menuData from "./menu.json";

// Dish photos live in src/assets/images/dishes/ (31 real WebP + 29 recreated
// black-plate JPG). Resolved with import.meta.glob so <Image> gets real
// metadata without 35 static imports.
const images = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/images/dishes/*.{webp,jpg}",
	{ eager: true },
);

export function dishImage(file: string): ImageMetadata {
	const entry = images[`/src/assets/images/dishes/${file}`];
	if (!entry) throw new Error(`Missing dish image: ${file}`);
	return entry.default;
}

export interface DishOption {
	label: string;
	price: number;
}

export interface Dish {
	id: string;
	name: string;
	desc: string;
	category: string;
	/** real photo file in src/assets/images/dishes/ */
	photo: string;
	/** recreated black-plate shot (all 29 dishes have one) */
	platePhoto?: string;
	options: DishOption[];
}

export interface Category {
	id: string;
	label: string;
}

// The menu lives in menu.json so it can be edited from Decap CMS (/admin).
// This file keeps the typed API the rest of the site imports.
export const CATEGORIES: Category[] = menuData.categories;
export const DISHES: Dish[] = menuData.dishes;

export interface Favorite {
	dishId: string;
	/** display name on the favorites card (may differ from the menu name) */
	name: string;
	desc: string;
	/** which option the "Pedir ahora" button adds */
	optionIndex: number;
}

export const FAVORITES: Favorite[] = [
	{
		dishId: "hamburguesa",
		name: "Hamburguesa con papas",
		desc: "Con papas fritas y salsas de la casa.",
		optionIndex: 1,
	},
	{
		dishId: "mofongo-longaniza",
		name: "Mofongo con longaniza",
		desc: "Mofongo con queso y longaniza.",
		optionIndex: 0,
	},
	{
		dishId: "yaroa",
		name: "Yaroa de pollo",
		desc: "Queso derretido, pollo y salsas.",
		optionIndex: 0,
	},
	{
		dishId: "camarones-criolla",
		name: "Camarones a la criolla",
		desc: "Con mofongo o fritos.",
		optionIndex: 0,
	},
];

export function getDish(id: string): Dish {
	const dish = DISHES.find((d) => d.id === id);
	if (!dish) throw new Error(`Unknown dish: ${id}`);
	return dish;
}

export function formatPrice(price: number): string {
	return `RD$${price}`;
}
