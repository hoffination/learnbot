const BRAIN = require('brain.js')
const PARSE = require('csv-parse')
const FS = require('fs')

const PATH = '/data/lotus.tsv'
const LEARNING_OPTIONS = {
    errorThresh: 0.005,
    iterations: 20000,
    log: true,
    logPeriod: 10,
    learningRate: 0.3
}
// INITIALIZE VARIABLES

let lotusNet = new BRAIN.NeuralNetwork()
let parser = PARSE({
        delimiter: '\t',
        columns: ['sepal length','sepal width','petal length','petal width','species'],
        auto_parse: true
    }, function(err, data){
        if (err) {
            console.error(err);
        }
        trainOnLotusData(data)
    }
);

// RUN LEARNING

FS.createReadStream(__dirname + PATH).pipe(parser)

// FUNCTIONS

function trainOnLotusData(data) {
    let learnableData = data.map(d => {
        let obj = {}
        let outputObj = {}
        outputObj[d.species] = 1
        obj.output = outputObj
        delete d.species
        obj.input = d
        return obj
    })

    let trainingResults = lotusNet.train(learnableData, LEARNING_OPTIONS)
    console.log(trainingResults + '\n')

    var output = lotusNet.run({
        'sepal length': 5.1,
        'sepal width': 3.5,
        'petal length': 1.4,
        'petal width': 0.2
    })

    console.log(output + '\n')

    // console.log(lotusNet.toJSON())
}