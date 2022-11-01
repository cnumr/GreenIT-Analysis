/*
 *  Copyright (C) 2016  The EcoMeter authors (https://gitlab.com/ecoconceptionweb/ecometer)
 *  Copyright (C) 2019-2022  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function start_analyse() {
  const analyseStartingTime = Date.now();
  const dom_size = getDomSizeWithoutSvg();
  const pageAnalysis = {
    "analyseStartingTime": analyseStartingTime,
    "url": document.URL,
    "domSize": dom_size
  }
  chrome.runtime.sendMessage(pageAnalysis);
}

function getDomSizeWithoutSvg(){
  let dom_size = document.getElementsByTagName("*").length;
  const svgElements = document.getElementsByTagName("svg");
  for (let i = 0 ; i< svgElements.length ; i++) {
    dom_size -= getNbChildsExcludingNestedSvg(svgElements[i])-1;
  }
  return dom_size;
}

function getNbChildsExcludingNestedSvg(element) {
  if (element.nodeType === Node.TEXT_NODE) return 0;
  let nb_elements =1;
  for (let i = 0 ; i< element.childNodes.length ; i++) {
    // deal with svg nested case 
    if (element.childNodes[i].tagName !== 'svg')  nb_elements+= getNbChildsExcludingNestedSvg(element.childNodes[i]);
    else nb_elements+=1;
  }
  return nb_elements;
}


start_analyse();