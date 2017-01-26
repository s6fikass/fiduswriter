(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _confirm_email = require("./es6_modules/profile/confirm_email");

(0, _confirm_email.bind)();

},{"./es6_modules/profile/confirm_email":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var bind = exports.bind = function bind() {
    jQuery(document).ready(function () {
        jQuery('.checker').bind('click', function () {
            var testCheck = false;
            if (jQuery('#test-check').length > 0) {
                if (jQuery('#test-check').is(':checked')) {
                    testCheck = true;
                }
            } else {
                testCheck = true;
            }
            if (testCheck && jQuery('#terms-check').is(':checked')) {
                jQuery('#submit').removeAttr("disabled");
            } else {
                jQuery('#submit').attr("disabled", "disabled");
            }
        });
        jQuery('#submit').bind('click', function () {
            window.alert(gettext('Thanks for verifying! You can now log in.'));
        });
    });
};

},{}]},{},[1]);
