import { promises as fs } from 'fs';
import { renderAsync, Resvg } from '@resvg/resvg-js';

async function generateTransparentPng() {
    try {
        console.log("Reading logo.svg...");
        const svgContent = await fs.readFile('public/logo.svg');

        console.log("Configuring resvg...");
        const resvg = new Resvg(svgContent, {
            fitTo: {
                mode: 'width',
                value: 1200,
            },
            font: {
                loadSystemFonts: true,
            }
        });

        console.log("Rendering to PNG...");
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        console.log("Saving to logo.png...");
        await fs.writeFile('public/logo.png', pngBuffer);
        console.log("Successfully generated transparent public/logo.png");
    } catch (error) {
        console.error("Error generating PNG:", error);
    }
}

generateTransparentPng();
