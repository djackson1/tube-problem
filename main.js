const fs = require("fs");

class Main {
  letterFrequencies () {
    let frequencies = {}
    let mostCommonLetterCount = 0
    
    this.requiredLetters.map(letter => {
      frequencies[letter] = 0
      this.stations.map(station => {
        if (station.includes(letter)){
          frequencies[letter]++

          // If our new frequency count is the greatest, update our max count
          if(frequencies[letter] > mostCommonLetterCount) mostCommonLetterCount = frequencies[letter]
        }
      })
    })

    // Scale which letters are most useful
    this.scaled = {}
    this.requiredLetters.map(letter => {
       // see if you can figure out why there is '- 0.01'
      this.scaled[letter] = 1 - ((frequencies[letter] - 0.01 ) / mostCommonLetterCount)
    })
  }


  stationWeightings () {
    // Array of {station, weight}
    this.stationsWeighted = []
    this.stations.map(station => {
      let weight = 0

      // If the letter is in the station name, add the weight
      this.requiredLetters.map(letter => {
        if(station.includes(letter)) {
          weight += this.scaled[letter]
        }
      })

      this.stationsWeighted.push({station, weight})
    })
  }

  addBestStation () {
    // Sort the stations by their weight
    const bestStation = Object.keys(this.stationsWeighted)
      .sort((s1, s2) => this.stationsWeighted[s2].weight - this.stationsWeighted[s1].weight)

    // This is the station with the highest weight
    const best = this.stationsWeighted[bestStation[0]]
    
    // Remove this station from our list
    this.stations = this.stations.filter(s => s !== best.station) // remove best station

    // Remove all letters from our 'required' from our station
    this.requiredLetters = this.requiredLetters.filter(l => {
      return !best.station.includes(l)
    })

    // self explanatory
    this.result.push(best.station)
  }

  async run () {
    // Setup
    this.stations = await fs.readFileSync('./underground_stations.csv', 'utf8').toLowerCase().split('\r\n')
    this.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    this.requiredLetters = this.alphabet

    // Object for our result
    this.result = []

    // Looooop
    while(this.requiredLetters.length > 0) {
      this.letterFrequencies()
      this.stationWeightings()
      this.addBestStation()
    }

    console.log(`Results: "${this.result.join(', ')}", ${this.result.length} stations.`)
  }
}

new Main().run()