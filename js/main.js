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

////////////////////////////////////////////////////////////////////////////////////
// Error Message
var ERROR_ID_SNUM_NAME_ERROR = "サモナーネームが不正です"
var ERROR_ID_MASTERY_LISTDATA_GET_ERROR = "マスタリーリストが取得出来ませんでした"
var ERROR_ID_VERSION_GET_ERROR = "バージョン情報が取得出来ませんでした"

////////////////////////////////////////////////////////////////////////////////////
//
function summonerLookUp()
{
	$.getScript('https://sites.google.com/site/tmaruprofile/global.js',function(){
		var SUMMONER_NAME = "";
		SUMMONER_NAME = $("#summonerName").val();

		if(SUMMONER_NAME !== "")
		{
			GetVersion();

			$.ajax(
			{
				url: 'https://' + COUNTRY_ID2.toLowerCase() + '.api.pvp.net/api/lol/' + COUNTRY_ID2.toLowerCase() + '/v1.4/summoner/by-name/' + SUMMONER_NAME + '?api_key=' + API_KEY,
				type: 'GET',
				dataType: 'json',
				data: {},

				success: function (json)
				{
				var SUMMONER_NAME_NOSPACES = SUMMONER_NAME.replace(" ", "");
				SUMMONER_NAME_NOSPACES = SUMMONER_NAME_NOSPACES.toLowerCase().trim();

				SUM_ID = json[SUMMONER_NAME_NOSPACES].id; // サモナーID保存

				ShowSummonerInfo(json, SUMMONER_NAME_NOSPACES); // サモナー情報表示
				},

				error: function (XMLHttpRequest, textStatus, errorThrown)
				{
				errorDlg(ERROR_ID_SNUM_NAME_ERROR);
				}
		      });
		      
		      ShowMastery();　// マスタリー表示
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
			var target = document.getElementById("mastery");
			var newTag;

			for(var i in json.data)
			{
				//console.log(i + ':' + json.data[i].name);
				newTag = document.createElement("p"+i);
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

function GetVersion()
{
	$.ajax(
	{
		url: 'https://global.api.pvp.net/api/lol/static-data/jp/v1.2/realm?api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {},

		success: function (json)
		{
			console.log(json);

			VER_CHAMPION = json.n.champion;
			VER_ITEM = json.n.item;
			VER_MASTERY = json.n.mastery;
			VER_RUNE = json.n.rune;

			CDN_URL = json.cdn;

			console.log("VER_CHAMPION : " + VER_CHAMPION);
			console.log("VER_ITEM : " + VER_ITEM);
			console.log("VER_MASTERY : " + VER_MASTERY);
			console.log("VER_CHAMPION : " + VER_CHAMPION);
			console.log("VER_RUNE : " + VER_RUNE);
			console.log("CDN_URL : " + CDN_URL);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
			console.log(ERROR_ID_VERSION_GET_ERROR);
		}
	});
}