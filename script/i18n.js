 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.1
 */



for ( const elem of document.querySelectorAll('[data-i18n]') ) {
    let text = chrome.i18n.getMessage(elem.getAttribute('data-i18n'));
    if ( !text ) { continue; }
    elem.appendChild( document.createTextNode(text));
}