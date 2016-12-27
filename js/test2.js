<!--
<html>
	<head>
		<title>JavaScript Sample</title>
		<!-- <script src="./js/jquery-3.1.1.js"></script> --
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
		<script src="./js/test.js"></script>
		<script type="text/javascript"> /*実行コード*/
		    jQuery(document).ready(function($) {
		        $("#letter").jLetter({
		        pause: 3000, //停止時間
		        rotateSpeed: 2500, //ローテション速度
		        fadeSpeed: 1000 //フェード時間
		        });
		    });
		</script>
	</head>
	<body>
		<input type="button" value="OK" onclick="printMsg()">
	</body>
</html>
-->

<!--
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <title>jQueryの使い方</title>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="./js/test.js"></script>
<!--
    <script>
        $(function() {
            $('div').click(function() {
                alert("HelloWorld");
            });
        });
    </script>
--
</head>
<body>
    <div>jQueryの使い方</div>
</body>
</html>
-->

<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>Game4Udon</title>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
		<script src="./js/test.js"></script>
	</head>
	<body>
		<b>Game4Udon</b>
		  <hr>
		<br />サモナーネーム
		<br />
		<input id="summonerName" />
		<input type="submit" onclick="summonerLookUp();" />
		<br />
		<br />サモナーレベル: <span id="sLevel"></span>
		<br />サモナーID: <span id="sID"></span>
	</body>
</html>
