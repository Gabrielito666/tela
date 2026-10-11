/**
 * @file
 * @source ./index.js
 * @description CLI script to render an HTML file to an image using playwright
 */

const { parseArgs } = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');

const DEFAULT_RESOLUTION = '390x844';
const DEFAULT_OUTPUT = 'out.png';
const SUPPORTED_EXTENSIONS = new Set(['png', 'jpeg', 'jpg']);

const { values } = parseArgs({
	options: {
		input: { type: 'string', short: 'i' },
		resolution: { type: 'string', short: 'r' },
		output: { type: 'string', short: 'o' }
	},
	allowPositionals: false
});

const input = values.input;
const resolution = values.resolution ?? DEFAULT_RESOLUTION;
const output = values.output ?? DEFAULT_OUTPUT;

if(!input)
{
	console.error('Falta el argumento obligatorio --input (-i)');
	process.exit(1);
}

if(!fs.existsSync(input))
{
	console.error(`El archivo de input no existe: ${input}`);
	process.exit(1);
}

const resolutionMatch = resolution.match(/^\d+x\d+$/);
if(!resolutionMatch)
{
	console.error('Formato de resolución inválido. Use ANCHOxALTO, ej: 700x800');
	process.exit(1);
}

const [width, height] = resolution.split('x').map(Number);
if(width <= 0 || height <= 0)
{
	console.error('Formato de resolución inválido. Use ANCHOxALTO, ej: 700x800');
	process.exit(1);
}

const rawExt = path.extname(output).toLowerCase().replace(/^\./, '');
if(!SUPPORTED_EXTENSIONS.has(rawExt))
{
	console.error(`Extensión de salida no soportada: "${path.extname(output) || '(sin extensión)'}". Formatos soportados: png, jpeg, jpg`);
	process.exit(1);
}

const screenshotType = rawExt === 'jpg' ? 'jpeg' : rawExt;

const CHROMIUM_PATH = process.env.CHROMIUM_PATH ?? '/usr/bin/chromium';
if(!fs.existsSync(CHROMIUM_PATH))
{
	console.error(`No se encontró Chromium en: ${CHROMIUM_PATH} (define CHROMIUM_PATH para indicar otra ruta)`);
	process.exit(1);
}

const main = async () =>
{
	let browser;
	try
	{
		browser = await chromium.launch({ headless: true, executablePath: CHROMIUM_PATH });
		const page = await browser.newPage({
			viewport: { width, height }
		});
		await page.goto('file://' + path.resolve(input), {
			waitUntil: 'networkidle',
			timeout: 30000
		});
		const screenshotOptions = {
			path: output,
			type: screenshotType,
			fullPage: false
		};
		if(screenshotType === 'jpeg')
		{
			screenshotOptions.quality = 90;
		}
		await page.screenshot(screenshotOptions);
		console.log(`Imagen generada: ${output}`);
	}
	catch(err)
	{
		console.error(err instanceof Error ? err.message : String(err));
		process.exit(1);
	}
	finally
	{
		if(browser)
		{
			await browser.close();
		}
	}
}

main();
