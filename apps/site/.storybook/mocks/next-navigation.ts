// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Stands in for `next/navigation` under the React Vite builder.
 *
 * The real hooks read App Router context, which nothing mounts in Storybook:
 * `usePathname()` returns null and `useRouter()` throws "invariant expected app
 * router to be mounted". Components that call them unguarded take the story
 * down with them.
 *
 * State comes from `parameters.nextjs.navigation`, the same block the previous
 * Next.js-aware builder honored, so existing stories keep working unchanged.
 * `withNextNavigation` pushes each story's parameters in before it renders.
 */

/** The subset of `parameters.nextjs.navigation` stories actually set. */
export interface NavigationState {
  pathname: string;
  query: Record<string, string>;
  segments: Record<string, string | string[]>;
}

const DEFAULTS: NavigationState = { pathname: '/', query: {}, segments: {} };

let state: NavigationState = DEFAULTS;

/**
 * Points the mocked hooks at a story's navigation parameters.
 *
 * @param next - Partial navigation state; omitted keys fall back to defaults
 */
export function __setNavigation(next: Partial<NavigationState> = {}): void {
  state = { ...DEFAULTS, ...next };
}

/** @returns The pathname the current story declared */
export function usePathname(): string {
  return state.pathname;
}

/** @returns The dynamic route segments the current story declared */
export function useParams<T = Record<string, string | string[]>>(): T {
  return state.segments as T;
}

/** @returns The query string the current story declared */
export function useSearchParams(): URLSearchParams {
  return new URLSearchParams(state.query);
}

/** @returns The selected layout segment, or null */
export function useSelectedLayoutSegment(): string | null {
  return state.pathname.split('/').filter(Boolean)[0] ?? null;
}

/** @returns The selected layout segments */
export function useSelectedLayoutSegments(): string[] {
  return state.pathname.split('/').filter(Boolean);
}

/**
 * A router whose methods record the pathname rather than navigating — the
 * preview iframe has nowhere to navigate to.
 *
 * @returns A router with the App Router surface
 */
export function useRouter() {
  return {
    push: (href: string) => {
      state = { ...state, pathname: href };
    },
    replace: (href: string) => {
      state = { ...state, pathname: href };
    },
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => Promise.resolve(),
  };
}

/** No-op stand-in; redirecting inside a story would blank the preview. */
export function redirect(_url: string): void {}

/** No-op stand-in; see {@link redirect}. */
export function permanentRedirect(_url: string): void {}

/** No-op stand-in: stories render the component, not its 404 boundary. */
export function notFound(): void {}

/** No-op stand-in for the auth error helpers. */
export function forbidden(): void {}

/** No-op stand-in for the auth error helpers. */
export function unauthorized(): void {}
