const yaml = require("js-yaml");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
    eleventyConfig.addLayoutAlias("default", "layouts/default.njk");

    // Load JSON site data
    eleventyConfig.addGlobalData('site', require('./src/_data/site.json'));

    // Load YAML data
    eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));
    eleventyConfig.addDataExtension('yml', contents => yaml.load(contents));

    // Custom filters
    eleventyConfig.addFilter('formatDate', (date, format) => {
        return dayjs(date).format(format);
    });

    eleventyConfig.addFilter('objtype', obj => typeof obj);
    eleventyConfig.addGlobalData("buildDate", new Date().toISOString());

    // Load resume YAML manually and make it global
    const resumePath = path.join(__dirname, 'src/_data/example_resume.yml');
    if (fs.existsSync(resumePath)) {
        const resumeData = yaml.load(fs.readFileSync(resumePath, 'utf8'));
        eleventyConfig.addGlobalData('resume', resumeData);
    }

    return {
        dir: {
            input: 'src',
            includes: '_includes',
            output: '_site',
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk'
    };
};
