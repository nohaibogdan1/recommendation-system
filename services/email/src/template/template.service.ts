import { Injectable } from "@nestjs/common";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

@Injectable()
export default class TemplateService {
  async createTemplate() {
    const templatePath = path.resolve(
      path.join(__dirname, "./templates/playground.handlebars")
    );
    const template = await fs.readFile(templatePath);
    const html = Handlebars.compile(template.toString());
    return html({ name: "ejsaiofj" });
  }
}
