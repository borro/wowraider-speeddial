<?php
class ZipArchiveExt extends ZipArchive
{
	/**
	 * Добавляем в архив целую директорию.
	 *
	 * @param string $dir_name
	 */
	public function addDir($dir_name)
	{
		$files = scandir($dir_name);
		foreach ($files as $file) if (!in_array($file, array('.', '..'))) {
			$fileName = $dir_name.'/'.$file;
			if (is_dir($fileName)) {
				$this->addEmptyDir($fileName);
				$this->addDir($fileName);
			} else {
				$this->addFile($fileName);
			}
		}
	}
}
