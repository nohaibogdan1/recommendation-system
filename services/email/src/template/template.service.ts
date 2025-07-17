import { Injectable } from "@nestjs/common";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import { EmailTemplate } from "../types";

@Injectable()
export default class TemplateService {
  async createHtml(data: EmailTemplate) {
    const templatePath = path.resolve(
      path.join(__dirname, `./templates/${data.type.toLowerCase()}.handlebars`)
    );
    const template = await fs.readFile(templatePath);
    const html = Handlebars.compile(template.toString());
    return html(data);
  }
}
