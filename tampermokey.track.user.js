// ==UserScript==
// @name         reading track
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  track your readings via github
// @author       You
// @include      http://*
// @include      https://*
// @include      *
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      maker.ifttt.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function doPost (url, title, context) {
        var data = {
            value1: title,
            value2: context,
            value3: "browser"
        }
        data = JSON.stringify(data)
        console.log(data)
        GM_xmlhttpRequest({
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            url: url,
            data: data,
            onload: function(response) {
                alert(response.responseText);
            }
        })
    }

    GM_registerMenuCommand(
        "ReadItLater",
        function (e) {
            doPost("https://maker.ifttt.com/trigger/new_thing_to_read/with/key/u-4iS9TUpardP7s_a3q4m", document.title, window.location.href, "")
        },
        "a" // quick access when open the menu
    )
})();