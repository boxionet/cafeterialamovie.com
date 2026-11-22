// Real Google reviews for Cafetería La Movie (checked 2026-11-22).
// 5.0 stars, 7 reviews, all 5 stars. Text copied exactly as shown on
// Google Maps; three reviewers left stars only (text: null).
// Do not invent review text — update this file only from the live listing.

export interface Review {
	name: string;
	initial: string;
	color: string;
	ink: string;
	date: string;
	text: string | null;
}

export const REVIEWS: Review[] = [
	{
		name: "Alba Nelly Sanchez",
		initial: "A",
		color: "#5F9B0A",
		ink: "#fff",
		date: "hace 4 años",
		text: "Buen servicio, calidad e higiene",
	},
	{
		name: "robert santana",
		initial: "r",
		color: "#FE0500",
		ink: "#fff",
		date: "hace 4 años",
		text: "Muy buen servicio y buenos precios",
	},
	{
		name: "La Muñekita Morilla",
		initial: "L",
		color: "#D87F2A",
		ink: "#fff",
		date: "hace 5 años",
		text: "Muy buen servicio y buenos platos y muy buena",
	},
	{
		name: "Deivi One TVcatanga siri",
		initial: "D",
		color: "#FDCC00",
		ink: "#000",
		date: "hace 4 años",
		text: "👍🏻👍🏻👍🏻👍🏻",
	},
	{
		name: "maria victoria jimenez hernandez",
		initial: "m",
		color: "#5F9B0A",
		ink: "#fff",
		date: "hace 3 años",
		text: null,
	},
	{
		name: "Miguelina Feliz",
		initial: "M",
		color: "#FE0500",
		ink: "#fff",
		date: "hace 4 años",
		text: null,
	},
	{
		name: "Frank carlos Peña guzman",
		initial: "F",
		color: "#D87F2A",
		ink: "#fff",
		date: "hace 5 años",
		text: null,
	},
];
