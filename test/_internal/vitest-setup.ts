/**
 * Shared Vitest setup for repository test suites.
 *
 * Keeps mock state isolated across tests and workers.
 */

/* eslint-disable vitest/no-hooks, vitest/require-top-level-describe -- setup files intentionally register global hooks. */

import { afterEach, vi } from "vitest";

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

/* eslint-enable vitest/no-hooks, vitest/require-top-level-describe -- end intentional setup-file global hook exception. */
