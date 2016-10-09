import {usermediaUploadTemplate} from "./templates"
import {setCheckableLabel,addAlert} from "../../common/common"

export class StyleUploadDialog {
    constructor(styleDB, styleId, ownerId, callback) {
        this.styleDB = styleDB
        this.styleId = styleId
        this.ownerId = ownerId
        this.callback = callback
        this.createStyleUploadDialog()
    }

    //open a dialog for uploading a Style
    createStyleUploadDialog() {
        let that = this
        let title, style, action, longAction
        if (this.styleId) {
            title = this.styleDB.db[this.styleId].title
            style = this.styleDB.db[this.styleId].style
            action = gettext('Update')
            longAction = gettext('Update style')
        } else {
            this.styleId = 0
            title = ''
            style = false
            action = gettext('Upload')
            longAction = gettext('Upload style')
        }


        jQuery('body').append(usermediaUploadTemplate({
            'action': longAction,
            'title': title,
            'style': style
        }))
        let diaButtons = {}
        diaButtons[action] = function () {

            if(jQuery("input[name='title']").val()==""){
            addAlert('error', gettext(
                        'Please insert a Title'
                    ))
            }else{
            that.onCreateStyleSubmitHandler()
            }


        }
        diaButtons[gettext('Cancel')] = function () {
            jQuery(this).dialog('close')
        }
        jQuery("#uploadstyle").dialog({
            resizable: false,
            height: 'auto',
            width: 'auto',
            modal: true,
            buttons: diaButtons,
            create: function () {
                let theDialog = jQuery(this).closest(".ui-dialog")
                theDialog.find(".ui-button:first-child").addClass("fw-button fw-dark")
                theDialog.find(".ui-button:last").addClass("fw-button fw-orange")
                that.setMediaUploadEvents(jQuery('#uploadstyle'))
            },
            close: function () {
                jQuery("#uploadstyle").dialog('destroy').remove()
            }
        })

        jQuery('.fw-checkable-label').bind('click', function () {
            setCheckableLabel(jQuery(this))
        })
    }

    //add style upload events
    setMediaUploadEvents(wrapper) {
        let selectButton = wrapper.find('.fw-media-select-button'),
            mediaInput = wrapper.find('.fw-media-file-input'),
            mediaPreviewer = wrapper.find('.figure-preview > div')

        selectButton.bind('click', function() {
            mediaInput.trigger('click')
        })

        mediaInput.bind('change', function() {
            let file = jQuery(this).prop('files')[0],
                fr = new window.FileReader()

            fr.onload = function() {
                mediaPreviewer.html('<p>' + file.name + ' </p>')
            }
            fr.readAsDataURL(file)
        })
    }

    onCreateStyleSubmitHandler() {
        //when submitted, the values in form elements will be restored
        let formValues = new window.FormData(),
            checkboxValues = {}

        formValues.append('id', this.styleId)

        if(this.ownerId) {
            formValues.append('owner_id', this.ownerId)
        }

        jQuery('.fw-media-form').each(function () {
            let $this = jQuery(this)
            let theName = $this.attr('name') || $this.attr('data-field-name')
            let theType = $this.attr('type') || $this.attr('data-type')
            let theValue = ''

            switch (theType) {
                case 'checkbox':
                    //if it is a checkbox, the value will be restored as an Array
                    if (undefined === checkboxValues[theName])
                        checkboxValues[theName] = []
                    if ($this.prop("checked")) {
                        checkboxValues[theName].push($this.val())
                    }
                    return
                case 'file':
                    theValue = $this.get(0).files[0]
                    break
                default:
                    theValue = $this.val()
                    
            }

            formValues.append(theName, theValue)
        })

        // Add the values for check boxes
        for (let key in checkboxValues) {
            formValues.append(key, checkboxValues[key].join(','))
        }
        this.createStyle(formValues)
    }

    createStyle(styleData) {
        let that = this
        this.styleDB.createStyle(styleData, function(styleId){
            jQuery("#uploadstyle").dialog('close')
            that.styleId = styleId
            that.callback(styleId)
        })
    }

}
