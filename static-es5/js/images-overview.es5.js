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
exports.ImageDB = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../common');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* A class that holds information about images uploaded by the user. */

var ImageDB = exports.ImageDB = function () {
    function ImageDB(userId) {
        _classCallCheck(this, ImageDB);

        this.userId = userId;
        this.db = {};
        this.cats = [];
    }

    _createClass(ImageDB, [{
        key: 'getDB',
        value: function getDB() {
            var _this = this;

            this.db = {};
            this.cats = [];

            (0, _common.activateWait)();
            return new Promise(function (resolve, reject) {
                jQuery.ajax({
                    url: '/usermedia/images/',
                    data: {
                        'owner_id': _this.userId
                    },
                    type: 'POST',
                    dataType: 'json',
                    crossDomain: false, // obviates need for sameOrigin test
                    beforeSend: function beforeSend(xhr, settings) {
                        return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                    },
                    success: function success(response, textStatus, jqXHR) {
                        _this.cats = response.imageCategories;
                        var pks = [];
                        for (var i = 0; i < response.images.length; i++) {
                            response.images[i].image = response.images[i].image.split('?')[0];
                            _this.db[response.images[i]['pk']] = response.images[i];
                            pks.push(response.images[i]['pk']);
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
        key: 'createImage',
        value: function createImage(postData) {
            var _this2 = this;

            (0, _common.activateWait)();
            // Remove old warning messages
            jQuery('#uploadimage .warning').detach();

            return new Promise(function (resolve, reject) {
                // Send to server
                jQuery.ajax({
                    url: '/usermedia/save/',
                    data: postData,
                    type: 'POST',
                    dataType: 'json',
                    crossDomain: false, // obviates need for sameOrigin test
                    beforeSend: function beforeSend(xhr, settings) {
                        return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                    },
                    success: function success(response, textStatus, jqXHR) {
                        if (_this2.displayCreateImageError(response.errormsg)) {
                            _this2.db[response.values.pk] = response.values;
                            (0, _common.addAlert)('success', gettext('The image has been uploaded'));
                            resolve(response.values.pk);
                        } else {
                            (0, _common.addAlert)('error', gettext('Some errors are found. Please examine the form.'));
                            reject();
                        }
                    },
                    error: function error(jqXHR, textStatus, errorThrown) {
                        if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.errormsg) {
                            (0, _common.addAlert)('error', jqXHR.responseJSON.errormsg);
                        }
                        reject();
                    },
                    complete: function complete() {
                        return (0, _common.deactivateWait)();
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            });
        }
    }, {
        key: 'displayCreateImageError',
        value: function displayCreateImageError(errors) {
            var noError = true;
            for (var eKey in errors) {
                var eMsg = '<div class="warning">' + errors[eKey] + '</div>';
                if ('error' == eKey) {
                    jQuery('#uploadimage').prepend(eMsg);
                } else {
                    jQuery('#id_' + eKey).after(eMsg);
                }
                noError = false;
            }
            return noError;
        }
    }]);

    return ImageDB;
}();

},{"../common":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageOverviewCategories = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templates = require("./templates");

var _common = require("../../common");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageOverviewCategories = exports.ImageOverviewCategories = function () {
    function ImageOverviewCategories(imageOverview) {
        _classCallCheck(this, ImageOverviewCategories);

        this.imageOverview = imageOverview;
        imageOverview.mod.categories = this;
    }
    //save changes or create a new category


    _createClass(ImageOverviewCategories, [{
        key: "createCategory",
        value: function createCategory(cats) {
            var _this = this;

            var postData = {
                'ids[]': cats.ids,
                'titles[]': cats.titles
            };
            (0, _common.activateWait)();
            jQuery.ajax({
                url: '/usermedia/save_category/',
                data: postData,
                type: 'POST',
                dataType: 'json',
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function beforeSend(xhr, settings) {
                    return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                },
                success: function success(response, textStatus, jqXHR) {
                    if (jqXHR.status == 201) {
                        // TODO: Why do we reload the entire list when one new category is created?
                        _this.imageOverview.imageDB.cats = response.entries;
                        jQuery('#image-category-list li').not(':first').remove();
                        _this.addImageCategoryList(response.entries);

                        (0, _common.addAlert)('success', gettext('The categories have been updated'));
                    }
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    (0, _common.addAlert)('error', jqXHR.responseText);
                },
                complete: function complete() {
                    return (0, _common.deactivateWait)();
                }
            });
        }
    }, {
        key: "addImageCategoryList",
        value: function addImageCategoryList(newimageCategories) {
            //imageCategories = imageCategories.concat(newimageCategories)
            for (var i = 0; i < newimageCategories.length; i++) {
                this.appendToImageCatList(newimageCategories[i]);
            }
        }
    }, {
        key: "appendToImageCatList",
        value: function appendToImageCatList(iCat) {
            jQuery('#image-category-list').append((0, _templates.usermediaCategoryListItemTemplate)({
                'iCat': iCat
            }));
        }

        //delete an image category

    }, {
        key: "deleteCategory",
        value: function deleteCategory(ids) {
            var postData = {
                'ids[]': ids
            };
            jQuery.ajax({
                url: '/usermedia/delete_category/',
                data: postData,
                type: 'POST',
                dataType: 'json',
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function beforeSend(xhr, settings) {
                    return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                }
            });
        }

        //open a dialog for editing categories

    }, {
        key: "createCategoryDialog",
        value: function createCategoryDialog() {
            var dialogHeader = gettext('Edit Categories');
            var dialogBody = (0, _templates.usermediaEditcategoriesTemplate)({
                'dialogHeader': dialogHeader,
                'categories': (0, _templates.usermediaCategoryformsTemplate)({
                    'categories': this.imageOverview.imageDB.cats
                })
            });
            jQuery('body').append(dialogBody);
            var diaButtons = {};
            var that = this;
            diaButtons[gettext('Submit')] = function () {
                var newCat = {
                    'ids': [],
                    'titles': []
                };
                var deletedCats = [];
                jQuery('#editCategories .category-form').each(function () {
                    var thisVal = jQuery.trim(jQuery(this).val());
                    var thisId = jQuery(this).attr('data-id');
                    if ('undefined' == typeof thisId) thisId = 0;
                    if ('' !== thisVal) {
                        newCat.ids.push(thisId);
                        newCat.titles.push(thisVal);
                    } else if ('' === thisVal && 0 < thisId) {
                        deletedCats.push(thisId);
                    }
                });
                that.deleteCategory(deletedCats);
                that.createCategory(newCat);
                jQuery(this).dialog('close');
            };
            diaButtons[gettext('Cancel')] = function () {
                jQuery(this).dialog('close');
            };
            jQuery("#editCategories").dialog({
                resizable: false,
                width: 350,
                height: 350,
                modal: true,
                buttons: diaButtons,
                create: function create() {
                    var theDialog = jQuery(this).closest(".ui-dialog");
                    theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
                    theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
                },
                close: function close() {
                    return jQuery("#editCategories").dialog('destroy').remove();
                }
            });
            this.addRemoveListHandler();
        }
    }, {
        key: "addRemoveListHandler",
        value: function addRemoveListHandler() {
            //add and remove name list field
            jQuery('.fw-add-input').bind('click', function () {
                var parent = jQuery(this).parents('.fw-list-input');
                if (0 === parent.next().length) {
                    var parentClone = parent.clone(true);
                    parentClone.find('input, select').val('').removeAttr('data-id');
                    parentClone.insertAfter(parent);
                } else {
                    var thePrev = jQuery(this).prev();
                    if (thePrev.hasClass("category-form")) {
                        // TODO: Figure out what this was about
                        //let thisId = thePrev.attr('data-id')
                        //if (undefined !== thisId)
                        //    deleted_cat[deleted_cat.length] = thisId
                    }
                    parent.remove();
                }
            });
            jQuery('.dk').dropkick();
        }
    }]);

    return ImageOverviewCategories;
}();

},{"../../common":1,"./templates":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageOverview = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uploadDialog = require("../upload-dialog");

var _database = require("../database");

var _categories = require("./categories");

var _common = require("../../common");

var _menu = require("../../menu");

var _templates = require("./templates");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Helper functions for user added images/SVGs.*/

var ImageOverview = exports.ImageOverview = function () {
    function ImageOverview() {
        _classCallCheck(this, ImageOverview);

        this.mod = {};
        new _categories.ImageOverviewCategories(this);
        new _menu.Menu("images");
        this.bind();
    }

    //delete image


    _createClass(ImageOverview, [{
        key: "deleteImage",
        value: function deleteImage(ids) {
            var _this = this;

            for (var i = 0; i < ids.length; i++) {
                ids[i] = parseInt(ids[i]);
            }
            var postData = {
                'ids[]': ids
            };
            (0, _common.activateWait)();
            jQuery.ajax({
                url: '/usermedia/delete/',
                data: postData,
                type: 'POST',
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function beforeSend(xhr, settings) {
                    return xhr.setRequestHeader("X-CSRFToken", _common.csrfToken);
                },
                success: function success(response, textStatus, jqXHR) {
                    _this.stopUsermediaTable();
                    var len = ids.length;
                    for (var _i = 0; _i < len; _i++) {
                        delete _this.imageDB[ids[_i]];
                    }
                    var elementsId = '#Image_' + ids.join(', #Image_');
                    jQuery(elementsId).detach();
                    _this.startUsermediaTable();
                    (0, _common.addAlert)('success', gettext('The image(s) have been deleted'));
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    (0, _common.addAlert)('error', jqXHR.responseText);
                },
                complete: function complete() {
                    (0, _common.deactivateWait)();
                }
            });
        }
    }, {
        key: "deleteImageDialog",
        value: function deleteImageDialog(ids) {
            jQuery('body').append('<div id="confirmdeletion" title="' + gettext('Confirm deletion') + '"><p>' + gettext('Delete the image(s)') + '?</p></div>');
            var diaButtons = {};
            var that = this;
            diaButtons[gettext('Delete')] = function () {
                that.deleteImage(ids);
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
    }, {
        key: "addImageDB",
        value: function addImageDB(imagePks) {
            for (var i = 0; i < imagePks.length; i++) {
                this.appendToImageTable(imagePks[i]);
            }
            this.startUsermediaTable();
        }
    }, {
        key: "appendToImageTable",
        value: function appendToImageTable(pk) {
            var imageInfo = this.imageDB.db[pk];
            var $tr = jQuery('#Image_' + pk);
            var fileType = imageInfo.file_type.split('/');

            if (1 < fileType.length) {
                fileType = fileType[1].toUpperCase();
            } else {
                fileType = fileType[0].toUpperCase();
            }

            if (0 < $tr.length) {
                //if the image entry exists, update
                $tr.replaceWith((0, _templates.usermediaTableTemplate)({
                    pk: pk,
                    'cats': imageInfo.cats,
                    fileType: fileType,
                    'title': imageInfo.title,
                    'thumbnail': imageInfo.thumbnail,
                    'image': imageInfo.image,
                    'height': imageInfo.height,
                    'width': imageInfo.width,
                    'added': imageInfo.added,
                    localizeDate: _common.localizeDate
                }));
            } else {
                //if this is the new image, append
                jQuery('#imagelist > tbody').append((0, _templates.usermediaTableTemplate)({
                    pk: pk,
                    'cats': imageInfo.cats,
                    fileType: fileType,
                    'title': imageInfo.title,
                    'thumbnail': imageInfo.thumbnail,
                    'image': imageInfo.image,
                    'height': imageInfo.height,
                    'width': imageInfo.width,
                    'added': imageInfo.added,
                    localizeDate: _common.localizeDate
                }));
            }
        }
    }, {
        key: "getImageDB",
        value: function getImageDB() {
            var _this2 = this;

            var imageGetter = new _database.ImageDB(0);
            imageGetter.getDB().then(function (pks) {
                _this2.imageDB = imageGetter;
                _this2.mod.categories.addImageCategoryList(imageGetter.cats);
                _this2.addImageDB(pks);
            });
        }
    }, {
        key: "stopUsermediaTable",
        value: function stopUsermediaTable() {
            jQuery('#imagelist').dataTable().fnDestroy();
        }
    }, {
        key: "startUsermediaTable",
        value: function startUsermediaTable() {
            /* The sortable table seems not to have an option to accept new data
            added to the DOM. Instead we destroy and recreate it.
            */

            jQuery('#imagelist').dataTable({
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
                    "aTargets": [0, 2, 4]
                }]
            });
            jQuery('#imagelist_filter input').attr('placeholder', gettext('Search for Filename'));

            jQuery('#imagelist_filter input').unbind('focus, blur');
            jQuery('#imagelist_filter input').bind('focus', function () {
                jQuery(this).parent().addClass('focus');
            });
            jQuery('#imagelist_filter input').bind('blur', function () {
                jQuery(this).parent().removeClass('focus');
            });

            var autocompleteTags = [];
            jQuery('#imagelist .fw-searchable').each(function () {
                autocompleteTags.push(this.textContent.replace(/^\s+/g, '').replace(/\s+$/g, ''));
            });
            autocompleteTags = _.uniq(autocompleteTags);
            jQuery("#imagelist_filter input").autocomplete({
                source: autocompleteTags
            });
        }
    }, {
        key: "bindEvents",
        value: function bindEvents() {
            var _this3 = this;

            var that = this;
            jQuery(document).on('click', '.delete-image', function () {
                var ImageId = jQuery(this).attr('data-id');
                that.deleteImageDialog([ImageId]);
            });

            jQuery(document).on('click', '.edit-image', function () {
                var iID = parseInt(jQuery(this).attr('data-id'));
                var iType = jQuery(this).attr('data-type');
                var imageUpload = new _uploadDialog.ImageUploadDialog(that.imageDB, iID, 0);
                imageUpload.init().then(function (imageId) {
                    that.stopUsermediaTable();
                    that.appendToImageTable(imageId);
                    that.startUsermediaTable();
                });
            });
            jQuery('#edit-category').bind('click', function () {
                _this3.mod.categories.createCategoryDialog();
            });
            //open dropdown for image category
            (0, _common.addDropdownBox)(jQuery('#image-category-btn'), jQuery('#image-category-pulldown'));
            jQuery(document).on('mousedown', '#image-category-pulldown li > span', function () {
                jQuery('#image-category-btn > label').html(jQuery(this).html());
                jQuery('#image-category').val(jQuery(this).attr('data-id'));
                jQuery('#image-category').trigger('change');
            });
            //filtering function for the list of images
            jQuery('#image-category').bind('change', function () {
                var catVal = jQuery(this).val();
                if ('0' === catVal) {
                    jQuery('#imagelist > tbody > tr').show();
                } else {
                    jQuery('#imagelist > tbody > tr').hide();
                    jQuery('#imagelist > tbody > tr.cat_' + catVal).show();
                }
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
            //submit image actions
            jQuery('#action-selection-pulldown li > span').bind('mousedown', function () {
                var actionName = jQuery(this).attr('data-action'),
                    ids = [];
                if ('' === actionName || 'undefined' == typeof actionName) return;
                jQuery('.entry-select:checked').each(function () {
                    ids[ids.length] = jQuery(this).attr('data-id');
                });
                if (0 === ids.length) return;
                switch (actionName) {
                    case 'delete':
                        that.deleteImageDialog(ids);
                        break;
                }
            });
        }
    }, {
        key: "init",
        value: function init() {
            this.bindEvents();
            this.getImageDB();
        }
    }, {
        key: "bind",
        value: function bind() {
            var _this4 = this;

            jQuery(document).ready(function () {
                _this4.init();
            });
        }
    }]);

    return ImageOverview;
}();

},{"../../common":1,"../../menu":8,"../database":2,"../upload-dialog":6,"./categories":3,"./templates":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** A template to edit image categories. */
var usermediaEditcategoriesTemplate = exports.usermediaEditcategoriesTemplate = _.template('\
    <div id="editCategories" title="<%- dialogHeader %>">\
        <table id="editCategoryList" class="fw-dialog-table"><tbody><%= categories %></tbody></table>\
    </div>');

/** A template for the image category edit form. */
var usermediaCategoryformsTemplate = exports.usermediaCategoryformsTemplate = _.template('\
    <% _.each(categories, function(cat) { %>\
    <tr id="categoryTr_<%- cat.id %>" class="fw-list-input">\
        <td>\
            <input type="text" class="category-form" id="categoryTitle_<%- cat.id %>" value="<%= cat.category_title %>" data-id="<%- cat.id %>" />\
            <span class="fw-add-input icon-addremove"></span>\
        </td>\
    </tr>\
    <% }) %>\
    <tr class="fw-list-input">\
        <td>\
            <input type="text" class="category-form" />\
            <span class="fw-add-input icon-addremove"></span>\
        </td>\
    </tr>');

/** A template for image overview list. */
var usermediaTableTemplate = exports.usermediaTableTemplate = _.template('\
                <tr id="Image_<%- pk %>" class="<% _.each(cats, function(cat) { %>cat_<%- cat %> <% }) %>">\
                    <td width="30">\
                        <span class="fw-inline">\
                            <input type="checkbox" class="entry-select" data-id="<%- pk %>">\
                        </span>\
                    </td>\
                    <td width="350" class="title">\
                        <span class="fw-usermedia-image">\
                            <img src="<% if(thumbnail) { %><%- thumbnail %><% } else { %><%- image %><% } %>">\
                        </span>\
                        <span class="fw-inline fw-usermedia-title">\
                            <span class="edit-image fw-link-text fw-searchable" data-id="<%- pk %>">\
                                <%- title !== "" ? title : "' + gettext('Untitled') + '" %>\
                            </span>\
                            <span class="fw-usermedia-type"><%- fileType %></span>\
                        </span>\
                    </td>\
                    <td width="170" class="type ">\
                        <span class="fw-inline"><%- width %> x <%- height %></span>\
                    </td>\
                    <td width="170" class="file_type ">\
                        <span class="fw-inline"><%= localizeDate(added, true) %></span>\
                    </td>\
                    <td width="50" align="center">\
                        <span class="delete-image fw-inline fw-link-text" data-id="<%- pk %>" data-title="<%- title %>">\
                            <i class="icon-trash"></i>\
                        </span>\
                    </td>\
                </tr>');

/* A template for each image category list item */
var usermediaCategoryListItemTemplate = exports.usermediaCategoryListItemTemplate = _.template('\
    <li>\
        <span class="fw-pulldown-item" data-id="<%- iCat.id %>">\
            <%- iCat.category_title %>\
        </span>\
    </li>');

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageUploadDialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templates = require("./templates");

var _common = require("../../common");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageUploadDialog = exports.ImageUploadDialog = function () {
    function ImageUploadDialog(imageDB, imageId, ownerId) {
        _classCallCheck(this, ImageUploadDialog);

        this.imageDB = imageDB;
        this.imageId = imageId;
        this.ownerId = ownerId;
    }

    //open a dialog for uploading an image


    _createClass(ImageUploadDialog, [{
        key: "init",
        value: function init() {
            var _this = this;

            var title = void 0,
                imageCat = void 0,
                thumbnail = void 0,
                image = void 0,
                action = void 0,
                longAction = void 0;
            if (this.imageId) {
                title = this.imageDB.db[this.imageId].title;
                thumbnail = this.imageDB.db[this.imageId].thumbnail;
                image = this.imageDB.db[this.imageId].image;
                imageCat = this.imageDB.db[this.imageId].cats;
                action = gettext('Update');
                longAction = gettext('Update image');
            } else {
                this.imageId = 0;
                title = '';
                imageCat = [];
                thumbnail = false;
                image = false;
                action = gettext('Upload');
                longAction = gettext('Upload image');
            }

            var iCats = [];
            jQuery.each(this.imageDB.cats, function (i, iCat) {
                var len = iCats.length;
                iCats[len] = {
                    'id': iCat.id,
                    'category_title': iCat.category_title
                };
                if (0 <= jQuery.inArray(String(iCat.id), imageCat)) {
                    iCats[len].checked = ' checked';
                } else {
                    iCats[len].checked = '';
                }
            });

            jQuery('body').append((0, _templates.usermediaUploadTemplate)({
                'action': longAction,
                'title': title,
                'thumbnail': thumbnail,
                'image': image,
                'categories': (0, _templates.usermediaUploadCategoryTemplate)({
                    'categories': iCats,
                    'fieldTitle': gettext('Select categories')
                })
            }));
            var diaButtons = {};

            var returnPromise = new Promise(function (resolve) {
                diaButtons[action] = function () {
                    return resolve(_this.onCreateImageSubmitHandler());
                };

                diaButtons[gettext('Cancel')] = function () {
                    jQuery(this).dialog('close');
                    resolve((0, _common.cancelPromise)());
                };
            });

            var that = this;
            jQuery("#uploadimage").dialog({
                resizable: false,
                height: 'auto',
                width: 'auto',
                modal: true,
                buttons: diaButtons,
                create: function create() {
                    var theDialog = jQuery(this).closest(".ui-dialog");
                    theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark");
                    theDialog.find(".ui-button:last").addClass("fw-button fw-orange");
                    that.setMediaUploadEvents(jQuery('#uploadimage'));
                },
                close: function close() {
                    return jQuery("#uploadimage").dialog('destroy').remove();
                }

            });

            jQuery('.fw-checkable-label').bind('click', function () {
                (0, _common.setCheckableLabel)(jQuery(this));
            });
            return returnPromise;
        }

        //add image upload events

    }, {
        key: "setMediaUploadEvents",
        value: function setMediaUploadEvents(wrapper) {
            var selectButton = wrapper.find('.fw-media-select-button'),
                mediaInput = wrapper.find('.fw-media-file-input'),
                mediaPreviewer = wrapper.find('.figure-preview > div');

            selectButton.bind('click', function () {
                return mediaInput.trigger('click');
            });

            mediaInput.bind('change', function () {
                var file = jQuery(this).prop('files')[0],
                    fr = new window.FileReader();

                fr.onload = function () {
                    mediaPreviewer.html('<img src="' + fr.result + '" />');
                };
                fr.readAsDataURL(file);
            });
        }
    }, {
        key: "onCreateImageSubmitHandler",
        value: function onCreateImageSubmitHandler() {
            //when submitted, the values in form elements will be restored
            var formValues = new window.FormData(),
                checkboxValues = {};

            formValues.append('id', this.imageId);

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
            return this.createImage(formValues);
        }
    }, {
        key: "createImage",
        value: function createImage(imageData) {
            var _this2 = this;

            return new Promise(function (resolve) {
                _this2.imageDB.createImage(imageData).then(function (imageId) {
                    jQuery("#uploadimage").dialog('close');
                    _this2.imageId = imageId;
                    resolve(imageId);
                });
            });
        }
    }]);

    return ImageUploadDialog;
}();

},{"../../common":1,"./templates":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* A template for the form for the image upload dialog. */
var usermediaUploadTemplate = exports.usermediaUploadTemplate = _.template('<div id="uploadimage" class="fw-media-uploader" title="<%- action %>">\
    <form action="#" method="post" class="usermediaUploadForm">\
        <div>\
            <input name="title" class="fw-media-title fw-media-form" type="text" placeholder="' + gettext('Insert a title') + '" value="<%- title %>" />\
            <button type="button" class="fw-media-select-button fw-button fw-light">' + gettext('Select a file') + '</button>\
            <input name="image" type="file" class="fw-media-file-input fw-media-form">\
        </div>\
        <div class="figure-preview"><div>\
            <% if(image) { %><img src="<%- image %>" /><% } %>\
        </div></div>\
        <%= categories %>\
    </form></div>');

/* A template for the image category selection of the image selection dialog. */
var usermediaUploadCategoryTemplate = exports.usermediaUploadCategoryTemplate = _.template('<% if(0 < categories.length) { %>\
        <div class="fw-media-category">\
            <div><%- fieldTitle %></div>\
            <% _.each(categories, function(cat) { %>\
                <label class="fw-checkable fw-checkable-label<%- cat.checked %>" for="imageCat<%- cat.id %>">\
                    <%- cat.category_title %>\
                </label>\
                <input class="fw-checkable-input fw-media-form entry-cat" type="checkbox"\
                    id="imageCat<%- cat.id %>" name="imageCat" value="<%- cat.id %>"<%- cat.checked %>>\
            <% }); %>\
        </div>\
    <% } %>');

},{}],8:[function(require,module,exports){
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

},{"../common":1}],9:[function(require,module,exports){
"use strict";

var _overview = require("./es6_modules/images/overview");

var theImageOverview = new _overview.ImageOverview();

window.theImageOverview = theImageOverview;

},{"./es6_modules/images/overview":4}]},{},[9]);
