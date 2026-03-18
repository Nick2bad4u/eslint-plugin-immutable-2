/**
 * Return a predicate that checks strict equality against an expected value.
 *
 * @param expected - Expected value.
 *
 * @returns Predicate checking whether the provided value equals the expected value.
 */
export const isExpected = <T>(expected: T): ((actual: T) => boolean) =>
    (actual) => actual === expected;
