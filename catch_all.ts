// deno-lint-ignore-file no-explicit-any

import { GolangStyleResult, Result } from "./deps.ts";

export interface Promisish<Args extends any[], ReturnType> {
	(fn: (...args: Args) => ReturnType): ReturnType;
	(fn: (...args: Args) => Promise<ReturnType>): Promise<ReturnType>;
}

export type PreferErr<T, E> =
	| "throw"
	| "record"
	| "result"
	| {
		onError: (a0: E) => void;
		onSuccess: (a0: T) => void;
	};

export interface CatchAll<
	Args extends any[],
	ErrType extends Error,
	ReturnType,
> {
	(preference: "throw", ...args: Args): ReturnType;
	(
		preference: "record",
		...args: Args
	): GolangStyleResult<ReturnType, ErrType>;
	(preference: "result", ...args: Args): Result<ReturnType, ErrType>;
	(preference: {
		onError: (a0: ErrType) => void;
		onSuccess: (a0: ReturnType) => void;
	}, ...args: Args): void;
}

export const catchAll = <ErrType extends Error>() => <
	Args extends any[],
	ReturnType,
>(fn: (...args: Args) => ReturnType): CatchAll<Args, ErrType, ReturnType> => {
	return ((preferences: PreferErr<ReturnType, ErrType>, ...args: Args) => {
		try {
			const result = fn(...args);

			if (preferences === "throw") {
				return result;
			} else if (preferences === "record") {
				return { ok: result, err: null };
			} else if (preferences === "result") {
				return Result.ok(result);
			} else {
				preferences.onSuccess(result);
			}
		} catch (error) {
			if (preferences === "throw") {
				throw error;
			} else if (preferences === "record") {
				return { ok: null, err: error };
			} else if (preferences === "result") {
				return Result.err(error);
			} else {
				preferences.onError(error);
			}
		}
	}) as any;
};

//interface CatchAll<A, B>
