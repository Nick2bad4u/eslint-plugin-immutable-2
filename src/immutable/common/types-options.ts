import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

/**
 * Option controlling whether array/object checks should assume mutable runtime
 * types when parser type services are unavailable.
 */
export type AssumeTypesOption = {
    readonly assumeTypes?:
        | boolean
        | {
              readonly forArrays?: boolean;
              readonly forObjects?: boolean;
          };
};

/** Schema properties for the `assumeTypes` option object. */
export const assumeTypesOptionProperties: Readonly<
    Record<string, JSONSchema4>
> = {
    assumeTypes: {
        oneOf: [
            {
                type: "boolean",
            },
            {
                additionalProperties: false,
                properties: {
                    forArrays: {
                        type: "boolean",
                    },
                    forObjects: {
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
    },
};
