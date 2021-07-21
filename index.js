const express = require('express')
const app = express()
const port = 3000

const StormDB = require("stormdb");
const fs = require('fs')




app.use(express.static('public'));


app.get("/api/learnsets", (req, res) => {
  const sets = [
    { folder: 'demo', title: 'Demo', subtitle: 'Ein Beispiel set' },
    { folder: 'anatomie1', title: 'Anatomie I', subtitle: 'Anatomie Lernset 1' }
  ]
  res.json(sets);
})

app.get("/api/learnsets/:id", (req, res) => {
  var filename = req.params.id.replace(/[^a-zA-Z0-9]/g, '');
  if (filename.length < 1)return;
  var dbFileName = "./public/cards/" + filename + "_db.json";
  if (!fs.existsSync(dbFileName) ) {
    res.json( { "error": "set not found"} );
    return;
  }

  const engine = new StormDB.localFileEngine(dbFileName);
  const db = new StormDB(engine);

  db.default({ sets: [{
    id: "1",
    question: "Fangfrage",
    questionImage: "",
    answer: "Antwort",
    answerImage: ""
  }] });


  const sets = db.get("sets").value();
  res.json(sets);
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


