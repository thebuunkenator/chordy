// TODO: div blokken voor chorsu, tab e.d
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

  result = loadStrings('assets/twinkle.chp')

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

function parseSong() {
  for (let line of result) {
    //vind  directives
    let pattern = /{(.*)}/
    let meta = pattern.exec(line)

    //metadata regel
    if (meta != null) {
      // console.log(meta[1])
      let metaDict = splitTokens(meta[1], ":")

      if (metaDict.length > 1) {
        // console.log(metaDict[0], metaDict[1])


        let key = metaDict[0]
        let value = metaDict[1]
        // console.log(key, value);

        // check of het een score metadata is of inline directives
        if (key == "comment" || key == "" || key == "c") {
          let elm = {
            "comment": value
          };
          score.push([elm])

        } else {
          // Check directive
          metaData[key] = trim(value)
        }

      } else {
        let elm = {
          "meta": meta[1]
        };
        score.push([elm])
      }

    } else {
      if (!(score.length == 0 && line == "")) {
        // reguliere regel
        let myList = splitTokens(line, "[")
        let partNumbers = myList.length

        // Kijk of de regl uit meedere delen bestaat
        if (partNumbers < 2) {
          if (trim(line)[0] != "#") //remove comments
            score.push(line)

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
  
  if (metaData.title != null) {
    document.title = APP + " - " + metaData.title;
    } else {
      doucment.title = APP;
    };
  
  console.log(score);
  console.log(metaData);

}

function createHTMLScore() {


  // header
  let title = createDiv(metaData['title'])
  title.addClass('title')
  let subtitle = createDiv(metaData['subtitle'])
  subtitle.addClass('subtitle')

  // key
  let keyDiv = createDiv().addClass('key')
  let keyLabel = createDiv('Key:').addClass('label')
  let keyChoice = createSelect().addClass('keyChoice')
  for (let k of keyOrder) {
    keyChoice.option(k)
    if (k.toUpperCase() == metaData.key.toUpperCase()) {
      keyChoice.selected(k)
    }

  }

  keyDiv.child(keyLabel)
  keyDiv.child(keyChoice)

  let scoreDiv = createDiv('').addClass("score")

  for (let line of score) {
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
          kolom.child(createDiv(run.Comment).addClass("comment"))
        }

        // console.log(kolom.html())

        if (kolom.html() == "") {
          // console.log("removing");
          kolom.remove()
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