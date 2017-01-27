<?php
#include '../dev/ChromePhp.php';
//-------------------------------------------------

class RiotApi
{
	private $api_key = '';
	
	private function GetJson( $url )
	{
		$master_url = $url . $this->api_key;
		$json = file_get_contents($master_url);
		$json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
		
		return $json;
	}
	
	public function GetVersion()
	{
		$json = $this->GetJson('https://global.api.pvp.net/api/lol/static-data/jp/v1.2/realm?api_key=');
		
		return $json;
	}

}

//-------------------------------------------------
$func_name = $_GET['func'];

$api = new RiotApi;

$func_tbl = array(
			"GetVersion" => $api->GetVersion(),
);

//-------------------------------------------------
#ChromePhp::log($func_tbl[$func_name]);

echo $func_tbl[$func_name];

//-------------------------------------------------

?>