import fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import interfaceTemplate from "~/templates/interface.hbs";
import getArgument from "./arguments";
import type { OperationTemplate } from "./operation";

type InterfaceTemplate = {
  baseUrl: string,
  schemas: string[],
  operations: OperationTemplate[],
};

export function generateInterface(baseUrl: string, schemas: string[], operations: OperationTemplate[]) {
  const template = Handlebars.compile<InterfaceTemplate>(interfaceTemplate);
  return template({
    baseUrl,
    schemas,
    operations,
  });
}

export async function saveInterface(name: string, content: string) {
  const outputDir = await getArgument("output") ?? "src";
  const interfacesFolder = path.resolve(process.cwd(), outputDir);
  await fs.mkdir(interfacesFolder, { recursive: true });
  const filePath = path.resolve(interfacesFolder, `${name}.ts`);
  await fs.writeFile(filePath, content);
}
