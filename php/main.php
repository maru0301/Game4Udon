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
		$contry_id = $_GET['country_id'];
		
		$json = $this->GetJson('https://' . $contry_id . '.api.riotgames.com/lol/static-data/v3/realms?api_key=');
		
		return $json;
	}
	
	public function GetSummonerByName()
	{
		$sn_name = $_GET['summonerName'];
		$contry_id1 = $_GET['country_id1'];
		
		$json = $this->GetJson('https://' . $contry_id1 . '.api.riotgames.com/lol/summoner/v3/summoners/by-name/' . $sn_name . '?api_key=');
		
		return $json;
	}
	
	public function GetChampionImage()
	{
		$contry_id = $_GET['country_id'];

		$json = $this->GetJson('https://'. $contry_id . '.api.riotgames.com/lol/static-data/v3/champions?champData=image&api_key=');
		
		return $json;
	}
	
	public function GetSummonerSpells()
	{
		$contry_id = $_GET['country_id'];
		
		$json = $this->GetJson('https://' . $contry_id . '.api.riotgames.com/lol/static-data/v3/summoner-spells?spellData=image&api_key=');
		
		return $json;
	}
	
	public function GetRecentMatchHistory()
	{
		$sn_id = $_GET['summonerID'];
		$contry_id1 = $_GET['country_id1'];
		$contry_id2 = $_GET['country_id2'];
		
		$json = $this->GetJson('https://' . $contry_id1 . '.api.riotgames.com/api/lol/' . $contry_id2 . '/v1.3/game/by-summoner/' . $sn_id . '/recent?api_key=');
		
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