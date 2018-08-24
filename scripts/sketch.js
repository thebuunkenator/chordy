"use strict"
let APP = "Chordy";
let VERSION = "0.1";

let currentStyle = ""
let scorePart
let metaData = {}
let chords =[]
let score = [] 
let currentPart
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


function findMetaData(key_value) {
  for (let d of directives) {
    if (d.name == key_value) {
      //console.log('gevonden: ' + key_value)
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

    if (meta != null) {
        handleMetaData(meta)
    }
    else { 
        handleScoreLine(line)
    }

  }
  console.log(score);
  console.log(metaData);
  console.log(chords)
}

function handleScoreLine(line) {

    //console.log('scoreline: '+ line)
    if(line != ""){
      addToScore(parseScoreLine(line) )
    }  
}

function handleMetaData(meta) {
     let key
     let value

     let metaDict = splitTokens(meta[1], ":")
      
      
      //meta data met attribuut
      if (metaDict.length > 1) {

        key = metaDict[0]
        value = metaDict[1]

        let currentDirective = findMetaData(key);



        if (currentDirective) {

          if (currentDirective.type == 'meta-data') {
            metaData[key] = trim(value)
          } else {
            let elm={}
            switch (key){
              case 'c':
              case 'comment':
              case 'ci':
              case 'comment_italic':
              case 'cb':
              case 'comment_box':
              case 'image':
                elm[key] = value
                addToScore(elm)
                break
              case 'define':
                // console.log('define')
              case 'chord':
                // console.log('chord') //TODO: openemen in score
                elm[key] = value
                chords.push(elm)
                break
              default: 
                console.log('unknown metadata type' + key)
                

            }

          }
        }
        // l
      } else { 
         key = metaDict[0]
        switch(key) {
          case 'chorus':
            createPart('chorus');
            addToScore('Chorus')
            endPart()
            break
          case 'start_of_chorus':
          case 'soc':
            createPart('chorus')
            break
          case 'start_of_tab':
          case 'sot':
            createPart('tab')
            break
          case 'start_of_grid':
          case 'sog':
            createPart('grid')
            break
          case 'end_of_tab':
          case 'eot':
          case 'end_of_chorus':
          case 'eoc':
          case 'end_of_grid':
          case 'eog':
            endPart()
            break
          default:
            console.log('unknown meta (no attr):' + key)

        }
      }
}

function createPart(partName) {

  if(currentPart!=null) {
    endPart()
  }
  currentPart = {}
  currentPart['part']=partName
  currentPart['lines']=[]

}

function endPart() {
  //add object to score and add to teh score
  if(currentPart!=null) {
    score.push(currentPart)
    currentPart=null
  }
}

function addToScore(elm) {
  if(currentPart==null) {
    createPart('verse')
  } 
  currentPart.lines.push(elm)

}

function parseScoreLine (line) {
  let lineRuns =[]
  let myList = splitTokens(line, "[")
        let partNumbers = myList.length

        // Kijk of de regl uit meedere delen bestaat
        if (partNumbers < 2) { // 1 deel: lege regel of regel met commentaar
          if (trim(line)[0] != "#") {
            let elm = {}
            elm['line']=line
            return elm
          }
        } else {
         
           
            
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
         
        }

        return lineRuns

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

  for (let part of score) {
    let partDiv = createDiv('').addClass(part.part)
    let descDiv = createDiv(part.part).addClass('description')
    let linesDiv = createDiv('').addClass('lines')
    partDiv.child(descDiv)
    partDiv.child(linesDiv)
    
    for (let line of part.lines) {
      
      let lineDiv = createDiv('').addClass("line")
      
      for (let i = 0; i<line.length; i++)
       {
         let run = line[i]
        let runDiv = createDiv().addClass("run")
        let chordDiv = createDiv(run.chord).addClass("chord")
        let lyricsDiv = createDiv(run.lyrics).addClass("lyrics")

        runDiv.child(chordDiv)
        runDiv.child(lyricsDiv)

        lineDiv.child(runDiv)
      }

      linesDiv.child(lineDiv)
    }

    scoreDiv.child(partDiv)
  }
}