(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** Creates a dropdown box.
 * @param btn The button to open and close the dropdown box.
 * @param box The node containing the contents of the dropdown box.
 */

var addDropdownBox = exports.addDropdownBox = function addDropdownBox(btn, box) {
    btn.bind('mousedown', function (event) {
        event.preventDefault();
        if (btn.hasClass('disabled')) {
            return;
        }
        if ('none' == box.css('display')) {
            openDropdownBox(box);
        }
    });
};

/** Opens a dropdown box.
 * @param box The node containing the contents of the dropdown box.
 */

var openDropdownBox = function openDropdownBox(box) {
    // Show this box
    box.show();
    // Give that the dropdown menu was opened through a mousedown event, there
    // will be a first click event following it. We will wait for the second
    // click event.
    jQuery(document).one('click', function () {
        jQuery(document).one('click', function (event) {
            event.preventDefault();
            box.hide();
        });
    });
};

/** Checkes or uncheckes a checkable label. This is used for example for bibliography categories when editing bibliography items.
 * @param label The node who's parent has to be checked or unchecked.
 */
var setCheckableLabel = exports.setCheckableLabel = function setCheckableLabel(label) {
    var checkbox = label.parent().find('input[type=checkbox]');
    if (label.hasClass('checked')) {
        label.removeClass('checked');
    } else {
        label.addClass('checked');
    }
};

/** Cover the page signaling to the user to wait.
 */
var activateWait = exports.activateWait = function activateWait() {
    jQuery('#wait').addClass('active');
};

/** Remove the wait cover.
 */
var deactivateWait = exports.deactivateWait = function deactivateWait() {
    jQuery('#wait').removeClass('active');
};

/** Show a message to the user.
 * @param alertType The type of message that is shown (error, warning, info or success).
 * @param alertMsg The message text.
 */
var addAlert = exports.addAlert = function addAlert(alertType, alertMsg) {
    var fadeSpeed = 300;
    var iconNames = {
        'error': 'icon-attention-circle',
        'warning': 'icon-attention-circle',
        'info': 'icon-info-circle',
        'success': 'icon-ok'
    };
    var alertBox = jQuery('<li class="alerts-' + alertType + ' ' + iconNames[alertType] + '">' + alertMsg + '</li>');
    if (0 === jQuery('#alerts-outer-wrapper').length) jQuery('body').append('<div id="alerts-outer-wrapper"><ul id="alerts-wrapper"></ul></div>');
    jQuery('#alerts-wrapper').append(alertBox);
    alertBox.fadeTo(fadeSpeed, 1, function () {
        jQuery(this).delay('2000').fadeOut(fadeSpeed, function () {
            jQuery(this).remove();
        });
    });
};

/** Turn milliseconds since epoch (UTC) into a local date string.
 * @param {number} milliseconds Number of milliseconds since epoch (1/1/1970 midnight, UTC).
 * @param {boolean} sortable Whether the result should appear in a date only list.
 */
var localizeDate = exports.localizeDate = function localizeDate(milliseconds, sortable) {
    milliseconds = parseInt(milliseconds);
    if (milliseconds > 0) {
        var theDate = new Date(milliseconds);
        if (true === sortable) {
            var yyyy = theDate.getFullYear(),
                mm = theDate.getMonth() + 1,
                dd = theDate.getDate();

            if (10 > mm) {
                mm = '0' + mm;
            }

            return yyyy + '/' + mm + '/' + dd;
        } else {
            return theDate.toLocaleString();
        }
    } else {
        return '';
    }
};

/** Get cookie to set as part of the request header of all AJAX requests to the server.
 * @param name The name of the token to look for in the cookie.
 */
var getCookie = exports.getCookie = function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

/**
 * The Cross Site Request Forgery (CSRF) token
 */
var csrfToken = exports.csrfToken = getCookie('csrftoken');

/**
 * Turn string literals into single line, removing spaces at start of line
 */

var noSpaceTmp = exports.noSpaceTmp = function noSpaceTmp(strings) {
    var values = [].slice.call(arguments);
    var tmpStrings = [].slice.call(values.shift());

    var combined = "";
    while (tmpStrings.length > 0 || values.length > 0) {
        if (tmpStrings.length > 0) {
            combined += tmpStrings.shift();
        }
        if (values.length > 0) {
            combined += values.shift();
        }
    }

    var out = "";
    combined.split('\n').forEach(function (line) {
        out += line.replace(/^\s*/g, '');
    });
    return out;
};

/**
 * Return a cancel promise if you need to cancel a promise chain. Import as
 * ES6 promises are not (yet) cancelable.
 */

var cancelPromise = exports.cancelPromise = function cancelPromise() {
    return new Promise(function () {});
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Menu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../common');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Bindings for the menu

var Menu = exports.Menu = function () {
    function Menu(activeItem) {
        _classCallCheck(this, Menu);

        this.activeItem = activeItem;
        this.bind();
    }

    _createClass(Menu, [{
        key: 'bind',
        value: function bind() {
            var _this = this;

            jQuery(document).ready(function () {
                _this.markCurrentlyActive();
                _this.bindPreferencePullDown();
            });
        }
    }, {
        key: 'markCurrentlyActive',
        value: function markCurrentlyActive() {
            // Mark currently active menu item
            var active = jQuery('body > header a[data-item="' + this.activeItem + '"]');
            active.addClass('active');
            active.parent().addClass('active-menu-wrapper');
        }
    }, {
        key: 'bindPreferencePullDown',
        value: function bindPreferencePullDown() {
            var box = jQuery('#user-preferences-pulldown');
            var button = jQuery('#preferences-btn');
            (0, _common.addDropdownBox)(button, box);

            // In addition to adding the dropdown, we also need to add some css
            // values so that the dropdown is placed close to #preferences-btn
            jQuery('#preferences-btn').bind('mousedown', function () {
                var btnOffset = button.offset();
                box.css({
                    'left': btnOffset.left - 52,
                    'top': btnOffset.top + 27
                });
            });
            // As a click will close the pulldown, we need to activate the link by means of a mousedown already.
            jQuery(document).on('mousedown', '#user-preferences-pulldown a', function (event) {
                event.preventDefault();
                window.location = jQuery(this).attr('href');
            });
            // Same for form button
            jQuery(document).on('mousedown', '#user-preferences-pulldown button[type="submit"]', function (event) {
                event.preventDefault();
                jQuery(this).closest('form').submit();
            });
        }
    }]);

    return Menu;
}();

},{"../common":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StyleDB = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../common');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* A class that holds information about styles uploaded by the user. */

var StyleDB = exports.StyleDB = function () {
    function StyleDB(userId) {
        _classCallCheck(this, StyleDB);

        this.userId = userId;
        this.db = {};
    }

    _createClass(StyleDB, [{
        key: 'getDB',
        value: function getDB(Default_List) {
            var _this = this;

            this.db = {};

            (0, _common.activateWait)();
            return new Promise(function (resolve, reject) {
                jQuery.ajax({
                    url: '/style/stylelist/',
                    data: {
                        'owner_id': _this.userId,
                        'Default_List': Default_List
                    },
                    type: 'POST',
                    dataType: 'json',
                    crossDomain: false, // obviates need for sameOrigin test
                    beforeSend: function beforeSend(xhr, settings) {
                        return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                    },

                    success: function success(response, textStatus, jqXHR) {
                        var pks = [];
                        for (var i = 0; i < response.styles.length; i++) {
                            _this.db[response.styles[i]['pk']] = response.styles[i];
                            pks.push(response.styles[i]['pk']);
                        }
                        resolve(pks);
                    },
                    error: function error(jqXHR, textStatus, errorThrown) {
                        (0, _common.addAlert)('error', jqXHR.responseText);
                        reject();
                    },
                    complete: function complete() {
                        return (0, _common.deactivateWait)();
                    }
                });
            });
        }
    }, {
        key: 'createStyle',
        value: function createStyle(postData, callback) {
            var that = this;
            (0, _common.activateWait)();
            // Remove old warning messages
            jQuery('#uploadstyle .warning').detach();
            // Send to server
            jQuery.ajax({
                url: '/style/save/',
                data: postData,
                type: 'POST',
                dataType: 'json',
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function beforeSend(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                },
                success: function success(response, textStatus, jqXHR) {
                    if (that.displayCreateStyleError(response.errormsg)) {
                        that.db[response.values.pk] = response.values;
                        (0, _common.addAlert)('success', gettext('The style has been uploaded'));
                        callback(response.values.pk);
                    } else {
                        (0, _common.addAlert)('error', gettext('Some errors are found. Please examine the form.'));
                    }
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.errormsg) {
                        (0, _common.addAlert)('error', jqXHR.responseJSON.errormsg);
                    }
                },
                complete: function complete() {
                    (0, _common.deactivateWait)();
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }
    }, {
        key: 'displayCreateStyleError',
        value: function displayCreateStyleError(errors) {
            var noError = true;
            for (var eKey in errors) {
                var eMsg = '<div class="warning">' + errors[eKey] + '</div>';
                if ('error' == eKey) {
                    jQuery('#uploadstyle').prepend(eMsg);
                } else {
                    jQuery('#id_' + eKey).after(eMsg);
                }
                noError = false;
            }
            return noError;
        }

        /** Delete a list of Style items both locally and on the server.
         * @function deleteStyle
         * @param ids A list of style item ids that are to be deleted.
         */

    }, {
        key: 'deleteStyle',
        value: function deleteStyle(ids, callback) {
            var that = this;
            for (var i = 0; i < ids.length; i++) {
                ids[i] = parseInt(ids[i]);
            }
            var postData = {
                'ids[]': ids
            };
            (0, _common.activateWait)();
            jQuery.ajax({
                url: '/style/delete/',
                data: postData,
                type: 'POST',
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function beforeSend(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                },
                success: function success(response, textStatus, jqXHR) {
                    for (var _i = 0; _i < ids.length; _i++) {
                        delete that.db[ids[_i]];
                    }
                    (0, _common.addAlert)('success', gettext('The style item(s) have been deleted'));
                    if (callback) {
                        callback(ids);
                    }
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    (0, _common.addAlert)('error', jqXHR.responseText);
                },
                complete: function complete() {
                    (0, _common.deactivateWait)();
                }
            });
        }
    }]);

    return StyleDB;
}();

},{"../common":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StyleOverview = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uploadDialog = require("../upload-dialog/upload-dialog");

var _common = require("../../common");

var _menu = require("../../menu");

var _templates = require("./templates");

var _database = require("../database");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleOverview = exports.StyleOverview = function () {
    function StyleOverview() {
        _classCallCheck(this, StyleOverview);

        new _menu.Menu("Style");
        this.getStyleDB();
        this.bind();
    }

    /* load data from the Style */


    _createClass(StyleOverview, [{
        key: "getStyleDB",
        value: function getStyleDB(callback) {
            var that = this;
            var docOwnerId = 0; // 0 = current user.
            this.styleDB = new _database.StyleDB(docOwnerId, true, false, false);

            this.styleDB.getDB(false, function (stylePks) {

                that.addStyleList(stylePks);
                if (callback) {
                    callback();
                }
            });
        }

        /** This takes a list of new style entries and adds them to StyleDB and the style table
         * @function addStyleList
         */

    }, {
        key: "addStyleList",
        value: function addStyleList(pks) {
            this.stopStyleTable();
            for (var i = 0; i < pks.length; i++) {
                this.appendToStyleTable(pks[i], this.styleDB.db[pks[i]]);
            }
            this.startStyleTable();
        }

        /** Dialog to confirm deletion of style items.
         * @function deleteStyleDialog
              * @param ids Ids of items that are to be deleted.
         */

    }, {
        key: "deleteStyleDialog",
        value: function deleteStyleDialog(ids) {
            var that = this;
            jQuery('body').append('<div id="confirmdeletion" title="' + gettext('Confirm deletion') + '"><p>' + gettext('Delete the Style item(s)') + '?</p></div>');
            var diaButtons = {};
            diaButtons[gettext('Delete')] = function () {
                that.deleteStyle(ids);
                jQuery(this).dialog('close');
            };
            diaButtons[gettext('Cancel')] = function () {
                jQuery(this).dialog('close');
            };
            jQuery("#confirmdeletion").dialog({
                resizable: false,
                height: 180,
                modal: true,
                buttons: diaButtons,
                create: function create() {
                    var theDialog = jQuery(this).closest(".ui-dialog");
                    theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
                    theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
                },
                close: function close() {
                    jQuery("#confirmdeletion").dialog('destroy').remove();
                }
            });
        }

        /** Add or update an item in the style table (HTML).
         * @function appendToStyleTable
              * @param pk The pk specifying the Style item.
         * @param styleInfo An object with the current information about the style item.
         */

    }, {
        key: "appendToStyleTable",
        value: function appendToStyleTable(pk) {
            var styleInfo = this.styleDB.db[pk];
            var $tr = jQuery('#style_' + pk);

            if (0 < $tr.length) {
                //if the image entry exists, update
                $tr.replaceWith((0, _templates.usermediaTableTemplate)({
                    pk: pk,
                    'font': styleInfo.font,
                    'title': styleInfo.title,
                    'css': styleInfo.css,
                    'latexcls': styleInfo.latexcls,
                    'docx': styleInfo.docx,
                    'added': styleInfo.added
                }));
            } else {
                //if this is the new image, append
                jQuery('#stylelist > tbody').append((0, _templates.usermediaTableTemplate)({
                    pk: pk,
                    'font': styleInfo.font,
                    'title': styleInfo.title,
                    'css': styleInfo.css,
                    'latexcls': styleInfo.latexcls,
                    'docx': styleInfo.docx,
                    'added': styleInfo.added
                }));
            }
        }
        /** Stop the interactive parts of the Style table.
         * @function stopStyleTable
              */

    }, {
        key: "stopStyleTable",
        value: function stopStyleTable() {
            jQuery('#style').dataTable().fnDestroy();
        }
        /** Start the interactive parts of the style table.
         * @function startStyleTable
              */

    }, {
        key: "startStyleTable",
        value: function startStyleTable() {
            // The sortable table seems not to have an option to accept new data added to the DOM. Instead we destroy and recreate it.
            var table = jQuery('#style').dataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": false,
                "bAutoWidth": false,
                "oLanguage": {
                    "sSearch": ''
                },
                "aoColumnDefs": [{
                    "bSortable": false,
                    "aTargets": [0, 5]
                }]
            });
            jQuery('#style_filter input').attr('placeholder', gettext('Search for Styles'));

            jQuery('#style_filter input').unbind('focus, blur');
            jQuery('#style_filter input').bind('focus', function () {
                jQuery(this).parent().addClass('focus');
            });
            jQuery('#style_filter input').bind('blur', function () {
                jQuery(this).parent().removeClass('focus');
            });

            var autocompleteTags = [];
            jQuery('#style .fw-searchable').each(function () {
                autocompleteTags.push(this.textContent.replace(/^\s+/g, '').replace(/\s+$/g, ''));
            });
            autocompleteTags = _.uniq(autocompleteTags);
            jQuery("#style_filter input").autocomplete({
                source: autocompleteTags
            });
        }
        /** Bind the init function to jQuery(document).ready.
         * @function bind
         */

    }, {
        key: "bind",
        value: function bind() {
            var that = this;
            jQuery(document).ready(function () {
                that.bindEvents();
            });
        }

        /** Initialize the style table and bind interactive parts.
         * @function init
              */

    }, {
        key: "bindEvents",
        value: function bindEvents() {
            var that = this;
            jQuery(document).on('click', '.delete-style', function () {
                var StyleId = jQuery(this).attr('data-id');
                that.deleteStyleDialog([StyleId]);
            });

            jQuery(document).on('click', '.edit-style', function () {
                var styleID = jQuery(this).attr('data-id');
                new _uploadDialog.StyleUploadDialog(that.styleDB, styleID, 0, function (newStylePks) {
                    that.addStyleList(newStylePks);
                });
            });

            //select all entries
            jQuery('#select-all-entry').bind('change', function () {
                var newBool = false;
                if (jQuery(this).prop("checked")) newBool = true;
                jQuery('.entry-select').each(function () {
                    this.checked = newBool;
                });
            });

            //open dropdown for selecting action
            (0, _common.addDropdownBox)(jQuery('#select-action-dropdown'), jQuery('#action-selection-pulldown'));

            //submit entry actions
            jQuery('#action-selection-pulldown li > span').bind('mousedown', function () {
                var actionName = jQuery(this).attr('data-action'),
                    ids = [];

                if ('' === actionName || 'undefined' == typeof actionName) {
                    return;
                }

                jQuery('.entry-select:checked').each(function () {
                    ids[ids.length] = jQuery(this).attr('data-id');
                });

                if (0 === ids.length) {
                    return;
                }

                switch (actionName) {
                    case 'delete':
                        that.deleteStyleDialog(ids);
                        break;
                    case 'export':
                        new StyleExporter(ids, that.style.db, true);
                        break;
                }
            });
        }
    }, {
        key: "deleteStyle",
        value: function deleteStyle(ids) {
            var that = this;
            this.styleDB.deleteStyle(ids, function (ids) {
                that.stopStyleTable();
                var elementsId = '#style_' + ids.join(', #style_');
                jQuery(elementsId).detach();
                that.startStyleTable();
            });
        }
    }, {
        key: "createStyle",
        value: function createStyle(styleData) {
            var that = this;
            this.styleDB.createStyle(styleData, function (newStylePks) {
                that.addStyleList(newStylePks);
            });
        }
    }]);

    return StyleOverview;
}();

},{"../../common":1,"../../menu":2,"../database":3,"../upload-dialog/upload-dialog":7,"./templates":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/** A template for style overview list. */
var usermediaTableTemplate = exports.usermediaTableTemplate = _.template('\
                <tr id="style_<%- pk %>" >\
                    <td width="30">\
                        <span class="fw-inline">\
                            <input type="checkbox" class="entry-select" data-id="<%- pk %>">\
                        </span>\
                    </td>\
                    <td  class="title">\
                        <span style="width:170px" class="fw-inline ">\
                            <span class="edit-style fw-link-text fw-searchable" data-id="<%- pk %>">\
                                <%- title !== "" ? title : "' + gettext('Untitled') + '" %>\
                            </span>\
                        </span>\
                    </td>\
                    <td width="170" class="css">\
                        <span style="width:160px" class="fw-inline ">\
                            <span class="edit-style fw-link-text fw-searchable" data-id="<%- pk %>">\
                                <%- css !== "" ? css : "' + gettext('Untitled') + '" %>\
                            </span>\
                        </span>\
                    </td>\
                    <td width="170" class="latex_cls">\
                        <span style="width:160px" class="fw-inline ">\
                            <span class="edit-style fw-link-text fw-searchable" data-id="<%- pk %>">\
                                <%- latexcls !== "" ? latexcls : "' + gettext('Untitled') + '" %>\
                            </span>\
                        </span>\
                    </td>\
                    <td  class="word_cls">\
                        <span style="width:160px" class="fw-inline ">\
                            <span class="edit-style fw-link-text fw-searchable" data-id="<%- pk %>">\
                                <%- docx !== "" ? docx : "' + gettext('Untitled') + '" %>\
                            </span>\
                        </span>\
                    </td>\
                    <td width="170" class="type ">\
                        <span class="fw-inline"></span>\
                    </td>\
                    <td width="170" class="file_type ">\
                        <span class="fw-inline">added</span>\
                    </td>\
                    <td width="50" align="center">\
                        <span class="delete-style fw-inline fw-link-text" data-id="<%- pk %>" data-title="<%- title %>">\
                            <i class="icon-trash"></i>\
                        </span>\
                    </td>\
                </tr>');

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* A template for the form for the style upload dialog. */
var usermediaUploadTemplate = exports.usermediaUploadTemplate = _.template('<div id="uploadstyle" class="fw-media-uploader" title="<%- action %>">\
    <form action="#" method="post" class="usermediaUploadForm">\
        <div>\
            <input name="title" class="fw-media-title fw-media-form" type="text" placeholder="' + gettext('Insert a title') + '" value="<%- title %>" />\
            <div style="padding-top: 10px">\
                <p id="css" style="width: 100px;padding:10px;float: left" class="fw-css-title fw-media-form">Css file:</p>\
                <input name="css" type="file" class="fw-media-cssfile-input fw-media-form">\
            </div>\
            <div style="padding-top: 10px">\
                <p id="latex" style="width: 100px;padding:10px;float: left" class="fw-latex-title fw-media-form">Latex Class:</p>\
                <input name="latexcls" type="file" class="fw-media-latexfile-input fw-media-form">\
            </div>\
            <div style="padding-top: 10px">\
                <p id="docx" style="width: 100px;padding:10px;float: left" class="fw-docx-title fw-media-form">Docx template:</p>\
\               <input name="docx" type="file" class="fw-media-docxfile-input fw-media-form">\
            </div>\
        </div>\
        </div></div>\
    </form></div>');

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StyleUploadDialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templates = require("./templates");

var _common = require("../../common");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleUploadDialog = exports.StyleUploadDialog = function () {
    function StyleUploadDialog(styleDB, styleId, ownerId, callback) {
        _classCallCheck(this, StyleUploadDialog);

        this.styleDB = styleDB;
        this.styleId = styleId;
        this.ownerId = ownerId;
        this.callback = callback;
        this.createStyleUploadDialog();
    }

    //open a dialog for uploading a Style


    _createClass(StyleUploadDialog, [{
        key: "createStyleUploadDialog",
        value: function createStyleUploadDialog() {
            var that = this;
            var title = void 0,
                style = void 0,
                action = void 0,
                longAction = void 0,
                css = void 0,
                docx = void 0,
                latexCls = void 0;
            if (this.styleId) {
                title = this.styleDB.db[this.styleId].title;
                if (this.styleDB.db[this.styleId].css && this.styleDB.db[this.styleId].css != 'Undefined') {
                    css = this.styleDB.db[this.styleId].css.filename;
                } else {
                    css = "No file selected.";
                }
                if (this.styleDB.db[this.styleId].docx && this.styleDB.db[this.styleId].docx != 'Undefined') {
                    docx = this.styleDB.db[this.styleId].docx.filename;
                } else {
                    docx = "No file selected.";
                }
                if (this.styleDB.db[this.styleId].latexcls && this.styleDB.db[this.styleId].latexcls != 'Undefined') {
                    latexCls = this.styleDB.db[this.styleId].latexcls.filename;
                } else {
                    latexCls = "No file selected.";
                }
                action = gettext('Update');
                longAction = gettext('Update style');
            } else {
                this.styleId = 0;
                css = "undefined";
                docx = "undefined";
                latexCls = "undefined";
                title = '';
                style = false;
                action = gettext('Upload');
                longAction = gettext('Upload style');
            }

            jQuery('body').append((0, _templates.usermediaUploadTemplate)({
                'action': longAction,
                'title': title,
                'css': css,
                'latexCls': latexCls,
                'docx': docx
            }));
            var diaButtons = {};
            diaButtons[action] = function () {

                if (jQuery("input[name='title']").val() == "") {
                    (0, _common.addAlert)('error', gettext('Please insert a Title'));
                } else {
                    that.onCreateStyleSubmitHandler();
                }
            };
            diaButtons[gettext('Cancel')] = function () {
                jQuery(this).dialog('close');
            };
            jQuery("#uploadstyle").dialog({
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: true,
                buttons: diaButtons,
                create: function create() {
                    var theDialog = jQuery(this).closest(".ui-dialog");
                    theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
                    theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
                    that.setMediaUploadEvents(jQuery('#uploadstyle'));
                },
                close: function close() {
                    jQuery("#uploadstyle").dialog('destroy').remove();
                }
            });

            jQuery('.fw-checkable-label').bind('click', function () {
                (0, _common.setCheckableLabel)(jQuery(this));
            });
        }

        //add style upload events

    }, {
        key: "setMediaUploadEvents",
        value: function setMediaUploadEvents(wrapper) {
            var cssButton = wrapper.find('.fw-media-css-button'),
                latexButton = wrapper.find('.fw-media-latex-button'),
                docxButton = wrapper.find('.fw-media-docx-button'),
                cssInput = wrapper.find('.fw-media-cssfile-input'),
                latexInput = wrapper.find('.fw-media-latexfile-input'),
                docxInput = wrapper.find('.fw-media-docxfile-input');

            cssButton.bind('click', function () {
                cssInput.trigger('click');
            });
            latexButton.bind('click', function () {
                latexInput.trigger('click');
            });
            docxButton.bind('click', function () {
                docxInput.trigger('click');
            });

            cssInput.bind('change', function () {
                var file = jQuery(this).prop('files')[0],
                    fr = new window.FileReader();
                fr.onload = function () {
                    //check extension
                };
                fr.readAsDataURL(file);
            });

            latexInput.bind('change', function () {
                var file = jQuery(this).prop('files')[0],
                    fr = new window.FileReader();
                fr.onload = function () {
                    //check extension
                };
                fr.readAsDataURL(file);
            });

            docxInput.bind('change', function () {
                var file = jQuery(this).prop('files')[0],
                    fr = new window.FileReader();
                fr.onload = function () {
                    //check extension
                };
                fr.readAsDataURL(file);
            });
        }
    }, {
        key: "onCreateStyleSubmitHandler",
        value: function onCreateStyleSubmitHandler() {
            //when submitted, the values in form elements will be restored
            var formValues = new window.FormData(),
                checkboxValues = {};

            formValues.append('styleid', this.styleId);

            if (this.ownerId) {
                formValues.append('owner_id', this.ownerId);
            }

            jQuery('.fw-media-form').each(function () {
                var $this = jQuery(this);
                var theName = $this.attr('name') || $this.attr('data-field-name');
                var theType = $this.attr('type') || $this.attr('data-type');
                var theValue = '';

                switch (theType) {
                    case 'checkbox':
                        //if it is a checkbox, the value will be restored as an Array
                        if (undefined === checkboxValues[theName]) checkboxValues[theName] = [];
                        if ($this.prop("checked")) {
                            checkboxValues[theName].push($this.val());
                        }
                        return;
                    case 'file':
                        theValue = $this.get(0).files[0];
                        break;
                    default:
                        theValue = $this.val();

                }

                formValues.append(theName, theValue);
            });

            // Add the values for check boxes
            for (var key in checkboxValues) {
                formValues.append(key, checkboxValues[key].join(','));
            }
            this.createStyle(formValues);
        }
    }, {
        key: "createStyle",
        value: function createStyle(styleData) {
            var that = this;
            this.styleDB.createStyle(styleData, function (styleId) {
                jQuery("#uploadstyle").dialog('close');
                that.styleId = styleId;
                that.callback([styleId]);
            });
        }
    }]);

    return StyleUploadDialog;
}();

},{"../../common":1,"./templates":6}],8:[function(require,module,exports){
"use strict";

var _overview = require("./es6_modules/style/overview/overview");

var theStyleOverview = new _overview.StyleOverview();

window.theStyleOverview = _overview.StyleOverview;

},{"./es6_modules/style/overview/overview":4}]},{},[8]);
