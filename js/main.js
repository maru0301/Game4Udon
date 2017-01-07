////////////////////////////////////////////////////////////////////////////////////
// Global
var SUM_ID = "";
var COUNTRY_ID1 = "ja";
var COUNTRY_ID2 = "JP";

var VER_ITEM = "";
var VER_RUNE = "";
var VER_MASTERY = "";
var VER_CHAMPION = "";

var CDN_URL = "";

///////////////////////////////////////
var JSON_DATA_CHAMP_IMG = {};


////////////////////////////////////////////////////////////////////////////////////
// Error Message
var ERROR_ID_SNUM_NAME_ERROR 		= "サモナーネームが不正です"
var ERROR_ID_MASTERY_LISTDATA_GET_ERROR = "マスタリーリストが取得出来ませんでした"
var ERROR_ID_VERSION_GET_ERROR 		= "バージョン情報が取得出来ませんでした"
var ERROR_ID_SNUM_GET_ERROR 		= "サモナーネーム情報が取得出来ませんでした"
var ERROR_ID_CHAMPION_GET_ERROR 	= "チャンピオン情報が取得出来ませんでした"

////////////////////////////////////////////////////////////////////////////////////
//
function summonerLookUp()
{
	$.getScript('https://sites.google.com/site/tmaruprofile/global.js',function(){
		var SUMMONER_NAME = "";
		SUMMONER_NAME = $("#summonerName").val();

		if(SUMMONER_NAME !== "")
		{
			var request = [
				{ error_id: ERROR_ID_VERSION_GET_ERROR,		url: 'https://global.api.pvp.net/api/lol/static-data/jp/v1.2/realm?api_key=' + API_KEY  }, // Version
				{ error_id: ERROR_ID_SNUM_GET_ERROR,		url: 'https://'  + COUNTRY_ID2.toLowerCase() + '.api.pvp.net/api/lol/' + COUNTRY_ID2.toLowerCase() + '/v1.4/summoner/by-name/' + SUMMONER_NAME + '?api_key=' + API_KEY  }, // サモナーID
				{ error_id: ERROR_ID_CHAMPION_GET_ERROR,	url: 'https://global.api.pvp.net/api/lol/static-data/jp/v1.2/champion?champData=image&api_key=' + API_KEY  }, // Img
			];

			var jqXHRList = [];

			for (var i = 0, max = request.length ; i < max ; ++i)
			{
				jqXHRList.push($.ajax(
				{
					url: request[i].url,
					type: 'GET',
					dataType: 'json',
					data: {}
				}));
			}

			$.when.apply(null, jqXHRList).done(function ()
			{
				var json = [];
				var statuses = [];
				var jqXHRResultList = [];

				for (var i = 0, max = arguments.length ; i < max ; ++i)
				{
					var result = arguments[i];
					json.push(result[0]);
					statuses.push(result[1]);
					jqXHRResultList.push(result[3]);
				}
				console.log(json);
//				console.log(statuses);
//				console.log(result);

				///////////////////////////////////////////////////////////
				// Global情報取得
				///////////////////////////////////////////////////////////
				var verJson = json[0];
				var summonerJson = json[1];
				var champImgJson = json[2];

				// Version
				VER_CHAMPION = verJson.n.champion;
				VER_ITEM = verJson.n.item;
				VER_MASTERY = verJson.n.mastery;
				VER_RUNE = verJson.n.rune;

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
				for (var i = 0 ; i < jqXHRList.length ; ++i)
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
	});
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
	document.getElementById("sID").innerHTML = summonerID;
}

function ShowMastery()
{
	$.ajax(
	{
		url: 'https://global.api.pvp.net/api/lol/static-data/jp/v1.2/mastery?locale=ja_JP&masteryListData=image&api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {},

		success: function (json)
		{
			console.log("ShowMastery: success");

			var target = document.getElementById("mastery");
			var newTag;

			for(var i in json.data)
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
			console.log(ERROR_ID_MASTERY_LISTDATA_ERROR);
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
		url: 'https://jp.api.pvp.net/api/lol/jp/v1.3/game/by-summoner/' + SUM_ID + "/recent?api_key=" + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {},

		success: function (json)
		{
			console.log("GetRecentMatchHistory: success");
			console.log(json.games);

			var target = document.getElementById("match");
			var newTag;

			var gameMode = "";
			var champ_img = "";
			var champ_name = "";

			$("#match").children().remove();

			for(var i in json.games)
			{
				if( json.games[i].gameMode === "ARAM" )
					gameMode = "アラーム";

				for(var j in JSON_DATA_CHAMP_IMG.data)
				{
					if( json.games[i].championId == JSON_DATA_CHAMP_IMG.data[j].id )
					{
						champ_img = JSON_DATA_CHAMP_IMG.data[j].image.full;
						champ_name = JSON_DATA_CHAMP_IMG.data[j].name;
						break;
					}
				}

				newTag = document.createElement("match_"+i);
/*
				newTag.innerHTML = "<br />" + json.data[i].name +
						   "<br />" + "<img src='" + CDN_URL + "/" + VER_MASTERY + "/img/mastery/" + i + ".png' width='48' height='48' title='" + json.data[i].name +"'>" +
						   "<br />" + json.data[i].description +
						   "<br />";
*/
				newTag.innerHTML = "<br />" + gameMode +
						   "<br />" + "<img src='" + CDN_URL + "/" + VER_CHAMPION + "/img/champion/" + champ_img + "' width='48' height='48' title='" + champ_name +"'>" +
						   "<img src='" + CDN_URL + "/" + VER_CHAMPION + "/img/champion/" + champ_img + "' width='24' height='24' title='" + champ_name +"'>" +
						   "<img src='" + CDN_URL + "/" + VER_CHAMPION + "/img/champion/" + champ_img + "' width='24' height='24' title='" + champ_name +"'>";

				target.appendChild(newTag);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			console.log("GetRecentMatchHistory");
		}
	});
}
