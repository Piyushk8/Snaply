import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDate, formatDistanceToNowStrict} from "date-fns"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formateRelativeDate = (from: Date | string | number) => {
  // Convert from to a Date object if it is not already one
  const dateFrom = (from instanceof Date) ? from : new Date(from);

  // Check if dateFrom is valid
  if (isNaN(dateFrom.getTime())) {
    throw new Error('Invalid date provided');
  }

  const currentDate = new Date();

  if (currentDate.getTime() - dateFrom.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(dateFrom, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === dateFrom.getFullYear()) {
      return formatDate(dateFrom, "MMM d");
    } else {
      return formatDate(dateFrom, "MMM d, yyyy");
    }
  }
};

export function formatNumber(n:number):string{

  return Intl.NumberFormat("en-In",{
    notation:"compact",
    maximumFractionDigits:1
  }).format(n)
}