export const BUSINESS = {
	name: "Cafetería La Movie",
	phoneForTel: "18292755220",
	phoneFormatted: "829-275-5220",
	whatsapp: "https://wa.me/18292755220",
	logo: "/assets/logo.svg",
	address: {
		lineOne: "C. 5.2 #53",
		lineTwo: "Santo Domingo Este 11903, República Dominicana",
		city: "Santo Domingo Este",
		state: "RD",
		zip: "11903",
		mapLink:
			"https://www.google.com/maps/search/?api=1&query=C.+5.2+%2353%2C+Santo+Domingo+Este+11903%2C+Rep%C3%BAblica+Dominicana",
	},
	// Geo kept: the old coordinates reverse-geocode to Calle S2, Katanga —
	// the same spot as the new address ("C. 5.2" reads as Calle S2).
	geo: { latitude: 18.5152884, longitude: -69.8661444 },
	hours: {
		open: "Miércoles a domingo · 6:45 PM – 12:00 AM",
		closed: "Lunes y martes · Cerrado",
		short: "Mié–Dom · 6:45 PM – 12 AM",
	},
};
