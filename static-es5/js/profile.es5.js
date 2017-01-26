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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bind = undefined;

var _templates = require("./templates");

var _common = require("../common");

var _menu = require("../menu");

var changeAvatarDialog = function changeAvatarDialog() {
    jQuery('body').append(_templates.changeAvatarDialogTemplate);
    var diaButtons = {};
    diaButtons[gettext('Upload')] = function () {
        var $form = void 0,
            fData = void 0;
        (0, _common.activateWait)();
        $form = jQuery('#avatar-uploader-form');
        fData = new window.FormData($form[0]);
        jQuery.ajax({
            url: '/account/avatar/upload/',
            data: fData,
            type: 'POST',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function beforeSend(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
            },
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function success(response, textStatus, jqXHR) {
                jQuery('#profile-avatar > img').attr('src', response.avatar);
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            },
            complete: function complete() {
                (0, _common.deactivateWait)();
            }
        });
        jQuery(this).dialog('close');
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };
    jQuery("#change-avatar-dialog").dialog({
        resizable: false,
        height: 180,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var theDialog = jQuery(this).closest(".ui-dialog");
            theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
            jQuery('#avatar-uploader').bind('change', function () {
                jQuery('#uploaded-avatar-name').html(jQuery(this).val().replace(/C:\\fakepath\\/i, ''));
            });
            jQuery('#upload-avatar-btn').bind('click', function () {
                jQuery('#avatar-uploader').trigger('click');
            });
        },
        close: function close() {
            jQuery("#change-avatar-dialog").dialog('destroy').remove();
        }
    });
};

var deleteCurrentUser = function deleteCurrentUser() {
    (0, _common.activateWait)();
    jQuery.ajax({
        url: '/account/delete/',
        data: {},
        type: 'POST',
        dataType: 'json',
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function beforeSend(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
        },
        success: function success(response, textStatus, jqXHR) {
            window.location = '/logout/';
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        },
        complete: function complete() {
            return (0, _common.deactivateWait)();
        }
    });
};

var deleteAvatar = function deleteAvatar() {
    (0, _common.activateWait)();
    jQuery.ajax({
        url: '/account/avatar/delete/',
        data: {},
        type: 'POST',
        dataType: 'json',
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function beforeSend(xhr, settings) {
            return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
        },
        success: function success(response, textStatus, jqXHR) {
            return jQuery('#profile-avatar > img').attr('src', response.avatar);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            return console.error(jqXHR.responseText);
        },
        complete: function complete() {
            return (0, _common.deactivateWait)();
        }
    });
};

var deleteAvatarDialog = function deleteAvatarDialog() {
    jQuery('body').append(_templates.confirmDeleteAvatarTemplate);
    var diaButtons = {};
    diaButtons[gettext('Delete')] = function () {
        deleteAvatar();
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
            return jQuery("#confirmdeletion").dialog('destroy').remove();
        }
    });
};

var saveProfile = function saveProfile() {
    (0, _common.activateWait)();
    var postData = {
        'user': {
            'username': jQuery('#username').val(),
            'first_name': jQuery('#first_name').val(),
            'last_name': jQuery('#last_name').val()
        }
    };
    jQuery.ajax({
        url: '/account/save/',
        data: { 'form_data': JSON.stringify(postData) },
        type: 'POST',
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function beforeSend(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            if (422 === jqXHR.status) {
                jQuery('#edit_user').removeAttr("disabled");
                var response = jQuery.parseJSON(jqXHR.responseText);
                jQuery.each(response.errors, function (fieldname, errmsg) {
                    var firstError = '<span class="form-error-msg">' + errmsg[0] + '</span>';
                    jQuery('#' + fieldname).after(firstError);
                });
                var eMsg = gettext("Please check the above errors");
                jQuery('#emsg').text(eMsg).fadeIn('slow');
            } else {
                console.log(jqXHR.responseText);
            }
        },
        complete: function complete() {
            return (0, _common.deactivateWait)();
        }
    });
};

var deleteUserDialog = function deleteUserDialog() {
    var username = jQuery(this).attr('data-username');
    jQuery('body').append(_templates.deleteUserDialogTemplate);
    var diaButtons = {};
    diaButtons[gettext('Delete')] = function () {
        var usernamefieldValue = jQuery('#username-confirmation').val();
        if (usernamefieldValue === username) {
            deleteCurrentUser();
            jQuery(this).dialog('close');
        }
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };
    jQuery("#confirmaccountdeletion").dialog({
        resizable: false,
        height: 250,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var theDialog = jQuery(this).closest(".ui-dialog");
            theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
        },
        close: function close() {
            jQuery(this).dialog('destroy').remove();
        }
    });
};

var changePwdDialog = function changePwdDialog() {
    jQuery('body').append(_templates.changePwdDialogTemplate);
    var diaButtons = {};
    diaButtons[gettext('Submit')] = function () {
        var oldPwd = jQuery('#old-password-input').val(),
            newPwd1 = jQuery('#new-password-input1').val(),
            newPwd2 = jQuery('#new-password-input2').val();

        jQuery('#fw-password-change-error').html('');

        if ('' === oldPwd || '' === newPwd1 || '' === newPwd2) {
            jQuery('#fw-password-change-error').html(gettext('All fields are required!'));
            return;
        }

        if (newPwd1 !== newPwd2) {
            jQuery('#fw-password-change-error').html(gettext('Please confirm the new password!'));
            return;
        }

        var formData = new window.FormData(document.getElementById('fw-password-change-form'));

        (0, _common.activateWait)();
        jQuery.ajax({
            url: '/account/passwordchange/',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function beforeSend(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
            },
            success: function success(response, textStatus, jqXHR) {
                if (200 === jqXHR.status) {
                    jQuery("#fw-change-pwd-dialog").dialog('close');
                    window.alert(gettext('The password has been changed.'));
                } else {
                    var eMsg = void 0;
                    if (response.msg.hasOwnProperty('old_password')) {
                        eMsg = response.msg['old_password'][0];
                    } else if (response.msg.hasOwnProperty('new_password1')) {
                        eMsg = response.msg['new_password1'][0];
                    } else if (response.msg.hasOwnProperty('new_password2')) {
                        eMsg = response.msg['new_password2'][0];
                    } else {
                        eMsg = gettext('The password could not be changed!');
                    }
                    jQuery('#fw-password-change-error').html(eMsg);
                }
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                jQuery('#fw-password-change-error').html(gettext('The password could not be changed!'));
            },
            complete: function complete() {
                return (0, _common.deactivateWait)();
            }
        });
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };

    jQuery("#fw-change-pwd-dialog").dialog({
        resizable: false,
        height: 300,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var theDialog = jQuery(this).closest(".ui-dialog");
            theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
        },
        close: function close() {
            jQuery(this).dialog('destroy').remove();
        }
    });
};

var addEmailDialog = function addEmailDialog() {
    jQuery('body').append(_templates.changeEmailDialogTemplate);
    var diaButtons = {};
    diaButtons[gettext('Submit')] = function () {
        var newEmail = jQuery('#new-profile-email').val();
        newEmail = newEmail.replace(/(^\s+)|(\s+$)/g, "");

        jQuery('#fw-add-email-error').html('');

        if ('' === newEmail) {
            jQuery('#fw-add-email-error').html(gettext('New email address is required!'));
            return;
        }

        jQuery('#new-profile-email').val(newEmail);

        var formData = new window.FormData(document.getElementById('fw-add-email-form'));
        (0, _common.activateWait)();
        jQuery.ajax({
            url: '/account/emailadd/',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function beforeSend(xhr, settings) {
                return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
            },
            success: function success(response, textStatus, jqXHR) {
                if (200 == jqXHR.status) {
                    jQuery('#fw-add-email-dialog').dialog('close');
                    window.alert(gettext('Confirmation e-mail sent to ' + newEmail));
                } else {
                    var eMsg = response.msg['email'][0];
                    jQuery('#fw-add-email-error').html(eMsg);
                }
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                jQuery('#fw-add-email-error').html(gettext('The email could not be added!'));
            },
            complete: function complete() {
                return (0, _common.deactivateWait)();
            }
        });
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };

    jQuery("#fw-add-email-dialog").dialog({
        resizable: false,
        height: 230,
        modal: true,
        buttons: diaButtons,
        create: function create() {
            var theDialog = jQuery(this).closest(".ui-dialog");
            theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
            theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
        },
        close: function close() {
            jQuery(this).dialog('destroy').remove();
        }
    });
};

var deleteEmailDialog = function deleteEmailDialog() {
    var thisTr = jQuery(this).parent().parent(),
        email = jQuery(this).data('email'),
        diaButtons = {};

    jQuery('body').append((0, _templates.deleteEmailDialogTemplate)({
        'title': gettext('Confirm remove'),
        'text': gettext('Remove the email address') + ': ' + email + '?'
    }));

    diaButtons[gettext('Remove')] = function () {
        var formData = new window.FormData();
        formData.append('email', email);

        (0, _common.activateWait)();
        jQuery.ajax({
            url: '/account/emaildelete/',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function beforeSend(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
            },
            success: function success(response, textStatus, jqXHR) {
                if (200 == jqXHR.status) {
                    thisTr.remove();
                }
                jQuery('#fw-confirm-email-dialog').dialog('close');
                window.alert(gettext(response.msg));
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                jQuery('#fw-confirm-email-dialog').dialog('close');
                window.alert(gettext('The email could not be removed!'));
            },
            complete: function complete() {
                return (0, _common.deactivateWait)();
            }
        });
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery(this).dialog('close');
    };

    jQuery("#fw-confirm-email-dialog").dialog({
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
            jQuery(this).dialog('destroy').remove();
        }
    });
};

var changePrimaryEmailDialog = function changePrimaryEmailDialog() {
    var primEmailRadio = jQuery('.primary-email-radio:checked'),
        primEmailErapper = primEmailRadio.parent().parent(),
        primEmail = primEmailRadio.val(),
        diaButtons = {};

    jQuery('body').append((0, _templates.deleteEmailDialogTemplate)({
        'title': gettext('Confirm set primary'),
        'text': gettext('Set the email address primary') + ': ' + primEmail + '?'
    }));

    diaButtons[gettext('Submit')] = function () {
        var formData = new window.FormData();
        formData.append('email', primEmail);

        (0, _common.activateWait)();
        jQuery.ajax({
            url: '/account/emailprimary/',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function beforeSend(xhr, settings) {
                return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
            },
            success: function success(response, textStatus, jqXHR) {
                if (200 == jqXHR.status) {
                    jQuery('tr.primary-email-tr span.disabled').attr('class', 'delete-email fw-link-text');
                    primEmailErapper.find('span.delete-email.fw-link-text').attr('class', 'disabled');
                } else {
                    jQuery('tr.primary-email-tr .primary-email-radio').prop("checked", true);
                }
                window.alert(gettext(response.msg));
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                window.alert(gettext('The email could not be set primary!'));
            },
            complete: function complete() {
                jQuery('#fw-confirm-email-dialog').dialog('close');
                (0, _common.deactivateWait)();
            }
        });
    };
    diaButtons[gettext('Cancel')] = function () {
        jQuery('tr.primary-email-tr .primary-email-radio').prop("checked", true);
        jQuery(this).dialog('close');
    };

    jQuery("#fw-confirm-email-dialog").dialog({
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
            jQuery(this).dialog('destroy').remove();
        }
    });
};

var bind = exports.bind = function bind() {
    jQuery(document).ready(function () {
        new _menu.Menu(""); // Nothing highlighted
        (0, _common.addDropdownBox)(jQuery('#edit-avatar-btn'), jQuery('#edit-avatar-pulldown'));
        jQuery('.change-avatar').bind('mousedown', changeAvatarDialog);
        jQuery('.delete-avatar').bind('mousedown', deleteAvatarDialog);
        jQuery('#submit-profile').bind('click', saveProfile);
        jQuery('#delete-account').bind('click', deleteUserDialog);
        jQuery('#fw-edit-profile-pwd').bind('click', changePwdDialog);
        jQuery('#add-profile-email').bind('click', addEmailDialog);
        jQuery(document).on('click', '.delete-email', deleteEmailDialog);
        jQuery('.primary-email-radio').bind('change', changePrimaryEmailDialog);
    });
};

},{"../common":1,"../menu":2,"./templates":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** A template to confirm the deletion of a user avatar. */
var confirmDeleteAvatarTemplate = exports.confirmDeleteAvatarTemplate = '<div id="confirmdeletion" title="' + gettext('Confirm deletion') + '"><p>' + gettext('Delete the avatar') + '?</p></div>';

/** A template to change the user avatar. */
var changeAvatarDialogTemplate = exports.changeAvatarDialogTemplate = '<div id="change-avatar-dialog" title="' + gettext('Upload your profile picture') + '">\
        <form id="avatar-uploader-form" method="post" enctype="multipart/form-data" class="ajax-upload">\
            <input type="file" id="avatar-uploader" name="avatar" required />\
            <span id="upload-avatar-btn" class="fw-button fw-white fw-large">' + gettext('Select a file') + '</span>\
            <label id="uploaded-avatar-name" class="ajax-upload-label"></label>\
        </form>\
    </div>';

/** A template for the confirmation dialog to delete a user account. */
var deleteUserDialogTemplate = exports.deleteUserDialogTemplate = '<div id="confirmaccountdeletion" title="' + gettext('Confirm deletion') + '"><p>' + gettext('Really delete your account? Type in your username below to confirm deletion.') + '</p><input type="text" id="username-confirmation"></div>';

/** A template for the change email dialog of the user account. */
var changeEmailDialogTemplate = exports.changeEmailDialogTemplate = '<div id="fw-add-email-dialog" title="' + gettext('Add Email') + '">\
        <table class="ui-dialog-content-table"><tbody>\
            <tr><td>\
                <form id="fw-add-email-form" action="" method="post" onsubmit="return false;">\
                    <input type="text" name="email" id="new-profile-email" class="fw-profile-dialog-input" placeholder="' + gettext('Enter the new E-mail address') + '" />\
                </form>\
            </td></tr>\
            <tr><td><span id="fw-add-email-error" class="warning"></span></td></tr>\
        </tbody></table>\
    </div>';
/** A template for the delete email dialog of the user account. */
var deleteEmailDialogTemplate = exports.deleteEmailDialogTemplate = _.template('<div id="fw-confirm-email-dialog" title="<%= title %>">\
        <p><%- text %></p>\
    </div>');
/** A template for the change password dialog of the user account. */
var changePwdDialogTemplate = exports.changePwdDialogTemplate = '<div id="fw-change-pwd-dialog" title="' + gettext('Change Password') + '">\
        <table class="ui-dialog-content-table"><tbody>\
            <tr><td><form id="fw-password-change-form" action="" method="post" onsubmit="return false;">\
                <input type="password" id="old-password-input" name="old_password" class="fw-profile-dialog-input" placeholder="' + gettext('Old password') + '" /><br />\
                <input type="password" id="new-password-input1" name="new_password1" class="fw-profile-dialog-input" placeholder="' + gettext('New password') + '" /><br />\
                <input type="password" id="new-password-input2" name="new_password2" class="fw-profile-dialog-input" placeholder="' + gettext('Confirm the new password') + '" />\
            </form></td></tr>\
            <tr><td><span id="fw-password-change-error" class="warning"></span></td></tr>\
        </tbody></table>\
    </div>';

},{}],5:[function(require,module,exports){
"use strict";

var _profile = require("./es6_modules/profile");

(0, _profile.bind)();

},{"./es6_modules/profile":3}]},{},[5]);
