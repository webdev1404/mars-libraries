<?php
if (!defined('MARS')) {
    die;
}

if ($this->development) {
    $files = $app->json->decode(file_get_contents(__DIR__ . '/files.json'));
    
    foreach ($files['js'] as $file) {
        $this->document->js->load($this->library_url . '/' . $file, 'footer', attributes: ['defer' => true]);
    }

    foreach ($files['css'] as $file) {
        $this->document->css->load($this->library_url . '/' . $file, 'footer', attributes: ['defer' => true]);
    }
} else {
    $this->document->js->load($this->library_url . '/dist/mars.js', 'footer', attributes: ['defer' => true]);
    $this->document->css->load($this->library_url . '/dist/mars.css', 'footer', attributes: ['defer' => true]);
}