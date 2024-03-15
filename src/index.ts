import { resolveSchemas, resolveSchemasFromProps } from "./core/imported-schema";
import { generateInterface, saveInterface } from "./core/interface";
import { getSwaggerJSON } from "./core/openapi";
import { resolveOperations } from "./core/operation";
import { generateSchema, resolveProperties, saveSchema } from "./core/schema";
import readSource from "./core/source";

(async () => {
  const source = await readSource();
  for (const service of source.services) {
    const data = await getSwaggerJSON(service.url, service.specs);
    for (const [schemaName, schema] of Object.entries(data.components.schemas)) {
      if (schema.type === "object") {
        const properties = resolveProperties(schema.properties, schema.required ?? []);
        const importedSchemas = resolveSchemasFromProps(schema.properties);
        const content = generateSchema(schemaName, properties, importedSchemas);
        await saveSchema(schemaName, content);
      }
    }
    const schemas = resolveSchemas(data.paths);
    const paths = resolveOperations(data.paths);
    const content = generateInterface(service.url, schemas, paths);
    await saveInterface(service.name, content);
  }
})();
