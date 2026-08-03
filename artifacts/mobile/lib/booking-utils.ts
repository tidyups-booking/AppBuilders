import type { Booking } from '@workspace/api-client-react';

export const SERVICE_TYPES = [
  { value: 'standard_clean', label: 'Standard Clean', icon: 'home' },
  { value: 'deep_clean', label: 'Deep Clean', icon: 'droplet' },
  { value: 'move_in_out', label: 'Move In/Out', icon: 'truck' },
  { value: 'post_construction', label: 'Post-Construction', icon: 'tool' },
] as const;

export const FREQUENCIES = [
  { value: 'one_time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

export const STATUSES = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const EXTRAS = [
  'Inside fridge',
  'Inside oven',
  'Interior windows',
  'Laundry',
  'Baseboards',
  'Cabinet interiors',
] as const;

export function serviceLabel(value: string): string {
  return SERVICE_TYPES.find((s) => s.value === value)?.label ?? value;
}

export function frequencyLabel(value: string): string {
  return FREQUENCIES.find((f) => f.value === value)?.label ?? value;
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export function statusColor(status: string): {
  bg: string;
  fg: string;
} {
  switch (status) {
    case 'pending':
      return { bg: '#fdf3dc', fg: '#a06e0a' };
    case 'confirmed':
      return { bg: '#e5eefb', fg: '#2b6cb0' };
    case 'in_progress':
      return { bg: '#f6e3fa', fg: '#a12c9c' };
    case 'completed':
      return { bg: '#dff3e7', fg: '#217a4b' };
    case 'cancelled':
      return { bg: '#fbe5e6', fg: '#b3383c' };
    default:
      return { bg: '#efeaf8', fg: '#4a3a72' };
  }
}

/** Simple price estimate mirroring the web app's approach. */
export function estimatePrice(
  serviceType: string,
  bedrooms: number,
  bathrooms: number,
  extrasCount: number,
): number {
  const base =
    serviceType === 'deep_clean'
      ? 180
      : serviceType === 'move_in_out'
        ? 220
        : serviceType === 'post_construction'
          ? 260
          : 120;
  return base + bedrooms * 25 + bathrooms * 30 + extrasCount * 20;
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [h, min] = timeStr.split(':').map(Number);
  if (h === undefined || min === undefined || Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(min).padStart(2, '0')} ${period}`;
}

export function customerName(b: Booking): string {
  return `${b.firstName} ${b.lastName}`;
}

export function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  return `$${Number(amount).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;
}
