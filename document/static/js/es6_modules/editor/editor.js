import * as objectHash from "object-hash/dist/object_hash"

/* Functions for ProseMirror integration.*/
import {ProseMirror} from "prosemirror/dist/edit/main"
import {collabEditing} from "prosemirror/dist/collab"
//import "prosemirror/dist/menu/menubar"
import {defaultDocumentStyle} from "../style/documentstyle-list"
import {defaultCitationStyle} from "../style/citation-definitions"
import {fidusSchema} from "./schema"
import {ModComments} from "./comments/mod"
import {ModFootnotes} from "./footnotes/mod"
import {ModCitations} from "./citations/mod"
import {ModCollab} from "./collab/mod"
import {ModTools} from "./tools/mod"
import {ModSettings} from "./settings/mod"
import {ModMenus} from "./menus/mod"
import {ModServerCommunications} from "./server-communications"
import {editorToModel, modelToEditor} from "./node-convert"
import {BibliographyDB} from "../bibliography/database"
import {ImageDB} from "../images/database"
import {Paste} from "./paste/paste"


export const COMMENT_ONLY_ROLES = ['edit', 'review', 'comment']

export class Editor {
    // A class that contains everything that happens on the editor page.
    // It is currently not possible to initialize more thna one editor class, as it
    // contains bindings to menu items, etc. that are uniquely defined.
    constructor(id) {
        this.mod = {}
        // Whether the editor is currently waiting for a document update. Set to true
        // initially so that diffs that arrive before document has been loaded are not
        // dealt with.
        this.waitingForDocument = true

        this.docInfo = {
            rights: '',
            last_diffs: [],
            is_owner: false,
            is_new: false,
            titleChanged: false,
            changed: false,
        }
        this.schema = fidusSchema
        this.doc = {
            // Initially we only have the id.
            id
        }
        this.user = false
        new ModServerCommunications(this)
    }

    init() {
        let that = this
        new ModSettings(this)
        jQuery(document).ready(function() {
            that.startEditor()
        })
    }

    startEditor() {
        let that = this
        this.makeEditor()
        this.currentPm = this.pm // The editor that is currently being edited in -- main or footnote editor
        new ModFootnotes(this)
        new ModCitations(this)
        new ModMenus(this)
        new ModCollab(this)
        new ModTools(this)
        new ModComments(this)
        this.pm.on.change.add(function(){that.docInfo.changed = true})
        this.pm.on.filterTransform.add((transform) => {return that.onFilterTransform(transform)})
        this.pm.on.transform.add((transform, options) => {that.onTransform(transform, true)})
        this.pm.on.transformPastedHTML.add((inHTML) => {
            let ph = new Paste(inHTML, "main")
            return ph.getOutput()
        })
        this.pm.mod.collab.receivedTransform.add((transform, options) => {that.onTransform(transform, false)})
        this.mod.serverCommunications.init()
        this.setSaveTimers()
    }

    setSaveTimers() {
        let that = this
        // Set Auto-save to send the document every two minutes, if it has changed.
        this.sendDocumentTimer = window.setInterval(function() {
            if (that.docInfo && that.docInfo.changed && that.docInfo.rights !== 'read') {
                that.save()
            }
        }, 120000)

        // Set Auto-save to send the title every 5 seconds, if it has changed.
        this.sendDocumentTitleTimer = window.setInterval(function() {
            if (that.docInfo && that.docInfo.titleChanged && that.docInfo.rights !== 'read') {
                that.docInfo.titleChanged = false
                that.mod.serverCommunications.send({
                    type: 'update_title',
                    title: that.doc.title
                })
            }
        }, 10000)
    }

    makeEditor() {
        let that = this
        this.pm = new ProseMirror({
            place: document.getElementById('document-editable'),
            schema: this.schema,
            plugins: [collabEditing.config({version: 0})]
        })
        // add mod to give us simple access to internals removed in PM 0.8.0
        this.pm.mod = {}
        this.pm.mod.collab = collabEditing.get(this.pm)
        // Ignore setDoc
        this.pm.on.beforeSetDoc.remove(this.pm.mod.collab.onSetDoc)
        this.pm.mod.collab.onSetDoc = function (){}
        // Trigger reset on setDoc
        this.pm.mod.collab.afterSetDoc = function (){
            // Reset all collab values and set document version
            let collab = that.pm.mod.collab
            collab.versionDoc = that.pm.doc
            collab.unconfirmedSteps = []
            collab.unconfirmedMaps = []
        }
        this.pm.on.setDoc.add(this.pm.mod.collab.afterSetDoc)
    }

    update() {
        console.log('Updating editor')
        let that = this
        this.mod.collab.docChanges.cancelCurrentlyCheckingVersion()
        this.mod.collab.docChanges.unconfirmedSteps = {}
        if (this.mod.collab.docChanges.awaitingDiffResponse) {
            this.mod.collab.docChanges.enableDiffSending()
        }
        let pmDoc = modelToEditor(this.doc, this.schema)
        //collabEditing.detach(this.pm)
        this.pm.setDoc(pmDoc)
        that.pm.mod.collab.version = this.doc.version
        //collabEditing.config({version: this.doc.version}).attach(this.pm)
        while (this.docInfo.last_diffs.length > 0) {
            let diff = this.docInfo.last_diffs.shift()
            this.mod.collab.docChanges.applyDiff(diff)
        }
        this.doc.hash = this.getHash()
        this.mod.comments.store.setVersion(this.doc.comment_version)
        this.pm.mod.collab.mustSend.add(function() {
            that.mod.collab.docChanges.sendToCollaborators()
        }, 0) // priority : 0 so that other things cna be scheduled before this.
        this.pm.mod.collab.receivedTransform.add((transform, options) => {that.onTransform(transform, false)})
        this.mod.footnotes.fnEditor.renderAllFootnotes()
        _.each(this.doc.comments, function(comment) {
            that.mod.comments.store.addLocalComment(comment.id, comment.user,
                comment.userName, comment.userAvatar, comment.date, comment.comment,
                comment.answers, comment['review:isMajor'])
        })
        this.mod.comments.store.on("mustSend", function() {
            that.mod.collab.docChanges.sendToCollaborators()
        })
        this.getBibDB(this.doc.owner.id, function(){
            that.enableUI()
        })
        this.waitingForDocument = false
    }

    askForDocument() {
        if (this.waitingForDocument) {
            return
        }
        this.waitingForDocument = true
        this.mod.serverCommunications.send({
            type: 'get_document'
        })
    }

    removeBibDB() {
        delete this.bibDB
        // TODO: Need to to remove all entries of citation dialog!
    }

    getBibDB(userId, callback) {
        let that = this
        if (!this.bibDB) { // Don't get the bibliography again if we already have it.
            let bibGetter = new BibliographyDB(userId, true, false, false)
            bibGetter.getBibDB(function(bibPks, bibCats){
                that.bibDB = bibGetter
                that.mod.menus.citation.appendManyToCitationDialog(bibPks)
                that.mod.citations.layoutCitations()
                that.mod.menus.header.enableExportMenu()
                if (callback) {
                    callback()
                }
            })
        } else {
            callback()
        }
    }

    removeImageDB() {
        delete this.imageDB
    }

    getImageDB(userId, callback) {
        let that = this
        if (!this.imageDB) {
            let imageGetter = new ImageDB(userId)
            imageGetter.getDB(function(){
                that.imageDB = imageGetter
                that.schema.cached.imageDB = imageGetter // assign image DB to be used in schema.
                that.mod.footnotes.schema.cached.imageDB = imageGetter // assign image DB to be used in footnote schema.
                callback()
            })
        } else {
            callback()
        }
    }

    enableUI() {

        jQuery('.savecopy, .saverevision, .download, .latex, .epub, .html, .print, .style, \
      .citationstyle, .tools-item, .papersize, .metadata-menu-item, \
      #open-close-header').removeClass('disabled')


        this.mod.settings.layout.displayDocumentstyle()
        this.mod.settings.layout.displayCitationstyle()

        jQuery('span[data-citationstyle=' + this.doc.settings.citationstyle +
            ']').addClass('selected')
        this.mod.settings.layout.displayPapersize()

        this.mod.settings.layout.layoutMetadata()


        if (this.docInfo.rights === 'read') {
            jQuery('#editor-navigation').hide()
            jQuery('.metadata-menu-item, #open-close-header, .save, \
          .multibuttonsCover, .papersize-menu, .metadata-menu, \
          .documentstyle-menu, .citationstyle-menu').addClass('disabled')
        } else {
            jQuery('#editor-navigation').show()
            jQuery('.metadata-menu-item, #open-close-header, .save, \
          .multibuttonsCover, .papersize-menu, .metadata-menu, \
          .documentstyle-menu, .citationstyle-menu').removeClass('disabled')
            if (this.docInfo.is_owner) {
                // bind the share dialog to the button if the user is the document owner
                jQuery('.share').removeClass('disabled')
            }
            if (COMMENT_ONLY_ROLES.indexOf(this.docInfo.rights) > -1) {
                let toolbar = jQuery('.editortoolbar')
                toolbar.find('.ui-buttonset').hide()
                toolbar.find('.comment-only').show()
            }
            else {
                jQuery('.metadata-menu-item, #open-close-header, .save, \
              .multibuttonsCover, .papersize-menu, .metadata-menu, \
              .documentstyle-menu, .citationstyle-menu').removeClass('disabled')
            }
        }
    }

    receiveDocument(data) {
        let that = this
        this.receiveDocumentValues(data.document, data.document_values)
        if (data.hasOwnProperty('user')) {
            this.user = data.user
        } else {
            this.user = this.doc.owner
        }
        this.getImageDB(this.doc.owner.id, function(){
            that.update()
            that.mod.serverCommunications.send({
                type: 'participant_update'
            })
        })
    }

    receiveDocumentValues(dataDoc, dataDocInfo) {
        let that = this
        this.doc = dataDoc
        this.docInfo = dataDocInfo
        this.docInfo.changed = false
        this.docInfo.titleChanged = false

        let defaultSettings = [
            ['papersize', 1117],
            ['citationstyle', defaultCitationStyle],
            ['documentstyle', defaultDocumentStyle]
        ]


        defaultSettings.forEach(function(variable) {
            if (that.doc.settings[variable[0]] === undefined) {
                that.doc.settings[variable[0]] = variable[1]
            }
        })


        if (this.docInfo.is_new) {
            // If the document is new, change the url. Then forget that the document is new.
            window.history.replaceState("", "", "/document/" + this.doc.id +
                "/");
            delete this.docInfo.is_new
        }
    }

    updateComments(comments, comment_version) {
        console.log('receiving comment update')
        this.mod.comments.store.receive(comments, comment_version)
    }

    // Creates a hash value for the entire document so that we can compare with other clients if
    // we really have the same contents
    getHash() {
        let doc = this.pm.mod.collab.versionDoc.copy()
        // We need to convert the footnotes from HTML to PM nodes and from that
        // to JavaScript objects, to ensure that the attribute order of everything
        // within the footnote will be the same in all browsers, so that the
        // resulting checksums are the same.
        doc.descendants(function(node){
            if (node.type.name==='footnote') {
                node.attr.contents = this.mod.footnotes.fnEditor.htmlTofootnoteNode(node.attr.contents)
            }
        })
        return objectHash.MD5(JSON.parse(JSON.stringify(doc.toJSON())), {unorderedArrays: true})
    }

    // Get updates to document and then send updates to the server
    save(callback) {
        let that = this
        this.getUpdates(function() {
            that.sendDocumentUpdate(function(){
                if (callback) {
                    callback()
                }
            })
        })
    }

    // Collects updates of the document from ProseMirror and saves it under this.doc
    getUpdates(callback) {
        let tmpDoc = editorToModel(this.pm.mod.collab.versionDoc)
        this.doc.contents = tmpDoc.contents
        this.doc.metadata = tmpDoc.metadata
        this.doc.title = this.pm.mod.collab.versionDoc.firstChild.textContent
        this.doc.version = this.pm.mod.collab.version
        this.doc.hash = this.getHash()
        this.doc.comments = this.mod.comments.store.comments
        if (callback) {
            callback()
        }
    }

    // Send changes to the document to the server
    sendDocumentUpdate(callback) {
        let documentData = {
            title: this.doc.title,
            metadata: this.doc.metadata,
            contents: this.doc.contents,
            version: this.doc.version,
            hash: this.doc.hash
        }

        this.mod.serverCommunications.send({
            type: 'update_document',
            document: documentData
        })

        this.docInfo.changed = false

        if (callback) {
            callback()
        }
        return true
    }

    // filter transformations.
    onFilterTransform(transform) {
        let prohibited = false

        if (this.docInfo.rights === 'read') {
            // User only has read access. Don't allow anything.
            prohibited = true
        } else if (COMMENT_ONLY_ROLES.indexOf(this.docInfo.rights) > -1) {
            //User has a comment-only role (commentator, editor or reviewer)

            //Check all transformation steps. If step type not allowed = prohibit
            if (!transform.steps.every(function(step) {
                //check if in allowed array. if false - exit loop
                return (step.jsonID === 'addMark' || step.jsonID === 'removeMark') && step.mark.type.name === 'comment'
            })) {
                prohibited = true
            }
        }

        return prohibited
    }

    // Things to be executed on every editor transform.
    onTransform(transform, local) {
        let updateBibliography = false, updateTitle = false, commentIds = [], that = this
            // Check what area is affected

        transform.steps.forEach(function(step, index) {
            if (step.jsonID === 'replace' || step.jsonID === 'replaceAround') {
                if (step.from !== step.to) {
                    transform.docs[index].nodesBetween(step.from, step.to, function(node, pos, parent) {
                        if (node.type.name === 'citation') {
                            // A citation was replaced
                            updateBibliography = true
                        }
                        if (local) {
                            let commentId = that.mod.comments.layout.findCommentId(node)
                            if (commentId !== false && commentIds.indexOf(commentId)===-1) {
                                commentIds.push(commentId)
                            }
                        }

                    })
                }
                let docPart = that.pm.doc.resolve(step.from).node(1)
                if (docPart && docPart.type.name === 'title') {
                    updateTitle = true
                }
            }
        })

        if (updateBibliography) {
            // Recreate the bibliography on next flush.
            this.pm.scheduleDOMUpdate(() => {return that.mod.citations.resetCitations()})
        }

        if (updateTitle) {
            let documentTitle = this.pm.doc.firstChild.textContent
            // The title has changed. We will update our document. Mark it as changed so
            // that an update may be sent to the server.
            if (documentTitle.substring(0, 255) !== this.doc.title) {
                this.doc.title = documentTitle.substring(0, 255)
                if (local) {
                    this.docInfo.titleChanged = true
                }
            }
        }
        if (local && commentIds.length > 0) {
            // Check if the deleted comment referrers still are somewhere else in the doc.
            // If not, delete them.
            // TODO: Is a timeout/scheduleDOMUpdate really needed here?
            this.pm.scheduleDOMUpdate(() => {return that.mod.comments.store.checkAndDelete(commentIds)})
        }

    }

}
