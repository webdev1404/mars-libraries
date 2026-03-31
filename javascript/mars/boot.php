<?php
if (!defined('MARS')) {
    die;
}

if ($this->development) {
    $files = $app->json->decode(file_get_contents(__DIR__ . '/files.json'));
    
    foreach ($files['js'] as $file) {
        $this->document->js->load($this->assets_url . '/' . $file, 'footer');
    }

    foreach ($files['css'] as $file) {
        $this->document->css->load($this->assets_url . '/' . $file, 'footer');
    }
} else {
    $this->document->js->load($this->assets_url . '/dist/mars.js', 'footer');
    $this->document->css->load($this->assets_url . '/dist/mars.css', 'footer');
}