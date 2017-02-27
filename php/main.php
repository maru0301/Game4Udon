<?php
//include '../dev/ChromePhp.php';

if( !isset( $_GET['func'] ) ) return;

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
	
	public function GetSummonerByName()
	{
		$sn_name = $_GET['summonerName'];
		$contry_id1 = $_GET['country_id1'];
		$contry_id2 = $_GET['country_id2'];
		
		$json = $this->GetJson('https://' . $contry_id1 . '.api.pvp.net/api/lol/' . $contry_id2 . '/v1.4/summoner/by-name/' . $sn_name . '?api_key=');
		
		return $json;
	}
	
	public function GetChampionImage()
	{
		$json = $this->GetJson('https://global.api.pvp.net/api/lol/static-data/jp/v1.2/champion?champData=image&api_key=');
		
		return $json;
	}
	
	public function GetSummonerSpells()
	{
		$json = $this->GetJson('https://global.api.pvp.net/api/lol/static-data/jp/v1.2/summoner-spell?spellData=image&api_key=');
		
		return $json;
	}
	
	public function GetRecentMatchHistory()
	{
		$sn_id = $_GET['summonerID'];
		$contry_id1 = $_GET['country_id1'];
		$contry_id2 = $_GET['country_id2'];
		
		$json = $this->GetJson('https://' . $contry_id1 . '.api.pvp.net/api/lol/' . $contry_id2 . '/v1.3/game/by-summoner/' . $sn_id . '/recent?api_key=');
		
		return $json;
	}
}

//-------------------------------------------------


$api = new RiotApi;

$func_tbl = array(
			"GetVersion" => "GetVersion",
			"GetSummonerByName" => "GetSummonerByName",
			"GetChampionImage" => "GetChampionImage",
			"GetSummonerSpells" => "GetSummonerSpells",
			"GetRecentMatchHistory" => "GetRecentMatchHistory",
);

//-------------------------------------------------

$func_name = $_GET['func'];

//ChromePhp::log("php : " . $func_name);
//ChromePhp::log($func_tbl[$func_name]);

echo $api->{$func_tbl[$func_name]}();

//-------------------------------------------------

?>