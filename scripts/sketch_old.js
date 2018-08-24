// TODO: div blokken voor chorus, tab e.d
// TODO: lege div.run tags verwijdern (tab)
// TODO: transponeren
// TODO: score=array is nog niet helemaal netjes (array von objjecten of een tekststring)
// TODO: als dit allemaal netjes werk, dan dingen toevoegen als akkoorden schemas, ritmes



/*
toekomst:
- akkoorden, maatwerk akkoorden
capoo
opmerkingen over stemming gitaar
"Key of ...", ook mminur
Onderdelen links
Intro
Verse
PreChorus
Chorus
Interlude/Bridge
Outro

nieuwe functionaliteit
- teksten in maten
- herhalingen, coda's, 1e en 2e herhalingen etc.
- ritmes
  = in plaats van lyrics
  = boven lyrics
- tabs
- maatwisseling

*/
"use strict"
let APP = "Chordy";
let VERSION = "0.1";

let currentStyle = ""
let metaData = {}

let score = []
let lyricsOnly = false

let result;

function preload() {
  result = loadStrings('assets/blackHorse.chp')

}

function setup() {
  parseSong()

  createHTMLScore()
  noCanvas()
}


function handleMetaDataHTML(meta) {
  let metaDiv = createDiv()

  switch (meta) {
    case "start_of_chorus":
    case "soc":
      currentStyle = "chorus"
      break;
    case "start_of_verse":
    case "sov":
    case "end_of_grid":
    case "end_of_chorus":
    case "end_of_tab":
      currentStyle = ""
      break
    case "start_of_tab":
      currentStyle = "tab"
      break
    case "chorus":
      metaDiv.html("Chorus")
      metaDiv.addClass('chorus')

    default:

  }

  return metaDiv
}

function findMetaData(key_value) {
  for (let d of directives) {
    if (d.name == key_value) {
      console.log('gevonden: ' + key_value)
      return d
    }
  }
  console.log('niet gevonden: ' + key_value)
  return null
}

function parseSong() {
  for (let line of result) {
    //vind  directives
    let pattern = /{(.*)}/
    let meta = pattern.exec(line)
    let key
    let value



    //metadata regel
    if (meta != null) {

      let metaDict = splitTokens(meta[1], ":")
      // console.log(metaDict)

      if (metaDict.length > 1) {
        //meta data met attribuut
        // console.log(metaDict[0], metaDict[1])
        key = metaDict[0]
        value = metaDict[1]

        // console.log(key, value);

        //TODO: hier kiezen tussen wat er mee te doen
        // metadata of opnemen in score
        let currentDirective = findMetaData(key);

        if (currentDirective) {
          if (currentDirective.type == 'meta-data') {
            metaData[key] = trim(value)
          } else {
            let elm = {};
            elm[key] = value;
            score.push([elm])
          }
        } else {
          console.log("metadata item niet gevonden: " + key)
        }
        // l
      } else { //meta data zonder attribuut
        key = metaDict[0]
        let currentDirective = findMetaData(key);

        if (currentDirective) {
          key = currentDirective.type;
          value = metaDict[0];
          let elm = {}
          elm[key] = value;
          score.push([elm])
        }

        // console.log("zonder attribuut", key, value)


      }
    }
    else { // reguliere regel of commentaar
      if (!(score.length == 0 && line == "")) {
        // reguliere regel
        let myList = splitTokens(line, "[")
        let partNumbers = myList.length

        // Kijk of de regl uit meedere delen bestaat
        if (partNumbers < 2) { // 1 deel: lege regel of regel met commentaar
          if (trim(line)[0] != "#") {
            let elm
            score.push([line])
          }
        } else {
          let lineRuns = []

          for (let linePart of myList) {
            let run = {}
            let chords = splitTokens(linePart, "]")
            if (chords.length > 1) {

              run['chord'] = trim(chords[0])
              run['lyrics'] = chords[1]
            } else {
              // run['chord'] = trim("")
              run['lyrics'] = linePart

            }

            lineRuns.push(run)

          }
          score.push(lineRuns)
        }

        // score.push(line)

      }
    }



  }



  console.log(score);
  console.log(metaData);

}

function createHTMLScore() {

  


  // header
  let title = createDiv(metaData['title'])
  title.addClass('title')
  
  if (metaData.title != null) {
    document.title = APP + " - " + metaData.title;
  } else {
    doucment.title = APP;
  };

  let subtitle = createDiv(metaData['subtitle'])
  subtitle.addClass('subtitle')

  // GUI: key
  let keyDiv = createDiv().addClass('key')
  let keyLabel = createDiv('Key:').addClass('label')
  let keyChoice = createSelect().addClass('keyChoice')

    
  for (let k of keyOrder) {       
    keyChoice.option(k)    
    if(metaData.key !=null) {      
      if (k.toUpperCase() == metaData.key.toUpperCase()) {
        keyChoice.selected(k)       
      }    
    }

  }

  keyDiv.child(keyLabel)
  keyDiv.child(keyChoice)

  let scoreDiv = createDiv('').addClass("score")
  let scorePartDiv

  for (let line of score) {
    // if (scorePartDiv == null) {
    //   scoreDiv = createDiv('').addClass("verse")
    // }

    let regel = createDiv('')

    if (currentStyle != "") { //nadeel is dat datze per regel is en niet per blok
      regel.addClass(currentStyle)
    } else {
      regel.addClass('line')
    }
    // console.log(line);
    for (let run of line) {

      let kolom = createDiv('').addClass('run')

      if (run.meta) {
        // printText(run.meta)
        kolom.child(handleMetaDataHTML(run.meta))
      } else {
        if (run.chord) {
          kolom.child(createDiv(run.chord).addClass("chord"))
        }

        if (run.lyrics) {
          kolom.child(createDiv(run.lyrics).addClass("lyrics"))
        }

        if (run.comment) {
          // printText(run.comment)
          kolom.child(createDiv(run.comment).addClass("comment"))
        }




      }

      regel.child(kolom)

    }

    if (typeof line == "string") {
      let vrijeDiv = createDiv(line).addClass('literal')
      regel.child(vrijeDiv)
    }

    scoreDiv.child(regel)

  }


}