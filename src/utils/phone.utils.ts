export function normalizePhoneNumber(phone: string): string {
	const cleaned = phone.replace(/[^\d+]/g, '')

	if (cleaned.startsWith('8')) return '+7' + cleaned.slice(1)
	if (cleaned.length === 10) return '+7' + cleaned

	return cleaned
}
