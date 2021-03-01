const concat = require('concat-files');
const glob = require('glob');
const fs = require('fs')

const DIR = './dist';

if (!fs.existsSync(DIR)){
    fs.mkdirSync(DIR);
}

const rules = glob.sync('./greenit-core/rules/*.js')
 
//One script to analyse them all
concat([
  './greenit-core/analyseFrameCore.js',
  './greenit-core/utils.js',
  './greenit-core/rulesManager.js',
  './greenit-core/ecoIndex.js',
  ...rules,
  './greenit-core/greenpanel.js'
], './dist/bundle.js', function(err) {
  if (err) throw err
  console.log('build complete');
});