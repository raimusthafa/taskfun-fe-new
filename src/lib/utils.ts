import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return dayjs(dateString).format('HH:mm / DD-MM-YY')
}

export function formatRelativeDate(dateString: string): string {
  const now = dayjs();
  const target = dayjs(dateString);
  const diffDays = target.diff(now, 'day');

  if (diffDays < 0) {
    return `Overdue ${target.format('HH:mm / DD-MM-YY')}`;
  } else if (diffDays === 0) {
    return `Today at ${target.format('HH:mm')}`;
  } else if (diffDays === 1) {
    return `Tomorrow at ${target.format('HH:mm')}`;
  } else if (diffDays >= 2 && diffDays <= 6) {
    return `In ${diffDays} days at ${target.format('HH:mm')}`;
  } else if (diffDays === 7) {
    return `In a week at ${target.format('HH:mm')}`;
  } else {
    return target.format('HH:mm / DD-MM-YY');
  }
}
