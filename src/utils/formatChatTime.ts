export const formatChatTime = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
	}

	// If it's more than 24 hours, check if it's within the same day or yesterday for "X days ago"
	const daysDiff = Math.floor(diffInHours / 24);

	// Get the start of "today" and "yesterday" for comparison
	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	);
	const startOfYesterday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() - 1
	);

	if (
		date.getTime() >= startOfYesterday.getTime() &&
		date.getTime() < startOfToday.getTime()
	) {
		return '1 day ago'; // Or "Yesterday" if you prefer
	}

	if (daysDiff <= 1) {
		// Handles "1 day ago" for dates that are not exactly "yesterday" but within 24-48 hours range
	}

	// If more than a day (and not "yesterday" as handled above), format as dd/mm/yyyy
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};
