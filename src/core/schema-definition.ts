import type { SchemaDefinition } from "./openapi";

export function resolveSchema(definition: SchemaDefinition): string {
  if (definition.type) {
    switch (definition.type) {
      case "string": return "string";
      case "array": {
        if (definition.items) {
          if (Array.isArray(definition.items)) {
            const schemas = definition.items.map(resolveSchema);
            return `(${schemas.join(" | ")})[]`;
          }
          return `${resolveSchema(definition.items)}[]`;
        }
        return "unknown[]";
      }
      case "object": return "unknown";
    }
  }
  if (definition.$ref) {
    return definition.$ref.replace("#/components/schemas/", "");
  }
  return "unknown";
}

export function simplifySchema(resolvedSchema: string) {
  return resolvedSchema.replace(/\[|\]/g, "");
}

export function filterGenericSchemas(resolvedSchemas: string[]) {
  const genericSchemas = [
    "string",
    "number",
  ];
  return resolvedSchemas.filter(s => !genericSchemas.includes(s));
}
