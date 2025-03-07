const yaml = require("js-yaml");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
    eleventyConfig.addLayoutAlias("default", "layouts/default.njk");

    // Load JSON site data
    eleventyConfig.addGlobalData("site", require("./src/_data/site.json"));

    // Load YAML data
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
    eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

    // Custom filters
    eleventyConfig.addFilter("formatDate", (date, format) => dayjs(date).format(format));
    eleventyConfig.addFilter("objtype", (obj) => typeof obj);
    eleventyConfig.addGlobalData("buildDate", new Date().toISOString());

    // Default to example_resume.yml (local development)
    let resumePath = path.join(__dirname, "src/_data/example_resume.yml");
    let resumeData;

    // Get the repo name from GitHub Actions or default to "/"
    const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
    const pathPrefix = repoName ? `/${repoName}/` : "/";

    if (process.env.CI && process.env.RESUME) {
        // In GitHub Actions, prefer the RESUME secret if available
        try {
            resumeData = yaml.load(process.env.RESUME);
            console.log("Using RESUME secret from GitHub Actions.");
        } catch (error) {
            console.error("Failed to parse RESUME environment variable as YAML:", error);
            process.exit(1); // Stop build if malformed
        }
    } else {
        // Otherwise, use the local example_resume.yml
        if (fs.existsSync(resumePath)) {
            resumeData = yaml.load(fs.readFileSync(resumePath, "utf8"));
            console.log("Using example_resume.yml (local development).");
        } else {
            console.error("No resume data found!");
            process.exit(1); // Stop build if no data available
        }
    }

    eleventyConfig.addGlobalData("resume", resumeData);

    return {
        dir: {
            input: "src",
            includes: "_includes",
            output: "_site",
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        pathPrefix: pathPrefix 
    };
};
