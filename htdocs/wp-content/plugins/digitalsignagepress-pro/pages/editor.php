        <div id="editor-content">
            <table id="table-menu-dev" style="display:none">
                <thead>
                    <tr>
                        <th>
                            HIDDEN
                        </th>
                        <td class="toolbar-cell">
                            <div id="hidden-div-1" style="height: 16px; background-color: red;"></div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>
                            FILE
                        </th>
                        <td class="toolbar-cell">
                            <div id="toolbar-dev-file" >
                                <button id="btn-workbench-empty-dev">New</button>
                                <button id="btn-import-html-dev">Load</button>
                                <input type="text" name="fname" id="input-load-array-index" style="width: 50px">
                                <button id="btn-export-html-dev">Save</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            EDITOR
                        </th>
                        <td class="toolbar-cell">
                            <div id="toolbar-dev-editor">
                                <input id="btn-editor-toggle-grid-dev" type="checkbox">
                                <label for="btn-editor-toggle-grid-dev">Grid</label>
                                <input id="btn-editor-toggle-magnet-dev" type="checkbox" checked>
                                <label for="btn-editor-toggle-magnet-dev">Magnet</label>
                                <input id="btn-editor-select-background-dev" type="checkbox">
                                <label for="btn-editor-select-background-dev">Select BG</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            CONTAINER
                        </th>
                        <td class="toolbar-cell">
                            <div id="toolbar-dev-container">
                                <div id="selection-container-new-dev">
                                        <input type="radio" id="new-container-dummy" name="radio-container"><label for="new-container-dummy">New Dummy</label>
                                        <input type="radio" id="new-container-text" name="radio-container"><label for="new-container-text">New Text</label>
                                        <input type="radio" id="new-container-img" name="radio-container"><label for="new-container-img">New Image</label>
                                </div>
                                <button id="btn-container-remove-dev">Remove Container</button>
                                <button id="btn-container-clear-dev">Clear Container</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            TEXT
                        </th>
                        <td class="toolbar-cell">
                            <div id="toolbar-dev-text">
								<button id="btn-text-1-dev" class="ds-debug-button">...</button>
								<button id="btn-text-2-dev" class="ds-debug-button">...</button>
								<button id="btn-text-3-dev" class="ds-debug-button">...</button>
								<button id="btn-text-4-dev" class="ds-debug-button">...</button>
								<button id="btn-text-5-dev" class="ds-debug-button">...</button>
								<button id="btn-text-6-dev" class="ds-debug-button">...</button>
								<button id="btn-text-7-dev" class="ds-debug-button">...</button>
								<button id="btn-text-8-dev" class="ds-debug-button">...</button>
								<button id="btn-text-9-dev" class="ds-debug-button">...</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            DEBUG
                        </th>
                        <td class="toolbar-cell">
                            <div id="toolbar-dev-debug">
                                <button id="btn-debug-1-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-2-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-3-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-4-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-5-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-6-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-7-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-8-dev" class="ds-debug-button">...</button>
                                <button id="btn-debug-9-dev" class="ds-debug-button">...</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table id="table-menu-main">
                <tbody>
                    <tr>
                        <td class="toolbar-cell">
                            <div id="toolbar-main-format" style="display:none">
                                <button id="btn-format-landscape-original">Landscape</button>
                                <button id="btn-format-portrait-original">Portrait</button>
                                <span>| Aspect Ratio: </span>
                                <input id="input-aspect-ratio" type="text" style="width: 100px" value="1.77777777">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="toolbar-cell">
                            <div id="toolbar-main-main">
                                <div class="ds-editor-element-header1">
                                    <div>
                                        <div class="ds-editor-label"><?php _e('Background of Slide','digitalsignagepress'); ?></div>
                                    </div>
                                    <div class="ds-editor-button-group">
                                        <input id="btn-container-colorpicker-bg-original" class="ds-editor-colorpicker" type="checkbox" title="<?php _e('Background Color','digitalsignagepress'); ?>">
                                        <button id="btn-container-set-img-bg-original" class="ds-editor-button-img button-container-image" title="<?php _e('Background Image','digitalsignagepress'); ?>"></button>
                                        <button id="btn-delete-bg-image" title="<?php _e('Delete','digitalsignagepress'); ?>" class="ds-editor-button-img button-container-delete"></button>
                                    </div>
                                </div>
                                <div class="ds-editor-element-header2">
                                    <div>
                                        <div class="ds-editor-label"><?php _e('Media for Element','digitalsignagepress'); ?></div>
                                    </div>
                                    <div>
                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Image','digitalsignagepress'); ?>">
                                            <button id="btn-container-set-img-original" class="ds-editor-button-img ds-editor-button-media button-container-image"></button>
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Text','digitalsignagepress'); ?>">
                                            <button id="btn-container-set-text-original" class="ds-editor-button-img ds-editor-button-media button-container-text"></button>
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Color','digitalsignagepress'); ?>">
                                            <input id="btn-container-colorpicker-container-original" class="ds-editor-colorpicker" type="checkbox">
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Website','digitalsignagepress'); ?>">
                                            <button id="btn-container-new-web-original" class="ds-editor-button-img ds-editor-button-media button-container-web"></button>
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Video','digitalsignagepress'); ?>">
                                            <button id="btn-container-new-vid-original" class="ds-editor-button-img ds-editor-button-media button-container-vid"></button>
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Html','digitalsignagepress'); ?>">
                                            <button id="btn-container-new-html-original" class="ds-editor-button-img ds-editor-button-media button-container-html"></button>
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Menucard','digitalsignagepress'); ?>">
                                            <button id="btn-container-set-menu-original" class="ds-editor-button-img ds-editor-button-media button-container-menu"></button>
                                        </div>

                                        <div class="ds-editor-button-group ds-editor-element-left" title="<?php _e('Slideshow','digitalsignagepress'); ?>">
                                            <button id="btn-container-set-slideshow-original" class="ds-editor-button-img ds-editor-button-media button-container-slideshow"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="ds-editor-element-header3">
                                    <div>
                                        <div class="ds-editor-label" style="visibility:hidden;">OTHER</div>
                                    </div>
                                    <div class="ds-editor-button-group">
                                        <select id="selection-container-create-new-original" class="ds-editor-selectmenu">
                                            <option id="add-selector-0" class="ds-option" value="empty" selected="selected"><?php _e('ADD','digitalsignagepress'); ?></option>
                                            <option id="add-selector-1" class="ds-option" title="<?php _e('Image','digitalsignagepress'); ?>" value="img"><?php _e('Image','digitalsignagepress'); ?></option>
                                            <option id="add-selector-2" class="ds-option" title="<?php _e('Text','digitalsignagepress'); ?>" value="text"><?php _e('Text','digitalsignagepress'); ?></option>

                                            <option id="add-selector-3" class="ds-option" title="<?php _e('Website','digitalsignagepress'); ?>" value="web"><?php _e('Website','digitalsignagepress'); ?></option>
                                            <option id="add-selector-4" class="ds-option" title="<?php _e('Video','digitalsignagepress'); ?>" value="vid"><?php _e('Video','digitalsignagepress'); ?></option>
                                            <option id="add-selector-5" class="ds-option" title="Html" value="html">Html</option>
                                            <option id="add-selector-6" class="ds-option" title="<?php _e('Menucard','digitalsignagepress'); ?>" value="menu"><?php _e('Menucard','digitalsignagepress'); ?></option>
                                            <option id="add-selector-7" class="ds-option" title="<?php _e('Slideshow','digitalsignagepress'); ?>" value="slideshow"><?php _e('Slideshow','digitalsignagepress'); ?></option>
                                        </select>
                                        <button id="btn-container-duplicate-original" title="<?php _e('Duplicate','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-media button-container-duplicate"></button>
                                        <button id="btn-container-padding-original" title="<?php _e('Padding','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-media button-container-padding"></button>
										<button id="btn-container-freemove-original" title="<?php _e('Border','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-media button-container-freemove"></button>
                                        <button id="btn-container-delete-original" title="<?php _e('Delete','digitalsignagepress'); ?>" class="ds-editor-button-img button-container-delete"></button>
                                    </div>
                                </div>
                                <div class="ds-editor-element-header4">
                                    <div>
                                        <div class="ds-editor-label"><?php _e('Text','digitalsignagepress'); ?></div>
                                    </div>
                                    <div class="ds-editor-button-group button-group-text">
                                        <select id="selection-text-font-family-original" class="ds-editor-selectmenu ds-editor-button-topic-text">
                                            <option value="empty" selected="selected"><?php _e('Font','digitalsignagepress'); ?></option>
                                            <optgroup label="Sans-Serif">
                                                <option value="Open Sans">Open Sans</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Lato">Lato</option>
                                                <option value="Oswald">Oswald</option>
                                                <option value="Roboto Condensed">Roboto Condensed</option>
                                                <option value="Montserrat">Montserrat</option>
                                                <option value="Source Sans Pro">Source Sans Pro</option>
                                                <option value="Raleway">Raleway</option>
                                                <option value="PT Sans">PT Sans</option>
                                                <option value="Droid Sans">Droid Sans</option>
                                                <option value="Ubuntu">Ubuntu</option>
                                            </optgroup>
                                            <optgroup label="Serif">
                                                <option value="Times New Roman">Times New Roman</option>
                                                <option value="Slabo 27px">Slabo 27px</option>
                                                <option value="Lora">Lora</option>
                                            </optgroup>
                                            <optgroup label="Cursive">
                                                <option value="Poiret One">Poiret One</option>
                                                <option value="Indie Flower">Indie Flower</option>
                                            </optgroup>
                                        </select>
                                        <select id="selection-text-font-size-original" class="ds-editor-selectmenu ds-editor-button-topic-text">
                                            <option value="empty" selected="selected"><?php _e('Size','digitalsignagepress'); ?></option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                        <select id="selection-text-insert-html-original" class="ds-editor-selectmenu ds-editor-button-topic-text">
                                            <option value="empty" selected="selected"><?php _e('Tags','digitalsignagepress'); ?></option>
                                            <optgroup label="Headings">
                                                <option value="h1">H1</option>
                                                <option value="h2">H2</option>
                                                <option value="h3">H3</option>
                                            </optgroup>
                                            <optgroup label="Others">
                                                <option value="span"><?php _e('Span','digitalsignagepress'); ?></option>
                                            </optgroup>
                                        </select>
                                        <input id="btn-text-font-forecolor-original" class="ds-editor-colorpicker" type="checkbox">
                                        <button id="btn-text-style-bold-original" title="<?php _e('Bold','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-style-bold"></button>
                                        <button id="btn-text-style-italic-original" title="<?php _e('Italic','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-style-italic"></button>
                                        <button id="btn-text-style-underline-original" title="<?php _e('Underline','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-style-underline"></button>

                                        <button id="btn-text-orientation-left-original" title="<?php _e('Align Left','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-align-left"></button>
                                        <button id="btn-text-orientation-center-original" title="<?php _e('Align Center','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-align-center"></button>
                                        <button id="btn-text-orientation-right-original" title="<?php _e('Align Right','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-align-right"></button>
                                        <button id="btn-text-orientation-full-original" title="<?php _e('Align Full','digitalsignagepress'); ?>" class="ds-editor-button-img ds-editor-button-topic-text button-align-full"></button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div id="workbench-content">
                <div id="workbench-area">
                    <div id="myDSX" class="ds-custom-template">
                        <div id="myDSXE0">
                            <div class="ds-content" style="width:100%; height:100%; position: absolute; background-color: #fff;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <form id="save_myDS_form" name="save_myDS_form"  method="post" action="<?php echo get_admin_url().'admin-post.php'; ?>">
                <input type="hidden" name="action" value="mydssaveaction">
                <input type="button" name="Save" id="Save" value="save" onclick="javascript: jQuery.fn.triggerFullFormUpdate; checkPage(); document.save_myDS_form.submit();">
                <input type="hidden" id="save_nrOfScreens" name="save_nrOfScreens" value="0">
            </form>
            <div id="include-div-1" style="display: none">
                <link rel="stylesheet" type="text/css" href="[PLUGIN-PATH]css/grid.css" media="all">
                <link rel="stylesheet" type="text/css" href="[PLUGIN-PATH]css/base-template.css" media="all">
            </div>
            <div id="include-div-2" style="display: none">
                <script type="text/javascript" src="[PLUGIN-PATH]js/functions.js"></script>
            </div>
        </div>
