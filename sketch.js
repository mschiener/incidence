let canvas;
let table;

function preload() {
  table = loadTable('regionkeys.csv', 'csv', 'header');
}

async function setup() {

  canvas = createCanvas(windowWidth, windowHeight);
  
  let params = getURLParams();
  let minDim = min(width,height)
  let region = '';
  let mode = ''
  
  /*
  if(Object.keys(params).length === 0) {
    region = 'neustadt_wn';
  } else {
    region = params.region
  }*/
  
  if(params.region) {
    region = params.region
  } else {
    region = 'neustadt_wn'
  }
  
  if(params.mode) {
    mode = params.mode
  } else {
    mode = 'cap'
  }

  let keynum = table.findRow(region, 'region').obj.key
  
  
  let result = await loadIncidence(keynum);
  let sevenDayIncidence = result.cases7_per_100k
  let sevenDayIncidenceTxt = result.cases7_per_100k_txt
  let regionTitle = `${result.BEZ}\n${result.GEN}`
  let updateTime = result.last_update.slice(0,10);

  var fillColor;
  if (sevenDayIncidence < 35) {
    fillColor = color(0, 255, 0);
  } else if (sevenDayIncidence < 50) {
    fillColor = color(255, 255, 0);
  } else if (sevenDayIncidence < 100){
    fillColor = color(255, 128, 0);
  } else {
    fillColor = color(255, 0, 0);
  }

  background(fillColor);
  
  
  if(mode == 'cap') {
    textSize(0.08 * minDim);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    
    text(`7-Tages-Inzidenz pro\n100.000 Einwohner \n`, width / 2, height/7);
    
    textSize(0.05 * minDim);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text(`${regionTitle}\n${updateTime}`, width / 2, height / 2.3);

    textSize(0.3 * minDim);
    textAlign(CENTER, BOTTOM);
    textStyle(BOLD);
    text(sevenDayIncidenceTxt, width / 2, height - height / 7);
    
  } else if (mode == 'nocap') {
    textSize(0.5 * minDim);
    textAlign(CENTER, CENTER);
    text(sevenDayIncidenceTxt, width / 2, height / 2);
  }
}

async function windowResized() {
  await setup();
}

function draw() {

}

async function loadIncidence(keynum) {
  var result = await fetch('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=RS%20%3D%20%27' + keynum + '%27&outFields=last_update,BEZ,GEN,cases7_per_100k_txt,cases7_per_100k&outSR=4326&f=json')
    .then(response => response.json())
    .then(response => response.features[0])
    .then(response => response.attributes);

  return result;
}