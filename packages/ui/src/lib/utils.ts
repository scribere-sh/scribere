import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * This function will deduplicate, re-order, and improve tailwind classes.
 *
 * Used a lot in components where you can override values, under the hood
 * this runs entirely on [`tailwind-merge`](https://www.npmjs.com/package/tailwind-merge)
 * and [`clsx`](https://www.npmjs.com/package/clsx).
 *
 * Added by [`shadcn-svelte`](https://next.shadcn-svelte.com)
 *
 * @param inputs A set of sets tailwindcss utility classes
 * @returns deduplicated, well ordered css classes to be used by tailwind
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Schedule the {@link cb | callback} to run after the set {@link durationMs | duration},
 * call the returned function to start the run.
 *
 * Calling the returned function multiple times within the set {@link durationMs | duration}
 * will cause it to run ONCE {@link durationMs | duration} ms after the last call.
 *
 * This allows a callback to be assigned to multiple event handlers without calling it on
 * event single individual one.
 *
 * @see https://www.geeksforgeeks.org/debouncing-in-javascript
 *
 * @param cb The callback
 * @param durationMs the buffer duration (in milliseconds)
 * @returns the debounced function to be used in event handlers
 */
export function debounce<T>(cb: (v: T) => void, durationMs: number): (v: T) => void {
	let timer: ReturnType<typeof setTimeout>;
	return (v: T) => {
		clearTimeout(timer);
		timer = setTimeout(() => cb(v), durationMs);
	};
}
