////////////////////////////////////////////////////////////////////////////////////
// Global
var SUM_ID = "";
var COUNTRY_ID1 = "ja";
var COUNTRY_ID2 = "JP";

var VER_ITEM = "";
var VER_RUNE = "";
var VER_MASTERY = "";
var VER_CHAMPION = "";
var VER_SN_SPELLS = "";

var CDN_URL = "";

// 本気度
var EARNESTNESS_SN_NORMAL = 1.0;
var EARNESTNESS_SN_RANKE_SOLO = 1.00002;
var EARNESTNESS_SN_ARAM = 0.9;

var GAME_MIN_TIME_SEC = 1200; //  20(min)

///////////////////////////////////////
var JSON_DATA_CHAMP_IMG 	= {};
var JSON_DATA_SN_SPELLS_IMG 	= {};
var JSON_DATA_UDON_LIST = {};

///////////////////////////////////////
var GAME_MODE_MESS = {
	"ARAM" :	[
				{ "type" : "MATCHED_GAME",	"sub_type" : "ARAM_UNRANKED_5x5",	"mess" : "アラーム" },
				{ "type" : "CUSTOM_GAME", 	"sub_type" : "NONE",			"mess" : "アラーム(カスタム)" },
			],
	"CLASSIC" :	[
				{ "type" : "MATCHED_GAME", 	"sub_type" : "RANKED_SOLO_5x5", 	"mess" : "ランクゲーム" },
				{ "type" : "MATCHED_GAME", 	"sub_type" : "NORMAL", 			"mess" : "サモナーズリフト" },
				{ "type" : "CUSTOM_GAME", 	"sub_type" : "NONE", 			"mess" : "サモナーズリフト(カスタム)" },
			],
	"URF"	:	[
				{ "type" : "MATCHED_GAME", 	"sub_type" : "URF", 			"mess" : "URF" },
				{ "type" : "CUSTOM_GAME", 	"sub_type" : "URF", 			"mess" : "URF(カスタム)" },
			],
};

////////////////////////////////////////////////////////////////////////////////////
// Error Message
var ERROR_ID_SNUM_NAME_ERROR 		= "サモナーネームが不正です";
var ERROR_ID_MASTERY_LISTDATA_GET_ERROR = "マスタリーリストが取得出来ませんでした";
var ERROR_ID_VERSION_GET_ERROR 		= "バージョン情報が取得出来ませんでした";
var ERROR_ID_SNUM_GET_ERROR 		= "サモナーネーム情報が取得出来ませんでした";
var ERROR_ID_CHAMPION_GET_ERROR 	= "チャンピオン情報が取得出来ませんでした";
var ERROR_ID_SN_SPELLS_GET_ERROR 	= "サモナースペル情報が取得出来ませんでした";
var ERROR_ID_UDON_LIST_GET_ERROR 	= "うどん情報が取得出来ませんでした";

////////////////////////////////////////////////////////////////////////////////////
//
function summonerLookUp()
{
	$("#udon").children().remove();
	$("#match").children().remove();
	
	var SUMMONER_NAME = "";
	SUMMONER_NAME = $("#summonerName").val();
	
	if(SUMMONER_NAME !== "")
	{
		var SUMMONER_NAME_URL = SUMMONER_NAME.replace(" ", "%20");
		SUMMONER_NAME_URL = SUMMONER_NAME_URL.replace("　", "%20");
		var request = [
			{ error_id: ERROR_ID_VERSION_GET_ERROR,		url: './php/main.php', data: { func:"GetVersion" },  }, // Version
			{ error_id: ERROR_ID_SNUM_GET_ERROR,		url: './php/main.php', data: { func:"GetSummonerByName", summonerName:SUMMONER_NAME_URL, country_id1:COUNTRY_ID2.toLowerCase(), country_id2:COUNTRY_ID2.toUpperCase() },  }, // サモナーID
			{ error_id: ERROR_ID_CHAMPION_GET_ERROR,	url: './php/main.php', data: { func:"GetChampionImage" },  }, // champion Img
			{ error_id: ERROR_ID_SN_SPELLS_GET_ERROR,	url: './php/main.php', data: { func:"GetSummonerSpells" },  }, // summoner spell Img
			{ error_id: ERROR_ID_UDON_LIST_GET_ERROR,	url: './data/json/udon_list.json', data: {},  },
		];
		
		var jqXHRList = [];
		
		for( var i = 0, max = request.length ; i < max ; ++i )
		{
			jqXHRList.push($.ajax(
			{
				url: request[i].url,
				type: 'GET',
				dataType: 'json',
				data: request[i].data,
			}));
		}
		
		$.when.apply(null, jqXHRList).done(function ()
		{
			var json = [];
			var statuses = [];
			var jqXHRResultList = [];
			for( var i = 0, max = arguments.length ; i < max ; ++i )
			{
				var result = arguments[i];
				json.push(result[0]);
				statuses.push(result[1]);
				jqXHRResultList.push(result[3]);
			}
			
			///////////////////////////////////////////////////////////
			// Global情報取得
			///////////////////////////////////////////////////////////
			var verJson = json[0];
			var summonerJson = json[1];
			var champImgJson = json[2];
			var spellsImgJson = json[3];
			var udonListJson = json[4];
			
			// Version
			VER_CHAMPION = verJson.n.champion;
			VER_ITEM = verJson.n.item;
			VER_MASTERY = verJson.n.mastery;
			VER_RUNE = verJson.n.rune;
			VER_SN_SPELLS = verJson.n.summoner;
			
			CDN_URL = verJson.cdn;
			
			// サモナーID
			var SUMMONER_NAME_NOSPACES = SUMMONER_NAME.replace(" ", "");
			SUMMONER_NAME_NOSPACES = SUMMONER_NAME_NOSPACES.toLowerCase().trim();
			
			SUM_ID = summonerJson[SUMMONER_NAME_NOSPACES].id; // サモナーID保存
			
			// Jsonをキャッシュ
			JSON_DATA_CHAMP_IMG = champImgJson;
			JSON_DATA_SN_SPELLS_IMG = spellsImgJson;
			JSON_DATA_UDON_LIST = udonListJson;
			
			///////////////////////////////////////////////////////////
			// 表示
			///////////////////////////////////////////////////////////
			
			GetRecentMatchHistory(); // 試合情報表示
		});
		
		$.when.apply(null, jqXHRList).fail(function (status,status2,status3)
		{
			for( var i = 0 ; i < jqXHRList.length ; ++i )
			{
				if( jqXHRList[i].statusText === "error" || ( jqXHRList[i].responseText !== undefined && jqXHRList[i].responseJSON === undefined ) )
				{
					errorDlg( request[i].error_id );
				}
			}
		});
	}
	else
	{
		errorDlg(ERROR_ID_SNUM_NAME_ERROR);
	}
}

/////////////////////////////////////////////////
//

function errorDlg(msg)
{
	window.alert("エラー:" + msg);
}

/////////////////////////////////////////////////
//

function GetRecentMatchHistory()
{
	$.ajax(
	{
		url: './php/main.php',
		type: 'GET',
		dataType: 'json',
		data: { func:"GetRecentMatchHistory", summonerID:SUM_ID, country_id1:COUNTRY_ID2.toLowerCase(), country_id2:COUNTRY_ID2.toUpperCase() },
		
		success: function (json)
		{
			var target = document.getElementById("match");
			var newTag;
			
			var gameMode = "";
			var gameType = "";
			var gameSubType = "";
			var gameModeMess = "";
			var champ_img = "";
			var champ_name = "";
			var spell1_img = "";
			var spell2_img = "";
			var spell1_name = "";
			var spell2_name = "";
			var isSpell1 = false;
			var isSpell2 = false;
			
			var game_data = new Array();
			
			$("#match").children().remove();
			
			for( var i in json.games )
			{
				game_data[i] = new SetGameData(json.games[i]);
				
				gameMode = json.games[i].gameMode;
				gameType = json.games[i].gameType;
				gameSubType = json.games[i].subType;
				
				console.log("gameMode:"+gameMode);
				console.log("gameType:"+gameType);
				console.log("gameSubType:"+gameSubType);
				
				// ゲームモード
				for( var j = 0 ; j < GAME_MODE_MESS[game_data[i].gameMode].length ; ++j )
				{
					if( gameType === GAME_MODE_MESS[gameMode][j].type && gameSubType === GAME_MODE_MESS[gameMode][j].sub_type )
					{
						gameModeMess = GAME_MODE_MESS[gameMode][j].mess;
						break;
					}
				}
				
				// チャンピオン
				for( var j in JSON_DATA_CHAMP_IMG.data )
				{
					if( json.games[i].championId == JSON_DATA_CHAMP_IMG.data[j].id )
					{
						champ_img = JSON_DATA_CHAMP_IMG.data[j].image.full;
						champ_name = JSON_DATA_CHAMP_IMG.data[j].name;
						break;
					}
				}
				
				// サモナースペル
				isSpell1 = false;
				isSpell2 = false;
				
				for( var j in JSON_DATA_SN_SPELLS_IMG.data )
				{
					if( json.games[i].spell1 == JSON_DATA_SN_SPELLS_IMG.data[j].id )
					{
						spell1_img = JSON_DATA_SN_SPELLS_IMG.data[j].image.full;
						spell1_name = JSON_DATA_SN_SPELLS_IMG.data[j].name;
						isSpell1 = true;
					}
					
					if( json.games[i].spell2 == JSON_DATA_SN_SPELLS_IMG.data[j].id )
					{
						spell2_img = JSON_DATA_SN_SPELLS_IMG.data[j].image.full;
						spell2_name = JSON_DATA_SN_SPELLS_IMG.data[j].name;
						isSpell2 = true;
					}
					
					if( isSpell1 == true && isSpell2 == true )
						break;
				}
				
				var winlose = game_data[i].win ? "Win" : "Lose";
				
				newTag = document.createElement("section");
				newTag.className = winlose;
				
				newTag.innerHTML = "<h1>" + gameModeMess + "</h1>" +
						   "<b>" + winlose  + "</b>" + "<br>" +
						   "<b>" + game_data[i].championsKilled + "/" + game_data[i].numDeaths + "/" + game_data[i].assists + "</b>" + "<br>" +
						   "<img src='" + CDN_URL + "/" + VER_CHAMPION + "/img/champion/" + champ_img + "' width='64' height='64' title='" + champ_name +"'>" + "<br>" +
						   "<img src='" + CDN_URL + "/" + VER_SN_SPELLS + "/img/spell/" + spell1_img + "' width='24' height='24' title='" + spell1_name +"'>" +
						   "<img src='" + CDN_URL + "/" + VER_SN_SPELLS + "/img/spell/" + spell2_img + "' width='24' height='24' title='" + spell2_name +"'>";
				
				target.appendChild(newTag);
			}
			
			// うどん
			ShowUdon(game_data);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			console.log("GetRecentMatchHistory");
			console.log(XMLHttpRequest);
			console.log(textStatus);
		}
	});
}


/////////////////////////////////////////////////
//
function SetGameData(data)
{
	this.gameMode = data.gameMode; // ゲームモード
	this.gameType = data.gameType; // ゲームタイプ
	this.gamesubType = data.subType;
	this.win = data.stats.win; // 勝敗
	this.timePlayed = data.stats.timePlayed; // プレイ時間(秒)
	
	this.championsKilled = data.stats.championsKilled || 0; // チャンピオンキル数
	this.assists = data.stats.assists || 0; // アシスト数
	this.numDeaths = data.stats.numDeaths || 0; // デス数
	this.killingSprees = data.stats.killingSprees || 0; // 連続キル回数
	this.largestKillingSpree = data.stats.largestKillingSpree || 0; // 最大連続キル数
	this.largestMultiKill = data.stats.largestMultiKill || 0; // 最大マルチキル数
	
	this.minionsKilled = data.stats.minionsKilled || 0; // ミニオンキル数
	this.turretsKilled = data.stats.turretsKilled || 0; // 破壊タレット数
	
	this.goldEarned = data.stats.goldEarned || 0; // 取得ゴールド量
	this.goldSpent = data.stats.goldSpent || 0; // 使用ゴールド量
	// 与えたダメージ
	this.physicalDamageDealtToChampions = data.stats.physicalDamageDealtToChampions || 0; // 与えたメージ量(物理)
	this.physicalDamageDealtPlayer = data.stats.physicalDamageDealtPlayer || 0;
	this.magicDamageDealtToChampions = data.stats.magicDamageDealtToChampions || 0; // 与えたメージ量(魔法)
	this.magicDamageDealtPlayer = data.stats.magicDamageDealtPlayer || 0;
	this.trueDamageDealtToChampions = data.stats.trueDamageDealtToChampions || 0; // 与えたメージ量(確定ダメージ)
	this.trueDamageDealtPlayer = data.stats.trueDamageDealtPlayer || 0;
	this.totalTimeCrowdControlDealt = data.stats.totalTimeCrowdControlDealt || 0;
	this.largestCriticalStrike = data.stats.largestCriticalStrike || 0; // 最大クリティカルダメージ
	
	this.totalDamageDealt = data.stats.totalDamageDealt || 0; // 与えたダメージ量(全ダメージ)
	this.totalDamageDealtToBuildings = data.stats.totalDamageDealtToBuildings || 0;
	this.totalDamageDealtToChampions = data.stats.totalDamageDealtToChampions || 0;
	// 受けたダメージ
	this.physicalDamageTaken = data.stats.physicalDamageTaken || 0;
	this.magicDamageTaken = data.stats.magicDamageTaken || 0;
	this.trueDamageTaken = data.stats.trueDamageTaken || 0;
	this.totalDamageTaken = data.stats.totalDamageTaken || 0;
	// 回復
	this.totalHeal = data.stats.totalHeal || 0; // 合計回復量
	this.totalUnitsHealed = data.stats.totalUnitsHealed || 0; // ユニット回復量
}

function GetRecommendUdon(data)
{
	var udon_id = 0;
	var earnestness = 0.0; // 本気度
	
	var total_game_num = 0; // 試合数
	var total_win = 0; // 勝利数
	var total_kill = 0;
	var total_assists = 0;
	var total_dead = 0;
	var total_killingSprees = 0;
	var total_play_time = 0;
	var total_turret_kill = 0;
	var total_damage_dealt = 0;
	var total_damage_taken = 0;
	
	var kda = 0.00;
	var win_rate = 0;
	var play_over_time = 0;
	
	for( var i = 0 ; i < data.length ; ++i )
	{
		total_win += data[i].win ? 1 : 0;
		total_kill += data[i].championsKilled;
		total_assists += data[i].assists;
		total_dead += data[i].numDeaths;
		total_killingSprees += data[i].killingSprees;
		total_play_time += data[i].timePlayed;
		total_turret_kill += data[i].turretsKilled;
		total_damage_dealt += data[i].totalDamageDealt;
		total_damage_taken += data[i].totalDamageTaken;
		
		switch( data[i].gameMode )
		{
			case "CLASSIC": // サモリフ
				if( data[i].gamesubType === "NORMAL" )
				{
					earnestness += EARNESTNESS_SN_NORMAL;
				}
				else if( data[i].gamesubType === "RANKED_SOLO_5x5" )
				{
					earnestness += EARNESTNESS_SN_RANKE_SOLO;
				}
				break;
			case "ARAM": // アラーム
			case "URF" : // URF
				earnestness += EARNESTNESS_SN_ARAM;
				break;
		}
	}
	
	total_game_num = data.length;
	
	// KDA
	kda = ( total_kill + total_assists ) / total_dead;
	// Win Rate
	win_rate = ( total_win / total_game_num ) * 100;
	// Play time
	play_over_time = total_play_time - ( total_game_num * GAME_MIN_TIME_SEC );
	
	// 調子
	var condition = 0;
	
	condition = condition + ( win_rate === 0 ? 0.00001 : win_rate );
	condition = condition + ( kda - 3.0 ) * ( earnestness );
	condition = condition + ( total_turret_kill * ( earnestness ) * 0.001);
	condition = condition + ( (total_damage_dealt / 10000 ) * ( earnestness ) * 0.01);
	condition = condition + ( (total_damage_taken / 10000 ) * ( earnestness ) * 0.01);
	
	// 疲労
	var fatigue = 0;
	fatigue = fatigue + ( ( play_over_time / 200 ) * earnestness );
	fatigue = fatigue + ( earnestness - ( EARNESTNESS_SN_ARAM * total_game_num ) );
	fatigue = fatigue / ( condition / 10 );
	// 空腹
	var hungry = 0;
	hungry = hungry + play_over_time/150;
	hungry = hungry + ( fatigue / 10 );
	
	/*
	var game_list = new Array();

	for( var i = 0 ; i < data.length ; ++i )
	{
		var mess = "";
		switch( data[i].gameMode )
		{
			case "CLASSIC": // サモリフ
				if( data[i].gamesubType === "NORMAL" )
				{
					mess = "ノーマル";
				}
				else if( data[i].gamesubType === "RANKED_SOLO_5x5" )
				{
					mess = "ランク";
				}
				else if( data[i].gameType == "CUSTOM_GAME" )
				{
					mess = "カスタム";
				}
				break;
			case "ARAM": // アラーム
				mess = "ARAM";
				break;
			case "URF" : // URF
				mess =" URF";
				break;
		}
		game_list.push(mess);
	}
	console.log("GameList :" + game_list);
	console.log("Win :" + total_win);
	console.log("Lose :" + (10 - total_win));
	console.log("play_time : " + play_over_time);
	console.log("本気度 :" + earnestness);
	console.log("調子 :"+condition);
	console.log("疲れ :"+fatigue);
	console.log("空腹 :"+hungry);
	*/
	// 時間
	var date = new Date();
	var hours = date.getHours();
	
	if( 6 <= hours && hours <= 9 )
		hours *= 1.1;
	else if( 12 <= hours && hours <= 13 )
		hours *= 1.2;
	else if( 18 <= hours && hours <= 20 )
		hours *= 1.3;
	
	if( 6 <= hours && hours <= 17 )
		fatigue *= 0.9;
	else if( 22 <= hours && hours <= 24 || 0 <= hours && hours <= 3 )
		fatigue *= 1.2;
	else if( 3 <= hours && hours <= 5 )
		fatigue *= 1.4;
	
	var save_diff = -1;
	
	for( var key in JSON_DATA_UDON_LIST )
	{
		var diff = 0;
		var diff_condition = ( JSON_DATA_UDON_LIST[key].param.condition[1] + JSON_DATA_UDON_LIST[key].param.condition[0] ) / 2;
		var diff_fatigue = ( JSON_DATA_UDON_LIST[key].param.fatigue[1] + JSON_DATA_UDON_LIST[key].param.fatigue[0] ) / 2;
		var diff_hungry = ( JSON_DATA_UDON_LIST[key].param.hungry[1] + JSON_DATA_UDON_LIST[key].param.hungry[0] ) / 2;
		diff = Math.abs(diff_condition - condition);
		diff += Math.abs(diff_fatigue - fatigue);
		diff += Math.abs(diff_hungry - hungry);
		
		if( save_diff > diff || save_diff === -1 )
		{
			save_diff = diff;
			udon_id = key;
		}
		/*
		console.log("name : " + JSON_DATA_UDON_LIST[key].name);
		console.log("diff_condition : " + Math.abs(diff_condition - condition));
		console.log("diff_fatigue : " + Math.abs(diff_fatigue - fatigue));
		console.log("diff_hungry : " + Math.abs(diff_hungry - hungry));
		console.log("diff : " + diff);
		*/
	}
	
	return JSON_DATA_UDON_LIST[udon_id];
}

function ShowUdon(game_data)
{
	$("#udon").children().remove();
	
	var target = document.getElementById("udon");
	var newTag = document.createElement("recommend_udon");
	
	var udon = GetRecommendUdon(game_data);
	var fileName = "";
	
	if( udon.fileName.length <= 1 )
	{
		fileName = udon.fileName[0];
	}
	else
	{
		fileName = udon.fileName[ Math.floor(Math.random() * udon.fileName.length) ];
	}
	
	newTag.innerHTML = "<br /><h1>" + "今の貴方におすすめのうどんはこちら</h1>" +
			"<img src='./data/img/"+ fileName +"' width='256' height='256' title='" + udon.name +"' class='udon_img'/>" + "<br>" +
			"<div class='udon_name'>" + udon.name + "</div>" +
			"<br>" +
			"<div class='udon_info'>" + udon.info + "</div>" +
			"<br>";
	
	target.appendChild(newTag);
}
