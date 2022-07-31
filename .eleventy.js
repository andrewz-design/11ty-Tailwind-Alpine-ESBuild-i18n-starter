const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /dist
  eleventyConfig.addPassthroughCopy({
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./css/prism-tomorrow.css",
    "./source/images/base/favicon.ico": "./favicon.ico",
    "./source/images":"./img"
  });

  // localised collections 
  eleventyConfig.addCollection("posts_en", function (collection) {
      return collection.getFilteredByGlob("./source/en/posts/*.md");
  });

  eleventyConfig.addCollection("posts_ru", function (collection) {
      return collection.getFilteredByGlob("./source/ru/posts/*.md");
  });

  

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "source",
      output: "dist",
      includes: "includes",
      layouts: "includes/layouts",
      data: "data"
    },
    templateFormats: [ "md", "njk", "html", ],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
