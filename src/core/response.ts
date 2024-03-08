import { resolveSchema } from "./schema-definition";
import type { HttpResponse } from "./openapi";

function handleResponse(statusCode: string, response: HttpResponse) {
  if (statusCode.startsWith("2")) {
    if (response.content) {
      for (const [responseType, content] of Object.entries(response.content)) {
        const schema = resolveSchema(content.schema);
        switch (responseType) {
          case "application/json":
            return `return await response.json() as ${schema}`;
        }
      }
    }
    return "return";
  }
  return `throw new Error("${response.description}")`;
}

export function resolveResponses(responses: Record<string, HttpResponse>) {
  return Object.entries(responses).map(([statusCode, response]) => (
    `case ${statusCode}: ${handleResponse(statusCode, response)};`
  ));
}
