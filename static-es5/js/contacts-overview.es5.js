(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _contacts = require("./es6_modules/contacts");

(0, _contacts.contactsOverview)();

},{"./es6_modules/contacts":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contactsOverview = undefined;

var _templates = require("./templates");

var _manage = require("./manage");

var _common = require("../common");

var _menu = require("../menu");

var contactsOverview = exports.contactsOverview = function contactsOverview() {

    jQuery(document).ready(function () {
        new _menu.Menu(""); // Nothing highlighted.

        //intialize the teammember table
        jQuery('#team-table tbody').append((0, _templates.teammemberTemplate)({ 'members': window.teammembers }));

        //select all members
        jQuery('#select-all-entry').bind('change', function () {
            var new_bool = false;
            if (jQuery(this).prop("checked")) new_bool = true;
            jQuery('.entry-select').not(':disabled').each(function () {
                this.checked = new_bool;
            });
        });

        jQuery('.add-contact').bind('click', function () {
            (0, _manage.addMemberDialog)().then(function (memberData) {
                jQuery('#team-table tbody').append((0, _templates.teammemberTemplate)({
                    'members': [memberData]
                }));
            });
        });

        (0, _common.addDropdownBox)(jQuery('#select-action-dropdown'), jQuery('#action-selection-pulldown'));
        jQuery('#action-selection-pulldown span').bind('mousedown', function () {
            var ids = [],
                action_name = jQuery(this).attr('data-action');
            if ('' === action_name || 'undefined' == typeof action_name) return;
            jQuery('.entry-select:checked').each(function () {
                ids[ids.length] = parseInt(jQuery(this).attr('data-id'));
            });
            (0, _manage.deleteMemberDialog)(ids);
        });

        //delete single user
        jQuery(document).on('click', '.delete-single-member', function () {
            (0, _manage.deleteMemberDialog)([jQuery(this).attr('data-id')]);
        });
    });
};

},{"../common":2,"../menu":6,"./manage":4,"./templates":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteMemberDialog = exports.addMemberDialog = undefined;

var _templates = require("./templates");

var _common = require("../common");

/**
 * Sets up the contacts management. Helper functions for adding and removing contacts.
 */

//add a user to contact per ajax
var addMember = function addMember(userString) {
    if (null === userString || 'undefined' == typeof userString) {
        return (0, _common.cancelPromise)();
    }

    userString = jQuery.trim(userString);
    jQuery('#add-new-member .warning').detach();
    if ('' === userString) {
        return (0, _common.cancelPromise)();
    }
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: '/account/teammember/add',
            data: {
                'user_string': userString
            },
            type: 'POST',
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function beforeSend(xhr, settings) {
                return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
            },
            success: function success(response, textStatus, jqXHR) {
                if (jqXHR.status == 201) {
                    //user added to the contacts
                    jQuery("#add-new-member").dialog('close');
                    resolve(response.member);
                    return;
                } else {
                    //user not found
                    var responseHtml = void 0;

                    if (response.error === 1) {
                        responseHtml = gettext('You cannot add yourself to your contacts!');
                    } else if (response.error === 2) {
                        responseHtml = gettext('This person is already in your contacts');
                    } else if (userString.indexOf('@') != -1 && userString.indexOf('.') != -1) {
                        responseHtml = gettext('No user is registered with the given email address.') + '<br />' + gettext('Please invite him/her ') + '<a target="_blank" href="mailto:' + userString + '?subject=' + encodeURIComponent(gettext('Fidus Writer')) + '&body=' + encodeURIComponent(gettext('Hey, I would like you to sign up for a Fidus Writer account.') + "\n" + gettext('Please register at')) + ' ' + window.location.origin + '">' + gettext('by sending an email') + '</a>!';
                    } else {
                        responseHtml = gettext('User is not registered.');
                    }
                    jQuery('#add-new-member').append('<div class="warning" style="padding: 8px;">' + responseHtml + '</div>');
                    return resolve((0, _common.cancelPromise)());
                }
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                console.error(jqXHR.responseText);
                reject();
            }
        });
    });
};

//dialog for adding a user to contacts
var addMemberDialog = exports.addMemberDialog = function addMemberDialog() {
    var dialogHeader = gettext('Add a user to your contacts');
    jQuery('body').append((0, _templates.addTeammemberTemplate)({
        'dialogHeader': dialogHeader
    }));

    return new Promise(function (resolve) {
        var diaButtons = {};
        diaButtons[gettext('Submit')] = function () {
            addMember(jQuery('#new-member-user-string').val()).then(function (memberData) {
                resolve(memberData);
                return;
            });
        };
        diaButtons[gettext('Cancel')] = function () {
            jQuery(this).dialog('close');
        };

        jQuery("#add-new-member").dialog({
            resizable: false,
            width: 350,
            height: 250,
            modal: true,
            buttons: diaButtons,
            create: function create() {
                var theDialog = jQuery(this).closest(".ui-dialog");
                theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
                theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
                jQuery('#new-member-user-string').css('width', 340);
            },
            close: function close() {
                jQuery("#add-new-member").dialog('destroy').remove();
            }
        });
    });
};

var deleteMember = function deleteMember(ids) {
    jQuery.ajax({
        url: '/account/teammember/remove',
        data: {
            'members[]': ids
        },
        type: 'POST',
        dataType: 'json',
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function beforeSend(xhr, settings) {
            return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
        },
        success: function success(response, textStatus, jqXHR) {
            if (jqXHR.status == 200) {
                //user removed from contacts
                jQuery('#user-' + ids.join(', #user-')).remove();
                jQuery("#confirmdeletion").dialog('close');
            }
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            return console.error(jqXHR.responseText);
        }
    });
};

//dialog for removing a user from contacts
var deleteMemberDialog = exports.deleteMemberDialog = function deleteMemberDialog(memberIds) {
    var _this = this;

    jQuery('body').append('<div id="confirmdeletion" title="' + gettext('Confirm deletion') + '"><p>' + gettext('Remove from the contacts') + '?</p></div>');
    var diaButtons = {};
    diaButtons[gettext('Delete')] = function () {
        deleteMember(memberIds);
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(_this).dialog('close');
    };
    jQuery("#confirmdeletion").dialog({
        resizable: false,
        height: 200,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var theDialog = jQuery(this).closest(".ui-dialog");
            theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
        },
        close: function close() {
            return jQuery("#confirmdeletion").dialog('destroy').remove();
        }
    });
};

},{"../common":2,"./templates":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
//template for the list of teammembers
var teammemberTemplate = exports.teammemberTemplate = _.template('<% _.each(members, function(member) { %>\
    <tr id="user-<%= member.id %>">\
        <td width="30">\
            <span class="fw-inline"><input type="checkbox" class="entry-select" data-id="<%= member.id %>"/></span>\
        </td>\
        <td width="350">\
            <span><img class="fw-avatar" src="<%= member.avatar %>" /></span>\
            <span class="fw-inline"><%- member.name %></span>\
        </td>\
        <td width="350">\
            <span class="fw-inline"><%- member.email %></span>\
        </td>\
        <td width="50" align="center">\
            <span class="fw-link-text delete-single-member fw-inline" data-id="<%= member.id %>">\
                <i class="icon-trash"></i>\
            </span>\
        </td>\
    </tr><% }) %>');

//template for member adding dialog
var addTeammemberTemplate = exports.addTeammemberTemplate = _.template('\
    <div id="add-new-member" title="<%- dialogHeader %>">\
        <table class="ui-dialog-content-table"><tbody><tr><td>\
            <input type="text" name="user_string" id="new-member-user-string" placeholder="' + gettext('E-mail address or username') + '" />\
        </td></tr></tbody></table>\
    </div>');

},{}],6:[function(require,module,exports){
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

},{"../common":2}]},{},[1]);
