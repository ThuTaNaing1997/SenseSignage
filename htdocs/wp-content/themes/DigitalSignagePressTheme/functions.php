<?php
//Initialize the update checker.
require 'theme-updates/theme-update-checker.php';
$example_update_checker = new ThemeUpdateChecker(
	'DigitalSignagePressTheme',         //Theme folder name, AKA "slug". 
	'http://digitalsignagepress.com/dsp/wp-update-server/?action=get_metadata&slug=DigitalSignagePressTheme' //Metadata file
);
/**
 * Adds theme support for custom header, feed links, title tag, post formats, HTML5 and post thumbnails
 */
function ondamedia_add_theme_support() {
    add_theme_support( 'custom-header' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-formats', array(
        'aside',
        'link',
        'gallery',
        'status',
        'quote',
        'image',
        'video',
        'audio',
        'chat'
    ) );
    add_theme_support( 'html5', array(
        'comment-list',
        'comment-form',
        'search-form',
        'gallery',
        'caption',
    ) );
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'ondamedia_add_theme_support' );


/**
 * Displays the content with customized more link
 *
 * @return string Formatted output in HTML
 */
function ondamedia_the_content() {
    $text = _x( 'Continue reading “%s”', 's = post title', 'ondamedia' );
    $more = sprintf( $text, esc_html( get_the_title() ) );
    the_content( $more );
}

