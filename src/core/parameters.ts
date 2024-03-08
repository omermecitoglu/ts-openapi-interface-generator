import { resolveSchema } from "./schema-definition";
import type { PathParameter, RequestBody } from "./openapi";

function resolveParam(param: PathParameter) {
  return `${param.name}${param.required ? "" : "?"}: ${resolveSchema(param.schema)}`;
}

function resolveRequestBody(body: RequestBody) {
  return `requestBody${body.required ? "" : "?"}: ${resolveSchema(body.content["application/json"].schema)}`;
}

export function resolveParams(parameters: PathParameter[], body?: RequestBody) {
  const resolvedParams = parameters.filter(param => param.in === "path").map(resolveParam);
  const collection = [
    ...resolvedParams,
  ];
  if (body) collection.push(resolveRequestBody(body));
  return collection;
}
