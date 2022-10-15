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
	 [{name: 'high', src: '/Icons/Clouds/high.png'},{name: 'low', src: '/Icons/Clouds/low.png'}],
	 [{name: 'anticyclone', src: '/Icons/Clouds/anticyclone.png'},{name: 'depression', src: '/Icons/Clouds/depression.png'}],
	 [{name: 'cyclone', src: '/Icons/Clouds/cyclone.png'},{name: 'typhon', src: '/Icons/Clouds/typhon.png'}],
	 [{name: 'td', src: '/Icons/Clouds/td.png'},{name: 'c', src: '/Icons/Clouds/c.png'}],
];

export const directions = [-1,0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360]
