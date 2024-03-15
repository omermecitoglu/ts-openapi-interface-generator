import Handlebars from "handlebars";
import searchParamTemplate from "~/templates/search-param.hbs";
import { resolveSchema } from "./schema-definition";
import type { PathParameter, RequestBody } from "./openapi";

function resolveParam(param: PathParameter) {
  return `${param.name}${param.required ? "" : "?"}: ${resolveSchema(param.schema)}`;
}

function resolveRequestBody(body: RequestBody) {
  return `requestBody${body.required ? "" : "?"}: ${resolveSchema(body.content["application/json"].schema)}`;
}

function sortRequiredParamsFirst(paramA: PathParameter, paramB: PathParameter) {
  if (paramA.required === paramB.required) return 0;
  return paramA.required ? -1 : 1;
}

export function resolveParams(parameters: PathParameter[], body?: RequestBody) {
  const resolvedParams = parameters
    .filter(param => param.in === "path" || param.in === "query")
    .toSorted(sortRequiredParamsFirst)
    .map(resolveParam);
  const collection = [
    ...resolvedParams,
  ];
  if (body) collection.push(resolveRequestBody(body));
  return collection;
}

export function getSearchParams(parameters: PathParameter[]) {
  return parameters
    .filter(param => param.in === "query");
}

Handlebars.registerPartial("searchParam", searchParamTemplate);
