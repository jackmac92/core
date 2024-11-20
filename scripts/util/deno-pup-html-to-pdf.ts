#!/usr/bin/env -S deno --allow-sys --allow-read --allow-write --allow-net --allow-env --allow-run

import puppeteer from "npm:puppeteer@latest";
import { exec } from "https://deno.land/x/exec/mod.ts";

// Get the HTML file path from command line arguments
const htmlFilePath = Deno.args[0];
if (!htmlFilePath) {
  console.error("Please provide an HTML file path as an argument");
  Deno.exit(1);
}

// Find Chrome executable path using 'which' command
async function findChromeExecutable(): Promise<string> {
  try {
    // Try common Chrome/Chromium binary names
    for (const binary of [
      "google-chrome",
      "google-chrome-stable",
      "chromium",
      "chromium-browser",
    ]) {
      try {
        const { output } = await exec(`which ${binary}`);
        if (output.trim()) {
          console.log("GOT ONE!!!");
          return output.trim();
        }
      } catch {
        continue;
      }
    }
    throw new Error("Could not find Chrome or Chromium executable");
  } catch (error) {
    console.error("Error finding Chrome executable:", error);
    throw error;
  }
}

async function convertHtmlToPdf(htmlFilePath: string) {
  try {
    const executablePath =
      "/home/jmccown/.nix-profile/bin/google-chrome-stable";

    console.log(`Using Chrome at: ${executablePath}`);

    // Launch browser with explicit executable path
    const browser = await puppeteer.launch({
      executablePath,
      headless: "new",
    });

    // Create new page
    const page = await browser.newPage();

    // Convert the file path to a file URL
    const fileUrl = `file://${await Deno.realPath(htmlFilePath)}`;

    // Load the HTML file
    await page.goto(fileUrl, {
      waitUntil: "networkidle0",
    });

    // Generate PDF
    const outputPath = htmlFilePath.replace(/\.html$/, ".pdf");
    await page.pdf({
      path: outputPath,
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: true,
    });

    console.log(`PDF created successfully: ${outputPath}`);

    // Close browser
    await browser.close();
  } catch (error) {
    console.error("Error converting HTML to PDF:", error);
    throw error;
  }
}

// Run the conversion
try {
  await convertHtmlToPdf(htmlFilePath);
} catch (error) {
  Deno.exit(1);
}
