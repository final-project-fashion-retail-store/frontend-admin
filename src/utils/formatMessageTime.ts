export function formatMessageTime(timestamp: string): string {
	const date = new Date(timestamp);

	// Format time as HH:MM
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const time = `${hours}:${minutes}`;

	// Format date as dd/mm/yy
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
	const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
	const dateStr = `${day}/${month}/${year}`;

	return `${time}, ${dateStr}`;
}
