// Copyright © Todd Agriscience, Inc. All rights reserved.

/*
 * Shared between the client-side CursorFollower and the server components that
 * tag its hover targets. Kept in a directive-free module on purpose: values
 * exported from a `'use client'` file reach server components as client
 * references, not as strings, so a computed `data-*` key built from one would
 * be silently dropped by React DOM.
 */

/**
 * Attribute that marks an element as a hover target. Its value is the label the
 * follower displays while the pointer is over that element (already localized
 * by the server component that renders the markup).
 */
export const CURSOR_LABEL_ATTRIBUTE = 'data-cursor-label';

/**
 * Attribute set on `<html>` once the follower is mounted on a fine-pointer
 * device AND a real pointer position is known. The global stylesheet keys off
 * it to hide the native pointer over labelled targets, so the OS arrow never
 * disappears before the follower is able to stand in for it.
 */
export const CURSOR_READY_ATTRIBUTE = 'data-cursor-follower';
