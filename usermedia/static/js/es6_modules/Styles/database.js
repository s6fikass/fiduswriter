import {activateWait, deactivateWait, addAlert, csrfToken} from "../common/common"


/* A class that holds information about styles uploaded by the user. */

export class StyleDB {
    constructor(userId) {
        this.userId = userId
        this.db = {}

    }
    getDB(documentStyleMenu) {
        let that = this
        this.db = {}

        activateWait()

        jQuery.ajax({
            url: '/usermedia/styles/',
            data: {
                'owner_id': this.userId
            },
            type: 'POST',
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken)
            },
            success: function (response, textStatus, jqXHR) {
                let pks = []
                for (let i = 0; i < response.styles.length; i++) {
                    response.styles[i].style = (response.styles[i].style.split('/')[3]).split(".")[0]
                    if(response.styles[i].title == ""){
                        response.styles[i].title="Untitled"
                    }
                    let newMenuItem = document.createElement("li")
                    newMenuItem.innerHTML = "<span class='fw-pulldown-item style' data-style='" +
                            response.styles[i].style + "' title='" +
                            response.styles[i].title + "'>" +
                            response.styles[i].title + "</span>"
                    documentStyleMenu.appendChild(newMenuItem)
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                addAlert('error', jqXHR.responseText)
            },
            complete: function () {
                deactivateWait()
            }
        })

    }

    createStyle(postData, callback) {
        let that = this
        activateWait()
        // Remove old warning messages
        jQuery('#uploadstyle .warning').detach()
        // Send to server
        jQuery.ajax({
            url: '/usermedia/save_css/',
            data: postData,
            type: 'POST',
            dataType: 'json',
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken)
            },
            success: function (response, textStatus, jqXHR) {
                if (that.displayCreateStyleError(response.errormsg)) {
                    that.db[response.values.pk] = response.values
                    addAlert('success', gettext('The style has been uploaded'))
                    callback(response.values.pk)
                    response.values.style = ((response.values.style.split('/')[3]).split(".")[0]).split("_")[0]
                    if(response.values.title == ""){
                        response.values.title="Untitled"
                    }
                    let newMenuItem = document.createElement("li")
                    newMenuItem.innerHTML = "<span class='fw-pulldown-item style' data-style='" +
                            response.values.style + "' title='" +
                            response.values.title + "'>" +
                            response.values.title + "</span>"
                    let documentStyleMenu = document.getElementById("documentstyle-list")
                    documentStyleMenu.appendChild(newMenuItem)
                } else {
                    addAlert('error', gettext(
                        'Some errors are found. Please examine the form.'
                    ))
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.errormsg) {
                    addAlert('error', jqXHR.responseJSON.errormsg)
                }
            },
            complete: function () {
                deactivateWait()
            },
            cache: false,
            contentType: false,
            processData: false
        })
    }

    displayCreateStyleError(errors) {
        let noError = true
        for (let eKey in errors) {
            let eMsg = '<div class="warning">' + errors[eKey] + '</div>'
            if ('error' == eKey) {
                jQuery('#uploadstyle').prepend(eMsg)
            } else {
                jQuery('#id_' + eKey).after(eMsg)
            }
            noError = false
        }
        return noError
    }

}
