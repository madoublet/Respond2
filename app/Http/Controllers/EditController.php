<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;

use App\Respond\Models\Form;
use App\Respond\Models\Component;
use App\Respond\Models\Gallery;
use App\Respond\Models\Setting;

// DOM parser
use KubAT\PhpSimple\HtmlDomParser;

class EditController extends Controller
{

    /**
     * Edits a page provided by the querystring, in format ?q=site-name/dir/page.html
     *
     * @return Response
     */
    public function edit(Request $request)
    {

        $q = $request->input('q');
        $m = $request->input('mode');

        if($q != NULL){

          $saveUrl = '/api/pages/save';
          $mode = 'page';
          $title = '';

          // set save URL
          if(isset($m)) {

            if($m == 'component') {
              $saveUrl = '/api/components/save';

              $mode = 'component';
            }

          }

          $arr = explode('/', $q);

          if(sizeof($arr) > 0) {

            $siteId = $arr[0];

            // set html if hiddent
            $url = $q;

            // strip any trailing .html from url
            $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

            // add .html back in
            $url .= '.html';

            // build title
            $arr = explode('/', $url);

            for($x=1; $x < sizeof($arr); $x++) {
              $title .= $arr[$x].'/';
            }

            $title = rtrim($title, '/');

            // load page path
            $page_path = rtrim(app()->basePath('public/sites/'.$url), '/');
            $draft_path = NULL;

            // get siteID
            $siteId = NULL;

            // get arr
            $arr = explode('/', $q);

            // check for site id
            if(isset($arr[0])) {
              $siteId = $arr[0];

              // strip out the siteId and replace the dots
              $draft_path_url = str_replace($siteId.'/', '', $url);
              $draft_path_url = str_replace('/', '.', $draft_path_url);

              $draft_path = rtrim(app()->basePath('resources/sites/'.$siteId.'/drafts/'.$draft_path_url), '/');
            }

            if(file_exists($page_path)) {

              $html = file_get_contents($page_path);

              // set dom
              $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

              // find base element
              $el = $dom->find('body', 0);

              // check for body => no body, then it is a component
              if(isset($el) == false) {

                // check for site id
                if($siteId) {

                  // load default template to render the component
                  $default_template_location = app()->basePath('public/sites/'.$siteId.'/templates/default.html');

                  if(file_get_contents($default_template_location)) {

                    // get html
                    $template_html = file_get_contents($default_template_location);

                    // remove custom header and footer from template
                    $template_html = str_replace('{{page.customHeader}}', '', $template_html);
                    $template_html = str_replace('{{page.customFooter}}', '', $template_html);

                    // set dom
                    $dom = HtmlDomParser::str_get_html($template_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

                    $el = $dom->find('[role=main]');

                    // get the component content
                    if(isset($el[0])) {
                      $el[0]->innertext = $html;
                    }

                  }
                  else {
                    return 'Please specify a default template to render a component.';
                  }

                }

              }
              else { // handle pages

                // find main DOM
                $el = $dom->find('[role=main]', 0);

                if($el) {

                  // load the draft if it exists
                  if(file_exists($draft_path)) {

                    // set HTML to the draft
                    $html = file_get_contents($draft_path);
                    $el->innertext = $html;

                  }

                }

              }

              // find base
              $el = $dom->find('base', 0);

              // update the base so that we can display the page's CSS
              if(isset($el)) {
                $el->setAttribute('href', '/sites/'.$siteId.'/');
              }
              else {
                return 'Please specify a base in your html file';
              }

              // get settings
              $sortable = Setting::getById('sortable', $siteId);
              $editable = Setting::getById('editable', $siteId);
              $blocks = Setting::getById('blocks', $siteId);

              // set sortable elements
              if($sortable === NULL) {
                $sortable = '.col, .column';
              }

              // set editable elements
              if($editable === NULL) {
                $editable = ['[role=main]'];
              }
              else {
                $editable = explode(',', $editable);
                $editable = array_map('trim', $editable);
              }

              // set block elements
              if($blocks === NULL) {
                $blocks = '.block';
              }

              // find body element
              $el = $dom->find('body', 0);
              $el->setAttribute('editor-active', '');

              // setup editable areas
              foreach($editable as $value){

                // find body element
                $els = $dom->find($value);

                foreach($els as $el) {
                  $el->setAttribute('editor', '');
                  $el->setAttribute('editor-selector', $value);
                }

              }

              // initialize plugins
              $plugins_script = '';

              // get custom plugins
              $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/plugins.json';

              if(file_exists($json_file)) {

                if(file_exists($json_file)) {
                  $plugins_script .= 'var plugins = '.file_get_contents($json_file).';';
                  $plugins_script .= 'if(editor.menu !== null && editor.menu !== undefined) {editor.menu = editor.menu.concat(plugins);}';
                }

              }

              // remove elements from that have been excluded
              $els = $dom->find('[editor-exclude]');

              // add references to each element
              foreach($els as $el) {
                $el->outertext = '';
              }

              // remove scripts
              $els = $dom->find('script');

              // add references to each element
              foreach($els as $el) {
                $el->outertext = '';
              }

              // remove inner part of contents
              $els = $dom->find('div');

              // clear out the contents of the plugin
              foreach($els as $el) {
                if(isset($el->{'respond-plugin'})) {
                  $el->innertext = '';
                }
              }

              // setup references
              $parent = $dom->find('[role=main]', 0);

              // editor js
              $editor = <<<EOD
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script src="/editor/libs.min.js"></script>
<script src="/editor/editor.js"></script>
<script>$plugins_script</script>
<script>
editor.setup({
  title: '$title',
  url: '$url',
  previewUrl: '/sites/$url',
  sortable: '$sortable',
  blocks: '$blocks',
  login: '/login/$siteId',
  translate: true,
  stylesheet: ['/editor/editor.css', '/api/editor/css'],
  languagePath: '/assets/i18n/{{language}}.json',
  auth: 'token',
  authHeader: 'X-AUTH',
  saveUrl: '$saveUrl'
});
</script>
<style>
  body {
    margin-left: 250px !important;
  }
</style>
EOD;

              // find body element
              $el = $dom->find('body', 0);

              // append
              $el->outertext = $el->makeup() . $el->innertext . $editor . '</body>';

              // return updated html
              return $dom;

            }


          }


        }

    }

}
