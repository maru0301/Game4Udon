<?php
#include '../dev/ChromePhp.php';
//-------------------------------------------------

class RiotApi
{
	private $api_key = '';
	
	private function GetJson( $url )
	{
		$proxy = array(
			"http" => array(
					"proxy" => "proxy2.hq.scei.sony.co.jp:10080",
					'request_fulluri' => true,
				),
		);
		
		$proxy_context = stream_context_create($proxy);
		$master_url = $url . $this->api_key;
		$json = file_get_contents($master_url, false, $proxy_context);
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