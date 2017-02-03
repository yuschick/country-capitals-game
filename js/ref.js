(function() {
    "use strict";
    const gameModule = function() {
        const allCountries = [];
        const beginScreen = document.querySelector('.begin-container');
        const questionScreen = document.querySelector('.question-container');
        const resultsScreen = document.querySelector('.results-container');
        const loadingScreen = document.querySelector('.loading-container');
        const startBtn = document.querySelector('.start-btn');
        const playAgainBtn = document.querySelector('.play-again');
        const guessForm = document.querySelector('.guess-form');
        const loseWords = ['womp', 'duh', 'wrong', 'fml', 'fail', 'the worst', 'terrible', 'awful', "sadness", ' depression'];
        const winWords = ['get down', 'winner', 'sweet', 'omg', 'party', 'celebrate', 'lit', 'turnt', 'success', 'shocked'];
        let currentCountry = null;
        let countryHeadline = document.querySelector('.country-headline');
        let correctAnswer = document.querySelector('.correct-answer');
        let resultText = document.querySelector('.result-text');
        let giphyContainer = document.querySelector('.giphy-container');

        const loading = {
            show() {
                loadingScreen.classList.remove('is-hidden');
            },
            hide() {
                loadingScreen.classList.add('is-hidden');
            }
        };

        function buildCountriesArray(data) {
            const length = data.length;
            for (let index = 0; index < length; index++) {
                let tempObj = {};
                tempObj.countryName = data[index].name;
                tempObj.capital = data[index].capital;
                allCountries.push(tempObj);
            }
        }

        function changeScreens(activeScreen) {
            if (activeScreen === 'begin') {
                beginScreen.classList.remove('is-hidden');
                questionScreen.classList.add('is-hidden');
                resultsScreen.classList.add('is-hidden');
            } else if (activeScreen === 'question') {
                beginScreen.classList.add('is-hidden');
                questionScreen.classList.remove('is-hidden');
                resultsScreen.classList.add('is-hidden');
            } else {
                beginScreen.classList.add('is-hidden');
                questionScreen.classList.add('is-hidden');
                resultsScreen.classList.remove('is-hidden');
            }
        }

        function checkGuess(guess) {
            if (currentCountry.capital === guess) {
                resultText.textContent = "Winner! Winner! Chicken Dinner!";
                getGiphy();
            } else {
                resultText.textContent = 'Womp. Womp.';
                getGiphy('lose');
            }
        }

        function clearAll() {
            guessForm.reset();
            correctAnswer.textContent = '';
            resultText.textContent = '';
            giphyContainer.innerHTML = '';
        }

        function displayResults(data) {

            correctAnswer.textContent = currentCountry.capital;

            let image = document.createElement('img');
            image.src = data.images.original.url;
            giphyContainer.appendChild(image);

            image.addEventListener('load', function() {
                changeScreens('results');
                loading.hide();
            });

        }

        function getCountries() {
            const http = new XMLHttpRequest();
            http.onreadystatechange = function() {
                if (http.readyState === 4 && http.status === 200) {
                    const data = JSON.parse(http.response);
                    buildCountriesArray(data);
                    loading.hide();
                    startBtn.addEventListener('click', () => {
                        play();
                    });
                }
            };
            http.open('GET', 'https://restcountries.eu/rest/v1/all', true);
            http.send();
        }

        function getGiphy(type = 'win') {
            const num = Math.floor(Math.random() * 9);
            const targetWords = type !== 'win' ? loseWords : winWords;
            loading.show();

            const http = new XMLHttpRequest();
            http.onreadystatechange = function() {
                if (http.readyState === 4 && http.status === 200) {
                    const data = JSON.parse(http.response).data;
                    const i = Math.floor(Math.random() * data.length);
                    displayResults(data[i]);
                }
            };
            http.open('GET', `http://api.giphy.com/v1/gifs/search?q=${targetWords[num]}&api_key=dc6zaTOxFJmzC`, true);
            http.send();
        }

        function getRandomCountry() {
            const num = Math.floor(Math.random() * allCountries.length);
            return allCountries[num];
        }

        function play() {
            changeScreens('question');
            currentCountry = getRandomCountry();
            updateDisplay(currentCountry.countryName);
            console.clear();
            console.log(currentCountry);
        }

        function setupForm() {
            guessForm.addEventListener('submit', () => {
                event.preventDefault();
                const guess = event.target[0].value;

                checkGuess(guess);
            });
        }

        function updateDisplay(countryName) {
            countryHeadline.textContent = countryName;
        }

        function init() {
            changeScreens('begin');
            getCountries();
            setupForm();

            playAgainBtn.addEventListener('click', () => {
                clearAll();
                play();
            });
        }

        return {
            begin: init,
            play: play
        };
    };

    const game = gameModule();
    game.begin();
})();
