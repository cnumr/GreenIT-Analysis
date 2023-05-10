
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

 
var line_number = 0;
var analyse_history = [];
var corresponding_index_for_line = [];

window.onload = function () {
	init_page();
};


function init_page() {
	document.getElementById('delete_all_button').addEventListener('click', function (e) { delete_all(); });
	document.getElementById('export_button').addEventListener('click', function (e) { export_data(); });
	view_history();
}

/**
For each line in history , write it on the page as a table line
**/
function view_history() {
	var string_analyse_history = localStorage.getItem("analyse_history");

	if (string_analyse_history) {
		analyse_history = JSON.parse(string_analyse_history);
		for (var to_add of analyse_history) appendLine(to_add.resultDate,
			to_add.url,
			to_add.nbRequest,
			to_add.responsesSize,
			to_add.domSize,
			to_add.greenhouseGasesEmission,
			to_add.waterConsumption,
			to_add.ecoIndex,
			to_add.grade);
	}

}

/**
* Add a new history line on the UI 
**/
function appendLine(result_date, url, nbRequest, responsesSize, domSize, greenhouseGasesEmission, waterConsumption, ecoIndex, grade) {
	const date = new Date(result_date);
	let url_toshow = url;
	if (url_toshow.length>100) url_toshow = url_toshow.substring(0,100) + "...";
	let html = "<td>" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + "</td>";
	html = html + '<td><a href="' + url + '" target="blank">' + url_toshow + '</a></td>';
	html = html + "<td>" + nbRequest + "</td>";
	html = html + "<td>" + responsesSize + "</td>";
	html = html + "<td>" + domSize + "</td>";
	html = html + "<td>" + greenhouseGasesEmission + "</td>";
	html = html + "<td>" + waterConsumption + "</td>";
	html = html + "<td>" + ecoIndex + "</td>";
	html = html + "<td>" + '<span class="note ' + grade + '">' + grade + '</span>' + "</td>";

	html = html + "</td> <a href=\"#\" id=\"delete_button" + line_number
		+ "\" class=\"btn btn-primary btn-sm\"> <span class=\"glyphicon glyphicon-trash\"></span> "
		+ chrome.i18n.getMessage("deleteButton") + "</a></td>";

	var newTR = document.createElement("tr");
	newTR.id = "line" + line_number;
	newTR.innerHTML = html;
	document.getElementById("history").appendChild(newTR);

	var line_number_to_delete = line_number;
	document.getElementById('delete_button' + line_number).addEventListener('click', function to_delete(e) { delete_line(line_number_to_delete) });
	corresponding_index_for_line.push(line_number);
	line_number++;
}



function delete_line(line_number_to_delete) {
	var Node_to_delete = document.getElementById("line" + (line_number_to_delete));
	Node_to_delete.parentNode.removeChild(Node_to_delete);

	analyse_history.splice(corresponding_index_for_line[line_number_to_delete], 1);
	for (var i = line_number_to_delete + 1; i < corresponding_index_for_line.length; i++) {
		corresponding_index_for_line[i] = corresponding_index_for_line[i] - 1;
	}
	localStorage.setItem("analyse_history", JSON.stringify(analyse_history));
}


function delete_all() {
	if (window.confirm(chrome.i18n.getMessage("deleteAllConfirmMessage"))) {
		localStorage.removeItem("analyse_history");
		document.location.reload();
	}
}

function create_csv() {
	var csv = chrome.i18n.getMessage("csvColumnsLabel") + "\n" ;
	analyse_history.forEach(function (analyse) {
		const date = new Date(analyse.resultDate);
		csv += date.toLocaleDateString() + " " + date.toLocaleTimeString() +
			";\"" + analyse.url +
			"\";" + analyse.nbRequest +
			";" + analyse.responsesSize +
			";" + analyse.domSize +
			";" + analyse.greenhouseGasesEmission +
			";" + analyse.waterConsumption +
			";" + analyse.ecoIndex +
			";" + analyse.grade + "\n";
	})
	return csv;
}


function export_data() {
	// Create file data
	var to_export = create_csv();

	// Create file to save 
	var a = document.createElement('a');
	a.href = 'data:attachment/csv,' + encodeURIComponent(to_export);
	a.target = 'download';
	a.download = 'ecoindex.csv';

	// use iframe "download" to put the link (in order not to be redirect in the parent frame)
	var myf = document.getElementById("download");
	myf = myf.contentWindow.document || myf.contentDocument;
	myf.body.appendChild(a);
	a.click();
}
