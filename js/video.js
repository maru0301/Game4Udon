jQuery(function () {
    var isIframe=function(){var a=!1;try{self.location.href!=top.location.href&&(a=!0)}catch(b){a=!0}return a};if(!isIframe()){var logo=$("");$("#wrapper").prepend(logo),$("#logo").fadeIn()}

    /* Initialize the player */
    var myPlayer = jQuery(".player").YTPlayer();
});

var videos = [
"QZh5wRENttI",
"0GJNJ2fsFno",
"ydvz-x9MfDA",
"2gU_HpD0hWY",
"baYrNPrdSac",
"2gU_HpD0hWY",
"6kEZEvMYKQY",
"LBW-G57nmqA",
"ekXfarHm6Ao",
"Lv85e8JgR3g",
"DYW-kEiCnJI",
"-P9zLHDUFEM",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
"2gU_HpD0hWY",
];

var rndVideo = videos[Math.floor(Math.random() * videos.length)];

var target = document.getElementById("bg");
var newTag = document.createElement("videoBg");

newTag.innerHTML = "<a class=\"player\" data-property=\"{videoURL:rndVideo,containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1,ratio:'4/3', addRaster:true}\">My video</a>";

target.appendChild(newTag);