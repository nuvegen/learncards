/*
var app = new Vue({ 
    el: '#app',
    data: {
        learnsets: [
            { folder: 'demo', title: 'Demo', subtitle: 'Ein Beispiel set'},
            { folder: 'anatomie1', title: 'Anatomie I', subtitle: 'Anatomie Lernset 1'}
        ]
    }
});
*/

var app = new Vue({
    el: '#app',
    data() {
        return {
            learnsets: null,
            loading: true,
            failure: false,
        }
    },
    mounted() {
        axios
            .get('/api/learnsets')
            .then(response => (this.learnsets = response.data))
            .catch(error => { console.log(error); this.failure = true; })
            .finally(() => this.loading = false)
    }

});
