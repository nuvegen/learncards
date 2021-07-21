var cards = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function getCard() {
    return cards[getRandomInt(cards.length)]
}

function getCardById(id) {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id == id) return cards[i];
    }
}

function refreshHTMLAnswers() {
    //Refresh the html rendering
    var html = document.getElementById('htmlAnswers');
    if (html) {
        for (var i = 0; i < html.childElementCount; i++) {
            var node = html.children[i].firstElementChild.lastElementChild;
            node.classList.remove("btn-outline-danger");
            node.classList.remove("btn-outline-success");
            node.classList.add("btn-outline-secondary");
        }
    }

}

function getAnswers(correctCard) {
    var aCards = [];
    // if less then 4 items is not enought
    if (cards.length < 4) {
        refreshHTMLAnswers();
        return cards;
    }

    // Get unique 4 answers
    aCards.push(correctCard);
    do {
        var newCard = cards[getRandomInt(cards.length)];
        var isNewCard = true;
        for (var i = 0; i < aCards.length; i++) {
            if (aCards[i].id == newCard.id) isNewCard = false;
        }
        if (isNewCard) {
            aCards.push(newCard);
        }
    } while (aCards.length < 4);


    // Sort the answers random
    for (var i = 0; i < aCards.length; i++) {
        aCards[i].randomID = getRandomInt(99);
    }
    aCards.sort((a, b) => (a.randomID > b.randomID) ? 1 : ((b.randomID > a.randomID) ? -1 : 0))


    refreshHTMLAnswers();
    return aCards;
}


function storeResult(question, correct) {

}

function getNextQuestion() {
    app.getQuestion();
}

function removeQuestion(id) {
    var _tempCards = cards;
    cards = [];
    for (var i = 0; i < _tempCards.length; i++) {
        if (_tempCards[i].id != id) {
            cards.push(_tempCards[i]);
        }
    }

    if (cards.length == 0) {
        app.success = true;
    }
}

function checkResults(question, answer, event) {
    var isCorrect = false;

    if (question == answer) {
        isCorrect = true;
    }
    var vCard = getCardById(question);
    if (vCard.correctid) {
        if(vCard.correctid.includes(answer)){
            isCorrect = true;
        }
    }

    if (isCorrect) {
        event.target.classList.remove("btn-outline-secondary");
        event.target.classList.add("btn-outline-success");
        storeResult(question, true);
        removeQuestion(question);
        setTimeout(function () { getNextQuestion(); }, 2000);
    } else {
        event.target.classList.remove("btn-outline-secondary");
        event.target.classList.add("btn-outline-danger");
        storeResult(question, false);
    }


}

var app = new Vue({
    el: '#app',
    data() {
        return {
            learnset: { folder: new URLSearchParams(document.location.search.substring(1)).get("id"), title: '', subtitle: '' },
            loading: true,
            failure: false,
            maxCards: 0,
            success: false,
            card:
            {
                id: "1",
                question: "Bite warten...",
                questionImage: "",
                answer: "...",
                answerImage: "",
            },
            answers: []
        }
    },
    mounted() {
        axios
            .get('/api/learnsets/' + this.learnset.folder + "/")
            .then(response => { cards = response.data; this.getQuestion() })
            .catch(error => { console.log(error); this.failure = true; })
            .finally(() => this.loading = false)
    },
    methods: {
        checkResult: this.checkResults,
        getQuestion: function () {
            this.maxCards = cards.length;
            this.card = getCard();
            this.answers = getAnswers(this.card);
        }
    }
});
