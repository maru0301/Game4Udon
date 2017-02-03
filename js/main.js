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
var EARNESTNESS_SN_RANKE_SOLO = 2.0;
var EARNESTNESS_SN_ARAM = 0.5;

var GAME_MIN_TIME_SEC = 1200; //  20(min)

///////////////////////////////////////
var JSON_DATA_CHAMP_IMG 	= {};
var JSON_DATA_SN_SPELLS_IMG 	= {};
var JSON_DATA_UDON_LIST = {};

///////////////////////////////////////
var GAME_MODE_MESS = {
	"ARAM" :	[
				{ "type" : "MATCHED_GAME",	"sub_type" : "ARAM_UNRANKED_5x5",	"mess" : "アラーム" },
				{ "type" : "CUSTOM_GAME", 	"sub_type" : "ARAM_UNRANKED_5x5",	"mess" : "カスタム(アラーム)" },
			],
	"CLASSIC" :	[
				{ "type" : "MATCHED_GAME", 	"sub_type" : "RANKED_SOLO_5x5", 	"mess" : "ランクゲーム" },
				{ "type" : "MATCHED_GAME", 	"sub_type" : "NORMAL", 			"mess" : "ノーマルゲーム" },
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
//	console.log("summonerLookUp");
	
//	$.getScript('https://sites.google.com/site/tmaruprofile/global.js',function(){
		var SUMMONER_NAME = "";
		SUMMONER_NAME = $("#summonerName").val();
		
		if(SUMMONER_NAME !== "")
		{
			var request = [
				{ error_id: ERROR_ID_VERSION_GET_ERROR,		url: './php/main.php', data: { func:"GetVersion" },  }, // Version
				{ error_id: ERROR_ID_SNUM_GET_ERROR,		url: './php/main.php', data: { func:"GetSummonerByName", summonerName:SUMMONER_NAME, country_id1:COUNTRY_ID2.toLowerCase(), country_id2:COUNTRY_ID2.toUpperCase() },  }, // サモナーID
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
				
//				console.log(arguments);
//				console.log(json);
//				console.log(statuses);
//				console.log(result);
				
				///////////////////////////////////////////////////////////
				// Global情報取得
				///////////////////////////////////////////////////////////
				var verJson = json[0];
				var summonerJson = json[1];
				var champImgJson = json[2];
				var spellsImgJson = json[3];
				var udonListJson = json[4];
				
//				console.log(verJson);
//				console.log(summonerJson);
				
				// Version
				VER_CHAMPION = verJson.n.champion;
				VER_ITEM = verJson.n.item;
				VER_MASTERY = verJson.n.mastery;
				VER_RUNE = verJson.n.rune;
				VER_SN_SPELLS = verJson.n.summoner;
				
				CDN_URL = verJson.cdn;
				
//				console.log("VER_CHAMPION : " + VER_CHAMPION);
//				console.log("VER_ITEM : " + VER_ITEM);
//				console.log("VER_MASTERY : " + VER_MASTERY);
//				console.log("VER_CHAMPION : " + VER_CHAMPION);
//				console.log("VER_RUNE : " + VER_RUNE);
//				console.log("CDN_URL : " + CDN_URL);
				
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
				
				ShowSummonerInfo(summonerJson, SUMMONER_NAME_NOSPACES); // サモナー情報表示
				
//				GetMatchHistory();
				GetRecentMatchHistory(); // 試合情報表示
				
//				ShowMastery();　// マスタリー表示
			});
			
			$.when.apply(null, jqXHRList).fail(function ()
			{
				console.log(jqXHRList);
				for( var i = 0 ; i < jqXHRList.length ; ++i )
				{
					if( jqXHRList[i].statusText === "error" )
					{
						errorDlg( request[i].error_id );
					}
				}
			});
		}
		else
		{
			errorDlg(ERROR_ID_SNUM_NAME_ERROR)
		}
//	});
}

/////////////////////////////////////////////////
//

function errorDlg(msg)
{
	window.alert("エラー:" + msg);
}

/////////////////////////////////////////////////
//

function ShowSummonerInfo(userDataJson, summonerName)
{
	var summonerLevel = userDataJson[summonerName].summonerLevel;
	var summonerID = userDataJson[summonerName].id;
	
	document.getElementById("sLevel").innerHTML = summonerLevel;
//	document.getElementById("sID").innerHTML = summonerID;
console.log(summonerID);
}

function ShowMastery()
{
	$.ajax(
	{
//		url: 'https://global.api.pvp.net/api/lol/static-data/jp/v1.2/mastery?locale=ja_JP&masteryListData=image&api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {},
		
		success: function (json)
		{
			console.log("ShowMastery: success");
			
			var target = document.getElementById("mastery");
			var newTag;
			
			for( var i in json.data )
			{
				//console.log(i + ':' + json.data[i].name);
				newTag = document.createElement("mastery_"+i);
				newTag.innerHTML = "<br />" + json.data[i].name +
						   "<br />" + "<img src='" + CDN_URL + "/" + VER_MASTERY + "/img/mastery/" + i + ".png' width='48' height='48' title='" + json.data[i].name +"'>" +
						   "<br />" + json.data[i].description +
						   "<br />";
				
				target.appendChild(newTag);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			errorDlg(ERROR_ID_MASTERY_LISTDATA_ERROR);
		}
	});
}

function GetMatchHistory()
{
	var mode = [
		"RANKED_SOLO_5x5",
		"RANKED_FLEX_SR",
	];
	
	var season = [
		"SEASON2016",
		"SEASON2017",
	];
	
	$.ajax(
	{
		url: 'https://jp.api.pvp.net/api/lol/jp/v2.2/matchlist/by-summoner/'+ SUM_ID + "?rankedQueues="+ mode[1] + "&seasons=" + season[1] + "&api_key=" + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {},
		
		success: function (json)
		{
	console.log("GetMatchHistory: success");
			console.log(json);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			console.log("GetMatchHistory");
		}
	});
}

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
			console.log("GetRecentMatchHistory: success");
			console.log(json.games);
			
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
				
				newTag = document.createElement("match_"+i);
				
				newTag.innerHTML = "<br />" + gameModeMess +
						   "<br />" + "<img src='" + CDN_URL + "/" + VER_CHAMPION + "/img/champion/" + champ_img + "' width='48' height='48' title='" + champ_name +"'>" +
						   "<img src='" + CDN_URL + "/" + VER_SN_SPELLS + "/img/spell/" + spell1_img + "' width='24' height='24' title='" + spell1_name +"'>" +
						   "<img src='" + CDN_URL + "/" + VER_SN_SPELLS + "/img/spell/" + spell2_img + "' width='24' height='24' title='" + spell2_name +"'>" +
						   " " + (game_data[i].win ? "Win" : "Lose");
				
//				target.appendChild(newTag);
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
	
	this.championsKilled = data.stats.championsKilled; // チャンピオンキル数
	this.assists = data.stats.assists; // アシスト数
	this.numDeaths = data.stats.numDeaths; // デス数
	this.killingSprees = data.stats.killingSprees; // 連続キル回数
	this.largestKillingSpree = data.stats.largestKillingSpree; // 最大連続キル数
	this.largestMultiKill = data.stats.largestMultiKill; // 最大マルチキル数
	
	this.minionsKilled = data.stats.minionsKilled; // ミニオンキル数
	this.turretsKilled = data.stats.turretsKilled || 0; // 破壊タレット数
	
	this.goldEarned = data.stats.goldEarned; // 取得ゴールド量
	this.goldSpent = data.stats.goldSpent; // 使用ゴールド量
	// 与えたダメージ
	this.physicalDamageDealtToChampions = data.stats.physicalDamageDealtToChampions; // 与えたメージ量(物理)
	this.physicalDamageDealtPlayer = data.stats.physicalDamageDealtPlayer;
	this.magicDamageDealtToChampions = data.stats.magicDamageDealtToChampions; // 与えたメージ量(魔法)
	this.magicDamageDealtPlayer = data.stats.magicDamageDealtPlayer;
	this.trueDamageDealtToChampions = data.stats.trueDamageDealtToChampions; // 与えたメージ量(確定ダメージ)
	this.trueDamageDealtPlayer = data.stats.trueDamageDealtPlayer;
	this.totalTimeCrowdControlDealt = data.stats.totalTimeCrowdControlDealt;
	this.largestCriticalStrike = data.stats.largestCriticalStrike || 0; // 最大クリティカルダメージ
	
	this.totalDamageDealt = data.stats.totalDamageDealt; // 与えたダメージ量(全ダメージ)
	this.totalDamageDealtToBuildings = data.stats.totalDamageDealtToBuildings;
	this.totalDamageDealtToChampions = data.stats.totalDamageDealtToChampions;
	// 受けたダメージ
	this.physicalDamageTaken = data.stats.physicalDamageTaken;
	this.magicDamageTaken = data.stats.magicDamageTaken;
	this.trueDamageTaken = data.stats.trueDamageTaken;
	this.totalDamageTaken = data.stats.totalDamageTaken;
	// 回復
	this.totalHeal = data.stats.totalHeal; // 合計回復量
	this.totalUnitsHealed = data.stats.totalUnitsHealed; // ユニット回復量
}

function GetRecommendUdon(data)
{
//	console.log("data : ");
//	console.log(data);
	
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
	var play_time = 0;
	
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
		
		console.log("gameMode : " + data[i].gameMode );
		console.log("gamesubType : " + data[i].gamesubType );
		
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
	play_time = total_play_time - ( total_game_num * GAME_MIN_TIME_SEC );
	
//	console.log("total_game_num : " + total_game_num);
//	console.log("kda : " + kda);
//	console.log("win_rate : " + win_rate);
//	console.log("play_time : " + play_time);
//	console.log("total_win : " + total_win);
//	console.log("total_kill : " + total_kill);
//	console.log("total_assists : " + total_assists);
//	console.log("total_dead : " + total_dead);
//	console.log("total_killingSprees : " + total_killingSprees);
//	console.log("total_play_time : " + total_play_time);
//	console.log("total_turret_kill : " + total_turret_kill);
//	console.log("total_damage_dealt : " + total_damage_dealt);
//	console.log("total_damage_taken : " + total_damage_taken);
	
	// 調子
	var condition = 0;
	condition = condition + ( kda - 3.0 ) * ( earnestness - ( EARNESTNESS_SN_ARAM * total_game_num ) );
	condition = condition + ( total_turret_kill * ( ( earnestness - ( EARNESTNESS_SN_ARAM * total_game_num ) * 0.1 ) ) );
	condition = condition + ( (total_damage_dealt / 10000 ) * ( ( earnestness - ( EARNESTNESS_SN_ARAM * total_game_num ) ) * 0.2 ) );
	condition = condition + ( (total_damage_taken / 10000 ) * ( ( earnestness - ( EARNESTNESS_SN_ARAM * total_game_num ) ) * 0.2 ) );
	// 疲労
	var fatigue = 0;
	fatigue = fatigue + ( earnestness - ( EARNESTNESS_SN_ARAM * total_game_num ) );
	fatigue = fatigue + ( play_time * earnestness );
	
	// 空腹
	var hungry = 0;
	hungry = hungry + ( play_time * fatigue );
	
	console.log(JSON_DATA_UDON_LIST);
	console.log(JSON_DATA_UDON_LIST[0]);
	
	console.log("condition : " + condition);
	console.log("fatigue : " + fatigue);
	console.log("hungry : " + hungry);
	
	return JSON_DATA_UDON_LIST[udon_id];
}

function ShowUdon(game_data)
{
	$("#udon").children().remove();
	
	var target = document.getElementById("udon");
	var newTag = document.createElement("recommend_udon");
	
	var udon = GetRecommendUdon(game_data);
console.log(udon);
	newTag.innerHTML = "<br /><h1>" + "今の貴方におすすめのうどんはこちら</h1>" +
			"<img src='./data/img/"+ udon.fileName +"' width='24' height='24' title='" + udon.name +"' class='udon_img'/>" + "<br>";// +
			
	
	target.appendChild(newTag);
}

function Test()
{
	$.ajax(
	{
		url: './php/main.php',
		type: 'GET',
		dataType: 'json',
		scriptCharset: 'utf-8',
		data: { func:"GetVersion" },

		success: function (json)
		{
			console.log("Test: success");
			console.log(json);
//			var data = JSON.parse(json);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

