type SchemaComponent = {
  type: "object" | "unknown",
  properties: Record<string, SchemaDefinition>,
  required?: string[],
};

export type SchemaDefinition = {
  type?: "string" | "number" | "array" | "object",
  format?: "date" | "unknown",
  description: string,
  readOnly: boolean,
  $ref?: string,
  items?: SchemaDefinition | SchemaDefinition[],
};

export type PathParameter = {
  in: "path" | "query" | "header" | "cookie",
  name: string,
  description: string,
  required: boolean,
  schema: SchemaDefinition,
};

export type RequestBody = {
  description: string,
  required: boolean,
  content: Record<ContentType, ResponseContent>,
};

type ResponseContent = {
  schema: SchemaDefinition,
};

type ContentType = "application/json" | "text/plain";

export type HttpResponse = {
  description: string,
  content?: Record<ContentType, ResponseContent>,
};

type HttpCode = "200" | "404";

export type ApiPath = {
  summary: string,
  operationId: string,
  parameters?: PathParameter[],
  requestBody?: RequestBody,
  responses: Record<HttpCode, HttpResponse>,
};

export type HttpMethod = "get" | "post" | "patch" | "put" | "delete";

type OpenApiSpecification = {
  components: {
    schemas: Record<string, SchemaComponent>,
  },
  paths: Record<string, Record<HttpMethod, ApiPath>>,
};

export async function getSwaggerJSON(base: string, specs?: string) {
  const url = new URL(specs ?? "/swagger", base);
  const response = await fetch(url);
  const data = await response.json();
  return data as OpenApiSpecification;
}
