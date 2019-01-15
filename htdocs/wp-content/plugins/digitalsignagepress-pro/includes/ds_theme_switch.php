<?php
defined( 'ABSPATH' ) or die();
add_filter( 'pre_option_stylesheet', 'DS_theme_hook_style' );
add_filter( 'pre_option_template', 'DS_theme_hook_templ' );
function DS_theme_hook_style() {
	return DS_theme_hook('stylesheet');
}
function DS_theme_hook_templ() {
	return DS_theme_hook('template');
}
function DS_theme_hook($option) {
	global $ds_theme_switcher;
	if (!isset($ds_theme_switcher)) {
		$ds_theme_switcher = array();
	}
	if (isset($ds_theme_switcher[$option])) {
		return $ds_theme_switcher[$option];
	}
	if((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443){
		$protocol = "https://";
	} else{
		$protocol = "http://";
	}
	global $wp_rewrite;
	if ($wp_rewrite) {
		$ID = url_to_postid($protocol.$_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
	} else {
		$ID = DS_url_to_postid($protocol.$_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
	}
	if ($ID == 0) {
		$ID = DS_url_to_postid2($protocol.$_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
	}
	if ($ID == 0 && !is_admin()) {
		$ID = get_option('page_on_front');
	}
	if ($ID > 0) {
		global $wpdb;
		$row = $wpdb->get_row('SELECT * FROM '.$wpdb->prefix.'posts WHERE ID = '.$ID, ARRAY_A);
		if (isset($row)) {
			if (strpos($row['post_content'], '[digitalsignage]') > -1) {
				$theme = DS_BLANK_THEME;
			}
		}
	}
	if ( empty ($theme) ) {
		$all_options = wp_load_alloptions();
		$ds_theme_switcher['template'] = $all_options['template'];
		$ds_theme_switcher['stylesheet'] = $all_options['template'];
		return $ds_theme_switcher[$option];
	}
	$themes = wp_get_themes( array( 'allowed' => null ) );
	if ( isset ( $themes[ $theme ] ) ) {
		$ds_theme_switcher['template'] = $themes[ $theme ]->template;
		$ds_theme_switcher['stylesheet'] = $themes[ $theme ]->stylesheet;
		return $ds_theme_switcher[$option];
	} else {
		$theme = str_replace('Plugin', '', $theme);
		if ( isset ( $themes[ $theme ] ) ) {
			$ds_theme_switcher['template'] = $themes[ $theme ]->template;
			$ds_theme_switcher['stylesheet'] = $themes[ $theme ]->stylesheet;
			return $ds_theme_switcher[$option];
		}
	}
	$all_options = wp_load_alloptions();
	$ds_theme_switcher['template'] = $all_options['template'];
	$ds_theme_switcher['stylesheet'] = $all_options['template'];
	return $ds_theme_switcher[$option];
}

//copied from wp-includes/rewrite.php because some plugins causes pre_option_template to trigger too early, so $wp_rewrite is still null...
function DS_url_to_postid($url) {

        /**
         * Filters the URL to derive the post ID from.
         *
         * @since 2.2.0
         *
         * @param string $url The URL to derive the post ID from.
         */
        $url = apply_filters( 'url_to_postid', $url );
        if (preg_match('#[?&](p|page_id|attachment_id)=(\d+)#', $url, $values)) {
                $id = absint($values[2]);
                if ($id) return $id;
        }

        // Get rid of the #anchor
        $url_split = explode('#', $url);
        $url = $url_split[0];
        // Get rid of URL ?query=string
        $url_split = explode('?', $url);
        $url = $url_split[0];

        // Set the correct URL scheme.
        $scheme = parse_url( home_url(), PHP_URL_SCHEME );
        $url = set_url_scheme( $url, $scheme );

        // Add 'www.' if it is absent and should be there
        if ( false !== strpos(home_url(), '://www.') && false === strpos($url, '://www.') )
                $url = str_replace('://', '://www.', $url);

        // Strip 'www.' if it is present and shouldn't be
        if ( false === strpos(home_url(), '://www.') )
                $url = str_replace('://www.', '://', $url);

        if ( trim( $url, '/' ) === home_url() && 'page' == get_option( 'show_on_front' ) ) {
                $page_on_front = get_option( 'page_on_front' );

                if ( $page_on_front && get_post( $page_on_front ) instanceof WP_Post ) {
                        return (int) $page_on_front;
                }
        }

        // Check to see if we are using rewrite rules
        global $wp_rewrite;
	if ($wp_rewrite) {
        	$rewrite = $wp_rewrite->wp_rewrite_rules();
	}

        // Not using rewrite rules, and 'p=N' and 'page_id=N' methods failed, so we're out of options
        if ( empty($rewrite) )
                return 0;
        // Strip 'index.php/' if we're not using path info permalinks
        if ( !$wp_rewrite->using_index_permalinks() )
                $url = str_replace( $wp_rewrite->index . '/', '', $url );

        if ( false !== strpos( trailingslashit( $url ), home_url( '/' ) ) ) {
                // Chop off http://domain.com/[path]
                $url = str_replace(home_url(), '', $url);
        } else {
                // Chop off /path/to/blog
                $home_path = parse_url( home_url( '/' ) );
                $home_path = isset( $home_path['path'] ) ? $home_path['path'] : '' ;
                $url = preg_replace( sprintf( '#^%s#', preg_quote( $home_path ) ), '', trailingslashit( $url ) );
        }

        // Trim leading and lagging slashes
        $url = trim($url, '/');

        $request = $url;
        $post_type_query_vars = array();

        foreach ( get_post_types( array() , 'objects' ) as $post_type => $t ) {
                if ( ! empty( $t->query_var ) )
                        $post_type_query_vars[ $t->query_var ] = $post_type;
        }

        // Look for matches.
        $request_match = $request;
        foreach ( (array)$rewrite as $match => $query) {

                // If the requesting file is the anchor of the match, prepend it
                // to the path info.
                if ( !empty($url) && ($url != $request) && (strpos($match, $url) === 0) )
                        $request_match = $url . '/' . $request;

                if ( preg_match("#^$match#", $request_match, $matches) ) {

                        if ( $wp_rewrite->use_verbose_page_rules && preg_match( '/pagename=\$matches\[([0-9]+)\]/', $query, $varmatch ) ) {
                                // This is a verbose page match, let's check to be sure about it.
                                $page = get_page_by_path( $matches[ $varmatch[1] ] );
                                if ( ! $page ) {
                                        continue;
                                }

                                $post_status_obj = get_post_status_object( $page->post_status );
                                if ( ! $post_status_obj->public && ! $post_status_obj->protected
                                        && ! $post_status_obj->private && $post_status_obj->exclude_from_search ) {
                                        continue;
                                }
                        }

                        // Got a match.
                        // Trim the query of everything up to the '?'.
                        $query = preg_replace("!^.+\?!", '', $query);

                        // Substitute the substring matches into the query.
                        $query = addslashes(WP_MatchesMapRegex::apply($query, $matches));

                        // Filter out non-public query vars
                        global $wp;
                        parse_str( $query, $query_vars );
                        $query = array();
                        foreach ( (array) $query_vars as $key => $value ) {
                                if ( in_array( $key, $wp->public_query_vars ) ){
                                        $query[$key] = $value;
                                        if ( isset( $post_type_query_vars[$key] ) ) {
                                                $query['post_type'] = $post_type_query_vars[$key];
                                                $query['name'] = $value;
                                        }
                                }
                        }

                        // Resolve conflicts between posts with numeric slugs and date archive queries.
                        $query = wp_resolve_numeric_slug_conflicts( $query );

                        // Do the query
                        $query = new WP_Query( $query );
                        if ( ! empty( $query->posts ) && $query->is_singular )
                                return $query->post->ID;
                        else
                                return 0;
                }
        }
        return 0;
}
function DS_url_to_postid2($url) {
	global $wpdb;
	if ($wpdb) {
		$main_url = $url;
		$n = strpos($url, '?');
		if ($n !== false && $n > -1) {
			$main_url = substr($url, 0, $n);
		}
		if (substr($main_url, -1) == '/') {
			$main_url = substr($main_url, 0, strlen($main_url) - 1);
		}
		$pre_url = $main_url;
		$post_parts = explode('/', $pre_url);
		$post_name = end($post_parts);
		$result_page = $wpdb->get_row('select * from '.$wpdb->prefix.'posts where post_content like "%[digitalsignage]%" and (guid like "'.$main_url.'%" or post_name like "%'.$post_name.'%")');
		if ($result_page) {
			return $result_page->ID;
		}
	}
	return 0;
}
