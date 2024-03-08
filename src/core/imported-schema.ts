import { filterGenericSchemas, resolveSchema, simplifySchema } from "./schema-definition";
import type { ApiPath, HttpMethod, HttpResponse, RequestBody } from "./openapi";

function resolveRequestSchemas(requestBody?: RequestBody) {
  if (!requestBody) return [];
  return [resolveSchema(requestBody.content["application/json"].schema)];
}

function resolveResponseSchemas(responses: Record<string, HttpResponse>) {
  return Object.values(responses).map(response => {
    const resolvedSchemas = Object.values(response.content ?? {}).map(content => {
      return simplifySchema(resolveSchema(content.schema));
    });
    return filterGenericSchemas(resolvedSchemas).flat();
  }).flat();
}

export function resolveSchemas(paths: Record<string, Record<HttpMethod, ApiPath>>) {
  const collection = Object.values(paths).map(methods => {
    return Object.values(methods).map(path => {
      return [
        ...resolveRequestSchemas(path.requestBody),
        ...resolveResponseSchemas(path.responses),
      ];
    }).flat();
  }).flat();
  return Array.from(new Set(collection));
}
