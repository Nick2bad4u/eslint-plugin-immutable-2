/**
 * Shared Vitest setup for repository test suites.
 *
 * Keeps mock state isolated across tests and workers.
 */

import { afterEach, vi } from "vitest";

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});
