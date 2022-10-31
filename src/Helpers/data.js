export const Loc = [
	{ value: 'LAN', label: 'LAN' },
	{ value: 'MAR', label: 'MAR' },
	{ value: 'COT', label: 'COT' },
	{ value: 'MON', label: 'MON' },
	{ value: 'SFC', label: 'SFC' },
	{ value: 'VAL', label: 'VAL' },
	{ value: 'CIT', label: 'CIT' },
];

export const Qte = [
	{ value: 'FEW', label: 'FEW' },
	{ value: 'SCT', label: 'SCT' },
	{ value: 'BKN', label: 'BKN' },
	{ value: 'OVC', label: 'OVC' },
	{ value: 'LYR', label: 'LYR' },
	{ value: 'LOC', label: 'LOC' },
	{ value: 'ISOL', label: 'ISOL' },
	{ value: 'OCNL', label: 'OCNL' },
	{ value: 'FRQ', label: 'FRQ' },
	{ value: 'EMBD', label: 'EMBD' },
];

export const Type = [
	{ value: 'CC', label: 'CC' },
	{ value: 'CS', label: 'CS' },
	{ value: 'AS', label: 'AS' },
	{ value: 'NS', label: 'NS' },
	{ value: 'CU', label: 'CU' },
	{ value: 'ST', label: 'ST' },
	{ value: 'SC', label: 'SC' },
	{ value: 'AC', label: 'AC' },
	{ value: 'CI', label: 'CI' },
	{ value: 'CB', label: 'CB' },
];

export const Images = [
	{
		src: '/Icons/Clouds/001_Icing_slight.png',
		alt: '<ICE1>',
		value: '<ICE1>',
	},
	{
		src: '/Icons/Clouds/002_Icing_mod.png',
		alt: '<ICE2>',
		value: '<ICE2>',
	},
	{
		src: '/Icons/Clouds/003_Icing_severe_1.png',
		alt: '<ICE3>',
		value: '<ICE3>',
	},
	{
		src: '/Icons/Clouds/004_Turb_mod_1.png',
		alt: '<ICE4>',
		value: '<ICE4>',
	},
	{
		src: '/Icons/Clouds/005_Turb_severe.png',
		alt: '<ICE5>',
		value: '<ICE5>',
	},
	{
		src: '/Icons/Clouds/Ww_17.png',
		alt: '<ICE6>',
		value: '<ICE6>',
	},
];

let IL = [];
Images.forEach((image) => (IL[image.value] = image.src));

export const imagesLink = IL;

export const centresImages = [
	[
		{ name: 'high', src: '/Icons/Clouds/high.png' },
		{ name: 'low', src: '/Icons/Clouds/low.png' },
	],
	[
		{ name: 'anticyclone', src: '/Icons/Clouds/anticyclone.png' },
		{ name: 'depression', src: '/Icons/Clouds/depression.png' },
	],
	[
		{ name: 'cyclone', src: '/Icons/Clouds/cyclone.png' },
		{ name: 'typhon', src: '/Icons/Clouds/typhon.png' },
	],
	[
		{ name: 'td', src: '/Icons/Clouds/td.png' },
		{ name: 'c', src: '/Icons/Clouds/c.png' },
	],
];

export const directions = [
	-1, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
	170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310,
	320, 330, 340, 350, 360,
];

export const directions2 = [
	{ name: -1, code: '-1' },
	{ name: 0, code: '0' },
	{ name: 10, code: '10' },
	{ name: 20, code: '20' },
	{ name: 30, code: '30' },
	{ name: 40, code: '40' },
	{ name: 50, code: '50' },
	{ name: 60, code: '60' },
	{ name: 70, code: '70' },
	{ name: 80, code: '80' },
	{ name: 90, code: '90' },
	{ name: 100, code: '100' },
	{ name: 110, code: '110' },
	{ name: 120, code: '120' },
	{ name: 130, code: '130' },
	{ name: 140, code: '140' },
	{ name: 150, code: '150' },
	{ name: 160, code: '160' },
	{ name: 170, code: '170' },
	{ name: 180, code: '180' },
	{ name: 190, code: '190' },
	{ name: 200, code: '200' },
	{ name: 210, code: '210' },
	{ name: 220, code: '220' },
	{ name: 230, code: '230' },
	{ name: 240, code: '240' },
	{ name: 250, code: '250' },
	{ name: 260, code: '260' },
	{ name: 270, code: '270' },
	{ name: 280, code: '280' },
	{ name: 290, code: '290' },
	{ name: 300, code: '300' },
	{ name: 310, code: '310' },
	{ name: 320, code: '320' },
	{ name: 330, code: '330' },
	{ name: 340, code: '340' },
	{ name: 350, code: '350' },
	{ name: 360, code: '360' },
];


export const forces = [
	{
		value: 'Modere',
		label: 'Modere',
		src: '/Icons/CAT/Modere.png',
	},
	{
		value: 'Severe',
		label: 'Severe',
		src: '/Icons/CAT/Severe.png',
	},

	{
		value: 'Mod ISOL Severe',
		label: 'Mod ISOL Severe',
		src: '/Icons/CAT/ModISOLSevere.png',
	},
	{
		value: 'Mod OCNL Severe',
		label: 'Mod OCNL Severe',
		src: '/Icons/CAT/ModOCNLSevere.png',
	},
	{
		value: 'Mod FRQ Severe',
		label: 'Mod FRQ Severe',
		src: '/Icons/CAT/ModFRQSevere.png',
	},
];

let FI = [];
forces.forEach((force) => (FI[force.value] = force.src));
export const forcesImages = FI;


export const styleBorder = [
	{style:'dashed',image:'/Icons/ZoneTexte/dashed.PNG'},
	{style:'dotted',image:'/Icons/ZoneTexte/dotted.PNG'},
	{style:'double',image:'/Icons/ZoneTexte/double.PNG'},
	{style:'solid',image:'/Icons/ZoneTexte/solid.PNG'},
]

export const sizeTextList = [8,10,12,14,16,18,20,22,24,26,28,38,48];