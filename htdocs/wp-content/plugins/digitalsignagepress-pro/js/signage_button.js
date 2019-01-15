(function() {
    tinymce.create('tinymce.plugins.Signage', {
        init : function(ed, url) {
            ed.addButton('signage', {
                title : 'Digital Signage',
                cmd : 'signage',
                image : url + '/../img/signage_button.png'
            });
 
            ed.addCommand('signage', function() {
                var selected_text = ed.selection.getContent();
                var return_text = '';
                return_text = '[digitalsignage]' + selected_text;
                ed.execCommand('mceInsertContent', 0, return_text);
            });
        },
        createControl : function(n, cm) {
            return null;
        }
    });
    tinymce.PluginManager.add( 'signage', tinymce.plugins.Signage );
})();
