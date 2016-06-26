<?php
require_once __DIR__.'/functions.php';
$files = array('help', 'images', 'scripts', 'styles', 'config.xml', 'index.html', 'options.html');
chdir(realpath(__DIR__.'/../'));
if (!file_exists('output')) {
	mkdir('output', 0755);
}
$config = simplexml_load_file('config.xml');
$oex = new ZipArchiveExt();
$oexName = 'output/'.str_replace(' ', '-', strtolower($config->name['short'])) . "-{$config['version']}.oex";
$ret = $oex->open($oexName, ZipArchive::CREATE | ZipArchive::OVERWRITE);
if ($ret === true) {
	foreach ($files as $f) {
		if (is_dir($f)) {
			$oex->addDir($f);
		} else {
			$oex->addFile($f);
		}
	}
	$oex->close();
} else {
	echo "ZipArchive: can not open ($oexName) ", $ret;
	exit(1);
}
