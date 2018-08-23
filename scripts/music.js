"use strict"

let FLAT = "b" //"♭"
let SHARP = "#" //"♯"
let DOUBLE_SHARP = "x" //"𝄪"
let DOUBLE_FLAT = "&" //"𝄫"

let sharpsMajor = ["c", "g", "d", "a", "e", "b", "f#", "c#"]
let flatsMajor = ["c", "f", "bb", "eb", "ab", "db", "gb", "cb"]


// let sharpsMinor = ["a", "e", "b", "f#", "c#", "g#", "d#", "a#"]
// let flatsMinor = ["a", "d", "g", "c", "f", "bb", "eb", "ab"]

let keyOrder = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"]

let sharpsOrder = ["", "f", "c", "g", "d", "a", "e", "b"]
let flatsOrder = ["", "b", "e", "a", "d", "g", "c", "f"]

function getScale(key) {
  let numFlats = findNumberOfFlats(key)
  let numSharps

  let scale = []

  // console.log("Key: " + key);

  if (numFlats != -1) {
    // console.log(numFlats + "b");

    let ascii = key.charCodeAt(0)

    for (let i = 0; i < 7; i++) {

      let newChar = String.fromCharCode(ascii);

      for (let j = 0; j <= numFlats; j++) {
        if (flatsOrder[j] == newChar) {
          newChar += FLAT
        }
      }
      // console.log(newChar);
      scale.push(newChar)

      ascii++
      // console.log(ascii);
      if (ascii > 103) {
        ascii = 97
      }

    }


  } else {
    numSharps = findNumberOfSharps(key)
    if (numSharps != -1) {
      let ascii = key.charCodeAt(0)

      for (let i = 0; i < 7; i++) {

        let newChar = String.fromCharCode(ascii);

        for (let j = 0; j <= numSharps; j++) {
          if (sharpsOrder[j] == newChar) {
            newChar += SHARP
          }
        }
        scale.push(newChar)

        ascii++
        // console.log(ascii);
        if (ascii > 103) {
          ascii = 97
        }

      }
    } else {
      console.log("Key not Found: ") + key;
    }
  }
  print(scale)
  return scale

}

function findNumberOfFlats(key) {
  let numOfFlats = -1
  for (let i = 0; i < flatsMajor.length; i++) {
    if (flatsMajor[i] == key) {
      //found
      numOfFlats = i
    }
  }
  return numOfFlats
}

function findNumberOfSharps(key) {
  let numOfSharps = -1
  for (let i = 0; i < sharpsMajor.length; i++) {
    if (sharpsMajor[i] == key) {
      //found
      numOfSharps = i
    }
  }

  return numOfSharps
}

function findKeyInKeyOrder(key) {
  let order = -1
  for (let i = 0; i < keyOrder.length; i++) {
    if (keyOrder[i] == key) {
      order = i
    }
  }
  return order
}

function transpose(fromKey, withInterval) {

  let newOrder = findKeyInKeyOrder(fromKey) + withInterval % 12
  if (newOrder < 0) {
    newOrder += 12
  }

  if (newOrder > 12) {
    newOrder -= 12
  }

  //  console.log(fromKey + "+" + withInterval + " -> " + keyOrder[newOrder])

  return keyOrder[newOrder]
}