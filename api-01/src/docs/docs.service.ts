import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

import { docsData } from './data/docs.data';
import { EnvironmentInterface } from '../common/interfaces/environment.interface';
import { readFileSync } from 'fs';

@Injectable()
export class DocsService {
  private async generateMarkdown(projectPath: string): Promise<string> {
    if (!fs.existsSync(projectPath)) {
      throw new Error('Ruta no encontrada');
    }

    const drawioFiles = this.findDrawioFiles(projectPath);

    let markdown = ``;

    for (const file of drawioFiles) {
      const xmlContent = await fs.promises.readFile(file, 'utf-8');
      markdown += `## ${path.basename(file, '.drawio.svg')}\n\n`;
      markdown += xmlContent;
      markdown += '\n\n\n';
    }

    return markdown;
  }

  private findDrawioFiles(startPath: string, result: string[] = []): string[] {
    const files = fs.readdirSync(startPath);
    for (const file of files) {
      const filename = path.join(startPath, file);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        this.findDrawioFiles(filename, result);
      } else if (filename.endsWith('.drawio.svg')) {
        result.push(filename);
      }
    }
    return result;
  }

  async generateSwaggerDocs(data: {
    app: any;
    classModule: any;
    moduleName: string;
    moduleVersion: string;
    projectPath: string;
  }) {
    const { app, classModule, moduleName, moduleVersion, projectPath } = data;
    SwaggerModule.setup(
      `docs/${moduleName}`,
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle(moduleName)
          .setDescription(`${await this.generateMarkdown(projectPath)}`)
          .addBearerAuth({
            type: `http`,
            scheme: `bearer`,
            bearerFormat: `JWT`,
            description: `JWT Token`,
          })
          .setVersion(moduleVersion)
          .build(),
        {
          include: [classModule],
        },
      ),
    );
  }

  async createMainDocs() {
    let docs = readFileSync(join(__dirname, `..`, `..`, `README.md`), 'utf8');
    docs += await this.generateMarkdown(join(__dirname, `docs`));
    return docs;
  }

  async createDocs(app: any) {
    if (process.env.ENV !== EnvironmentInterface.production) {
      SwaggerModule.setup(
        'docs',
        app,
        SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
            .setTitle('pricecloud')
            .setDescription(`${await this.createMainDocs()}`)
            .setVersion('1.0.0')
            .build(),
          { include: [null] },
        ),
      );

      for (let i = 0; i < docsData.length; i++) {
        await this.generateSwaggerDocs({
          app,
          classModule: docsData[i].module,
          moduleName: docsData[i].name,
          moduleVersion: docsData[i].version,
          projectPath: `src/${docsData[i].name}`,
        });
      }
    }
  }
}
