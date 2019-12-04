/*
 *  Copyright (C) 2019  didierfred@gmail.com 
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

let quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
let quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
let quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];


/**
Calcul ecoIndex based on formula from web site www.ecoindex.fr
**/
function computeEcoIndex(dom,req,size)
{

const q_dom= computeQuantile(quantiles_dom,dom);
const q_req= computeQuantile(quantiles_req,req);
const q_size= computeQuantile(quantiles_size,size);


return Math.round(100 - 5 * (3*q_dom + 2*q_req + q_size)/6);
}

function computeQuantile(quantiles,value)
{
for (let i=1;i<quantiles.length;i++)
	{
	if (value<quantiles[i]) return (i + (value-quantiles[i-1])/(quantiles[i] -quantiles[i-1]));
	}
return quantiles.length;
}


function getEcoIndexGrade(ecoIndex)
{
if (ecoIndex > 75) return "A";
if (ecoIndex > 65) return "B";
if (ecoIndex > 50) return "C";
if (ecoIndex > 35) return "D";
if (ecoIndex > 20) return "E";
if (ecoIndex > 5) return "F";
return "G";
}

function computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex)
{
	return (Math.round(100 * (2 + 2 * (50 - ecoIndex) / 100)) / 100);
}

function computeWaterConsumptionfromEcoIndex(ecoIndex)
{
	return (Math.round(100 * (3 + 3 * (50 - ecoIndex) / 100)) / 100);
}

