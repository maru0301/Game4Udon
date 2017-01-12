jQuery(function () {
	var isIframe=function(){var a=!1;try{self.location.href!=top.location.href&&(a=!0)}catch(b){a=!0}return a};if(!isIframe()){}

	/* Initialize the player */
	var myPlayer = jQuery(".player").YTPlayer();
});

/////////////////////////////////////////////////
//

var videos = [
"QZh5wRENttI",	// Snowdown 2016
"0GJNJ2fsFno",	// Camille, the Steel Shadow
"ydvz-x9MfDA",	// All-Star Barcelona 2016
"2gU_HpD0hWY",	// Elementalist Lux
"WjfSWBvJCvA",	// Season 2017
"baYrNPrdSac",	// Tales from the Rift
"MLARzSiTAVE",	// 2016 (Season 6) World Championship Finals
"6kEZEvMYKQY",	// Star Guardians: Burning Bright
"LBW-G57nmqA",	// Ivern, the Green Father
"ekXfarHm6Ao",	// Worlds 2016
"Lv85e8JgR3g",	// Yorick, the Shepherd of Souls
"DYW-kEiCnJI",	// Bit Rush: Arcade Ahri
"-P9zLHDUFEM",	// Kled, the Cantankerous Cavalier
"3vylNCUu4eA",	// PROJECT: Ashe
"dsveCVCt5J4",	// Ryze, the Rune Mage
"IAIan0h85Xg",	// Dark Star Thresh
"O7MwJ5WGA_A",	// Taliyah, the Stoneweaver
"KzqaRl0n_5s",	// Mid-Season 2016 Esports
"HTj4BzF6HV4",	// Taric, the Shield of Valoran
"dE_0gc99kys",	// Mecha Zero Sion
"2Ncmjy-HaeA",	// April Fools 2016
"ApCoJeatwac",	// Aurelion Sol, the Star Forger
"GgLChYl614A",	// Lunar Revel 2016
"NSQZqVsaKWY",	// Jhin, the Virtuoso
"lu0fUb0PGh4",	// 2016 Season
"bSgPd2YC7HA",	// Snowdown Showdown 2015 (Bard, Gnar, Syndra)
"yB1rg7cAI1M",	// Poppy, Keeper of the Hammer
"EiobsNAKqHU",	// Dragon Trainer Tristana
"ZLhDBm2YtsU",	// Illaoi, the Kraken Priestess
"XHEu4IYXuJk",	// Slayer Jinx
"BO3XLE_eRPk",	// Bit Rush
"4Twd965VzX4",	// Worlds Collide: 2015 World Championship (ft. Nicki Taylor)
"O3u6M8j0e5M",	// World Championship 2015
"aB_DbCpFvHA",	// Kindred, the Eternal Hunters
"YjrL3WjaSN0",	// PROJECT: MASTER YI
"shIMVeI5IPE",	// Gangplank, the Saltwater Scourge2
"vdNHYCUjDCk",	// Captain Fortune
"eWmmpo5OsC8",	// Gangplank, the Saltwater Scourge 
"lr4EqywQGTQ",	// Tahm Kench, the River King
"8_OSWJeVTg0",	// Ekko, the Boy Who Shattered Time
"OXHx3up9nHo",	// Omega Squad Teemo
"qYIiy03eGE0",	// Welcome to Planet Urf
"MWHmgob5FDA",	// Bard, the Wandering Caretaker
"AwlA2e_tFjc",	// Dj Sona Kinetic
"goHHknZJaIY",	// DJ Sona Concussive
"GOgFsAejQ0o",	// Dj Sona Ethereal
"hAxB3rRAYNE",	// Dunkmaster Darius
"jkWXBxaJh-g",	// Firecracker Jinx
"mUeloo_Qvrk",	// LCS 2015 Season
"eXnYFGgwvsg",	// Snowdown Showdown 2014 (Winter Wonder Orianna)
"zXXdL4rHvww",	// Rek'Sai, the Void Burrower
"DFZJuBXufIM",	// Kalista, the Spear of Vengeance
"ZM3mmUAqyA4",	// Summoner's Rift 
"tm29vB0THXM",	// Harrowing 2014
"vZ9nyZTvRwY",	// Sion, The Undead Juggernaut
"4WqA61C_PDo",	// World Championship 2014
"smNA_BYDODU",	// Azir, the Emperor of the Sands
"XHMFp84xo64",	// Shurima 
"Awa7fpGmtf0",	// Gnar, the Missing Link
"LsjIDZXR-rs",	// Legends of the Field
"F8cPDpXnQa0",	// Braum, the Heart of the Freljord
"G6JAQD0FmDg",	// Super Galaxy Rumble
"3OLOFb5Gcx0",	// URF 2014 (April Fools)
"s7PafA8mrmI",	// Vel'Koz, the Eye of the Void
"h-6wHfudAPQ",	// Lunar Revel 2014
"lT-DJOqn-5Y",	// League of Legends Season 2014
"jfgKdOlO_E4",	// Yasuo, the Unforgiven
"yX4TlL_egts",	// Snowdown Showdown 2013
"LHWVpb5lQ0Y",	// Infernal Nasus
"B91NcKEQAMU",	// Haunted Zyra
"JoHRzfKrdtk",	// Jinx, the Loose Cannon
"vd66qPdq5Vg",	// Season 3 Finals
"lVrMJepoj6A",	// Pool Party
"siMydycgDXg",	// Forecast Janna
"DGT20ihvGDU",	// Spirit Guard Udyr
"qbMCmdSEoaA",	// Lucian, the Purifier
"UbvSfKby2uY",	// Forecast Janna
"vsHsGLYR4WM",	// Aatrox, the Darkin Blade
"7DpkziljhZE",	// All-Star Paris 2014
"gLuVXfZoOAk",	// Lissandra, the Ice Witch
"AW2JL512dXs",	// Zac, the Secret Weapon
"gZ61j3SxQPA",	// Quinn, Demacia's Wings
"drACMJveGMA",	// Panda Annie
"6WyH5E8Xs0c",	// Thresh, the Chain Warden
"UY3TexiTK_c",	// Season 3 World Championship
"bHGANyPJjYc",	// Aether Wing Kayle
"18yK0G9hHts",	// Vi, the Piltover Enforcer
"3-Gfn2a6tBM",	// Snowdown Showdown 2012 (Dark Candy Fiddlesticks)
"WN5OA1Qv1N4",	// Nami, the Tidecaller
"NXQdgK1VPMA",	// All-Star Shanghai 2013
"rgbKA01lSS8",	// Eternum Nocturne
"8kr6J2I-0qk",	// Zed, the Master of Shadows
"skD_I-SHk30",	// Elise, The Spider Queen
"0AQy829wveg",	// Season 2 World Championship
"27CRdopEhNM",	// Kha'Zix, the Voidreaver 
"k73RLHTjn8A",	// Syndra, the Dark Sovereign
"0axsibJhIco",	// Rengar, the Pridestalker
"ay_o-BGVhL4",	// Diana, Scorn of the Moon
"09IKI8utQ3g",	// Battlecast Prime Cho'Gath
"4ajAZG6FGWM",	// Zyra, Rise of the Thorns
"OcIE8UQKXdQ",	// Jayce, the Defender of Tomorrow
"TK72r5NTDnQ",	// Pulsefire Ezreal
"H1xHayXetLU",	// Draven, the Glorious Executioner
"upgwV0pIpXY",	// Darius, the Hand of Noxus
"J4ZE-lFqf4w",	// Varus, the Arrow of Retribution
"1Tnx6eNCH7Q",	// Gatekeeper Galio
"83s03_rSjRs",	// Hecarim, the Shadow of War
"4zeV2ktc-Xg",	// Lulu
"Lunar Revel",	// Lunar Revel 2012 (Talon & Sona)
"g-2XZ_Xe3E8",	// Snowdown Showdown 2011 (Heimerdinger & Maokai)
"hGmbThNEdZ8",	// Surprise Party Fiddlesticks
"bquR65LKO9o",	// Harrowing 2011 (Haunting Nocturne)
"mNFCiLGwUi8",	// Dominion (Crystal Scar)
];

var rndVideo = videos[Math.floor(Math.random() * videos.length)];

var target = document.getElementById("bg");
var newTag = document.createElement("videoBg");

newTag.innerHTML = "<a class=\"player\" data-property=\"{videoURL:rndVideo,containment:'body', showControls:false, autoPlay:true, mute:true, startAt:0,opacity:1,ratio:'16/9', addRaster:true}\">My video</a>";

target.appendChild(newTag);
