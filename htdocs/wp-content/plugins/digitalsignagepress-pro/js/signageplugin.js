jQuery(document).ready(function($){
    var custom_uploader;
    $('#upload_image_button').click(function(e) {
        e.preventDefault();
        if (custom_uploader) {
            custom_uploader.open();
            return;
        }
        if (typeof(wp) === "undefined"){
            alert(ds_translation.stringWordpressFreeEnvironmentError+" (wp undefined)");
            return;
        }
        custom_uploader = wp.media.frames.file_frame = wp.media({
            title: ds_translation.stringChooseImage,
            button: {
                text: ds_translation.stringChooseImage
            },
            multiple: false
        });
        custom_uploader.on('select', function() {
            attachment = custom_uploader.state().get('selection').first().toJSON();
            $('#upload_image').val(attachment.url);
            $('#hidden-text-div').text(attachment.url);
        });
        custom_uploader.open();
    });
});

