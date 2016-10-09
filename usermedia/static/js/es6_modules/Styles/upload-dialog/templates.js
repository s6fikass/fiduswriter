/* A template for the form for the style upload dialog. */
export let usermediaUploadTemplate = _.template('<div id="uploadstyle" class="fw-media-uploader" title="<%- action %>">\
    <form action="#" method="post" class="usermediaUploadForm">\
        <div>\
            <input name="title" class="fw-media-title fw-media-form" type="text" placeholder="' + gettext('Insert a title') + '" value="<%- title %>" />\
            <button type="button" class="fw-media-select-button fw-button fw-light">' +
                gettext('Select a file') +
            '</button>\
            <input name="style" type="file" class="fw-media-file-input fw-media-form">\
        </div>\
        <div class="figure-preview"><div>\
        </div></div>\
    </form></div>')

