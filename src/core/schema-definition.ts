import type { SchemaDefinition } from "./openapi";

function resolveArray(items: SchemaDefinition[], isArray: boolean) {
  const schemas = items.map(resolveSchema);
  const names = schemas.join(" | ");
  return isArray ? `(${names})[]` : names;
}

export function resolveSchema(definition: SchemaDefinition): string {
  // TODO: handle definition.format === "date"
  if (definition.type) {
    switch (definition.type) {
      case "string": return "string";
      case "number": return "number";
      case "array": {
        if (definition.items) {
          if (Array.isArray(definition.items)) {
            return resolveArray(definition.items, true);
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
  if (definition.oneOf) {
    return resolveArray(definition.oneOf, false);
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
    "unknown",
  ];
  return resolvedSchemas.filter(s => !genericSchemas.includes(s));
}
