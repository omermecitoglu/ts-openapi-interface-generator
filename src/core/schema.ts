import fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import schemaTemplate from "~/templates/schema.hbs";
import { resolveSchema } from "./schema-definition";
import type { SchemaDefinition } from "./openapi";

type ModelProperty = {
  content: string,
  description: string,
};

type SchemaTemplate = {
  importedSchemas: string[],
  name: string,
  properties: ModelProperty[],
};

export function generateSchema(name: string, properties: ModelProperty[], importedSchemas: string[]) {
  const template = Handlebars.compile<SchemaTemplate>(schemaTemplate);
  return template({
    name,
    properties,
    importedSchemas,
  });
}

export function resolveProperties(collection: Record<string, SchemaDefinition>, required: string[]) {
  return Object.entries(collection).map<ModelProperty>(([propertyName, property]) => {
    const isRequired = required.includes(propertyName);
    const content = [
      `${propertyName}${isRequired ? "" : "?"}:`,
      `${resolveSchema(property)},`,
    ];
    if (property.readOnly) content.unshift("readonly");
    return {
      content: content.join(" "),
      description: property.description,
    };
  });
}

export async function saveSchema(name: string, content: string) {
  const schemasFolder = path.resolve(process.cwd(), "src", "schemas");
  await fs.mkdir(schemasFolder, { recursive: true });
  const filePath = path.resolve(schemasFolder, `${name}.ts`);
  await fs.writeFile(filePath, content);
}
