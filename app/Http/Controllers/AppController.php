<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;

class AppController extends Controller
{

  /**
   * White Label CSS for the app
   *
   * @return Response
   */
  public function appCSS(Request $request)
  {

    // get settings
    $primary_color = env('PRIMARY_COLOR');
    $primary_dark_color = env('PRIMARY_DARK_COLOR');

    // create css
    $css = <<<EOD
a, a:visited {
  color: $primary_color;
}

body .app-selector ul {
  background-color: $primary_color;
}

body .app-list-item small {
  color: $primary_color;
}


.app-drawer a, .app-overflow a {
  color: $primary_color;
}

body .app-modal a, body .app-modal a:visited {
  color: $primary_color
}


body .app-modal .actions button {
  color: $primary_color;
}

body .app-modal .app-modal-list-item small {
  color: $primary_color;
}

/* app-menu */
.app-menu {
  background-color: $primary_color;
}

/* save */
.app-menu .app-save, .app-menu .app-add, .app-menu .app-overflow {
  background-color: $primary_color;
}

/* menu */
.app-menu .app-more {
  background-color: $primary_color;
}

.app-menu .app-more:hover {
  background-color: $primary_color;
}

.app-menu a:hover {
  background-color: $primary_color;
}

.app-slideshow-container div.description a.primary {
  border: 1px solid $primary_color;
  color: $primary_color;
}

/* app large screen */
@media (min-width:768px) {

.app-drawer li, .app-drawer li.app-drawer-title, .app-drawer a {
  color: #fff;
}

.app-drawer {
  background-color: $primary_color;
}

.app-menu .app-add, .app-menu .app-overflow {
  color: $primary_color !important;
}

body .app-selector li a {
  color: $primary_color;
}

body .app-selector li.selected a {
  border-bottom: 3px solid $primary_color;
}

.app-menu {
  background-color: #fff;
}

body .app-selector ul {
  background-color: #fff;
}

.app-menu .app-add, .app-menu .app-overflow {
  background-color: #fff;
}

}

/* hashedit */
[hashedit-element]:hover {
  box-shadow: inset 0 0 0 1px $primary_color;
}

[hashedit-block]:hover {
  box-shadow: inset 0 0 0 1px $primary_color;
}

[hashedit-block] .hashedit-block-menu {
  background-color: $primary_color;
}

.hashedit-element-menu {
  background-color: $primary_color;
}

.hashedit-move:hover span,.hashedit-properties:hover span,.hashedit-remove:hover span {
  color: $primary_color;
}

body .hashedit-config a:hover,body .hashedit-config a:hover {
  background-color: $primary_color;
}

.hashedit-menu a:hover {
  background-color: $primary_color !important;
}

body .hashedit-modal a,body .hashedit-modal a:visited {
  color: $primary_color;
}

body .hashedit-config {
  background-color: $primary_dark_color;
}

.hashedit-menu {
  color: $primary_dark_color;
}

.hashedit-menu .hashedit-save,.hashedit-menu .hashedit-add {
  color: $primary_dark_color !important;
}

.hashedit-menu .hashedit-back {
  color: $primary_dark_color;
}

.hashedit-menu .hashedit-back:hover {
  background-color: $primary_dark_color;
}

.hashedit-menu a {
  color: $primary_dark_color;
}

EOD;
return response($css)->header('Content-Type', 'text/css');

  }

  /**
   * White Label CSS for the Editor
   *
   * @return Response
   */
  public function editorCSS(Request $request)
  {

    // get settings
    $primary_color = env('PRIMARY_COLOR');
    $primary_dark_color = env('PRIMARY_DARK_COLOR');

    // create css
    $css = <<<EOD

/* hashedit */
[hashedit-element]:hover {
  box-shadow: inset 0 0 0 1px $primary_color;
}

[hashedit-block]:hover {
  box-shadow: inset 0 0 0 1px $primary_color;
}

[hashedit-block] .hashedit-block-menu {
  background-color: $primary_color;
}

.hashedit-element-menu {
  background-color: $primary_color;
}

.hashedit-move:hover span,.hashedit-properties:hover span,.hashedit-remove:hover span {
  color: $primary_color;
}

body .hashedit-config a:hover,body .hashedit-config a:hover {
  background-color: $primary_color;
}

.hashedit-menu a:hover {
  background-color: $primary_color !important;
}

body .hashedit-modal a,body .hashedit-modal a:visited {
  color: $primary_color;
}

body .hashedit-config, body .hashedit-help {
  background-color: $primary_dark_color;
}

.hashedit-menu {
  color: $primary_dark_color;
}

.hashedit-menu .hashedit-save,.hashedit-menu .hashedit-add {
  color: $primary_dark_color !important;
}

.hashedit-menu .hashedit-back {
  color: $primary_dark_color;
}

.hashedit-menu .hashedit-back:hover {
  background-color: $primary_dark_color;
}

.hashedit-menu a {
  color: $primary_dark_color;
}

EOD;
return response($css)->header('Content-Type', 'text/css');

  }


  /**
   * Settings
   *
   * @return Response
   */
  public function settings(Request $request)
  {

    $has_passcode = true;

    if(env('PASSCODE') === '') {
      $has_passcode = false;
    }

    // return app settings
    $settings = array(
      'hasPasscode' => $has_passcode,
      'siteUrl' => Utilities::retrieveSiteURL(),
      'logoUrl' => env('LOGO_URL'),
      'themesLocation' => env('THEMES_LOCATION'),
      'primaryColor' => env('PRIMARY_COLOR'),
      'primaryDarkColor' => env('PRIMARY_DARK_COLOR'),
      'usesLDAP' => !empty(env('LDAP_SERVER'))
    );

    return response()->json($settings);

  }

  /**
   * Lists the themes available for the app
   *
   * @return Response
   */
  public function listThemes(Request $request)
  {

    // list pages in the site
    $dir = app()->basePath().'/public/'.env('THEMES_LOCATION');

    // list files
    $arr = Utilities::listSpecificFiles($dir, 'theme.json');

    $result = array();

    foreach ($arr as $item) {

      // get contents of file
      $json = json_decode(file_get_contents($item));

      // get location of theme
      $temp = explode(getenv('THEMES_LOCATION'), $item);
      $location = substr($temp[1], 0, strpos($temp[1], '/theme.json'));

      $json->location = $location;

      array_push($result, $json);

    }

    return response()->json($result);

  }

  /**
   * Lists the languages available for the app
   *
   * @return Response
   */
  public function listLanguages(Request $request)
  {

    // list pages in the site
    $file = app()->basePath().'/public/i18n/languages.json';

    $result = array();

    if(file_exists($file)) {

      $json = file_get_contents($file);
      $result = json_decode($json);

    }

    return response()->json($result);

  }


}
