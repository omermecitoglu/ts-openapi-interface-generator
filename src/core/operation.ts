import Handlebars from "handlebars";
import operationTemplate from "~/templates/operation.hbs";
import { getSearchParams, resolveParams } from "./parameters";
import { resolveResponses } from "./response";
import type { ApiPath, HttpMethod, PathParameter } from "./openapi";

export type OperationTemplate = {
  name: string,
  method: string,
  path: string,
  parameters: string,
  searchParams: PathParameter[],
  responses: string[],
};

function quotePathName(pathName: string, parameters: PathParameter[]) {
  const pathParams = parameters.filter(p => p.in === "path");
  if (pathParams.length) return `\`${pathName.replaceAll("{", "${")}\``;
  return `"${pathName}"`;
}

export function resolveOperations(paths: Record<string, Record<HttpMethod, ApiPath>>) {
  const collection = Object.entries(paths).map(([pathName, methods]) => {
    return Object.entries(methods).map<OperationTemplate>(([method, path]) => ({
      name: path.operationId,
      method: method.toUpperCase(),
      path: quotePathName(pathName, path.parameters ?? []),
      parameters: resolveParams(path.parameters ?? [], path.requestBody).join(", "),
      searchParams: getSearchParams(path.parameters ?? []),
      responses: resolveResponses(path.responses),
    }));
  });
  return collection.flat();
}

Handlebars.registerHelper("hasRequestBody", (input: string[]) => {
  return input.includes("requestBody:");
});

Handlebars.registerPartial("operation", operationTemplate);
