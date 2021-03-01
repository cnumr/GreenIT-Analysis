const Sitemapper = require('sitemapper');
const fs = require('fs');
const YAML = require('yaml');
const path = require('path')
const sitemap = new Sitemapper();

module.exports = (options) => {
  //handle inputs
  const SITEMAP_URL = options.sitemap_url;
  const OUTPUT_FILE = path.resolve(options.yaml_output_file);
  //parse sitemap
  sitemap.fetch(SITEMAP_URL).then(function(res) {
    try {
      fs.writeFileSync(OUTPUT_FILE,YAML.stringify(res.sites))
    } catch (error) {
      throw ` yaml_output_file : Path "${OUTPUT_FILE}" cannot be reached.`
    }
  }).catch(e => console.log("ERROR : \n" + e))
}