import fs from 'fs';

console.log('### Generating resources ...');

const snakeCaseToCamelCase = (input: string) => {
  return input.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
};

const snakeCaseToPascalCase = (input: string) => {
  const camelCaseResult = snakeCaseToCamelCase(input);

  return camelCaseResult.charAt(0).toUpperCase() + camelCaseResult.slice(1);
};

const generateImageResources = () => {
  fs.readdir('./src/assets/images', (err, fileNames) => {
    if (err) {
      console.log(err);

      return;
    }

    let importData = '';
    let exportData = '\nexport const imageResources = {\n';

    for (const fileName of fileNames) {
      const fileNameNoExt = fileName.split('.')[0];

      importData = importData.concat(
        `import ${fileNameNoExt} from './images/${fileName}';\n`,
      );

      exportData = exportData.concat(`${fileNameNoExt},\n`);
    }

    exportData = exportData.concat('}');

    const data = importData + exportData;

    fs.writeFileSync('./src/assets/image-resources.ts', data);

    console.log(`### Generated ${fileNames.length} image(s)`);
  });
};

const generateIconResources = () => {
  fs.readdir('./src/assets/svgs', (err, fileNames) => {
    if (err) {
      console.log(err);

      return;
    }

    let data = '';

    for (const fileName of fileNames) {
      data = data.concat(
        `export { default as ${snakeCaseToPascalCase(fileName.replace('.svg', 'Icon'))}} from './svgs/${fileName}?react';\n`,
      );
    }

    fs.writeFileSync('./src/assets/icon-resources.ts', data);

    console.log(`### Generated ${fileNames.length} icon(s)`);
  });
};

generateIconResources();
generateImageResources();
