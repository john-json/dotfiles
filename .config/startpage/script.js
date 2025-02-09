window.onload = () => {
	document.getElementsByTagName("body")[0].removeAttribute("class");
};

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
if (prefersDarkScheme.matches) {
	document.body.classList.add("dark-theme");
} else {
	document.body.classList.add("light-theme");
}

function updateClock() {
	const dateElement = document.getElementById("realTimeDate");

	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString("de-DE");
	console.log(formattedDate); // Output: "2024-12-21" (or similar format)

	const clockElement = document.getElementById("realTimeClock");

	// Get current time
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");

	// Format time
	const timeString = `${hours}:${minutes}`;
	const dateString = `${formattedDate}`;

	// Display time
	clockElement.textContent = timeString;
	dateElement.textContent = dateString;
}

// Initialize clock and update it every second
setInterval(updateClock, 1000);
updateClock(); // Call immediately to avoid initial delay

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", (event) => {
	const query = event.target.value;
	// Send AJAX request or make API call with the search query
	// Update search results display
});

const f = document.getElementById("form");
const q = document.getElementById("query");
const google = "https://www.google.com/search?q=site%3A+";
const site = "google.de";

function submitted(event) {
	event.preventDefault();
	const url = google + site + "+" + q.value;
	const win = window.open(url, "_blank");
	win.focus();
}

f.addEventListener("submit", submitted);
