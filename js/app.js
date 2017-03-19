(function() {
    "use strict";

    const gameModule = function() {
        const startBtn = document.querySelector('.start-btn');
        const playAgainBtn = document.querySelector('.play-again');
        const beginContainer = document.querySelector('.begin-container');
        const questionContainer = document.querySelector('.question-container');
        const resultsContainer = document.querySelector('.results-container');
        const loadingContainer = document.querySelector('.loading-container');
        const guessForm = document.querySelector('.guess-form');
        const loseWords = ['womp womp', 'duh', 'wrong', 'fml', 'epic fail', 'the worst', 'terrible', 'awful', "sadness", 'failure'];
        const winWords = ['get down', 'winner', 'sweet', 'omg', 'party', 'celebrate', 'lit', 'turnt', 'success', 'shocked'];
        let currentCountry = '';
        let countryHeadline = document.querySelector('.country-headline');
        let allCountriesArray = [];
        let correctAnswer = document.querySelector('.correct-answer');
        let resultText = document.querySelector('.result-text');
        let didWin = false;
        let giphyContainer = document.querySelector('.giphy-container');

        const loading = {
            show() {
                loadingContainer.classList.remove('is-hidden');
            },
            hide() {
                loadingContainer.classList.add('is-hidden');
            }
        };

        function bindEvents() {
            startBtn.addEventListener('click', () => {
                event.preventDefault();
                play();
            });
            guessForm.addEventListener('submit', () => {
                event.preventDefault();
                const guess = event.target[0].value;
                checkGuess(guess);
            });
            playAgainBtn.addEventListener('click', () => {
                event.preventDefault();
                clearAll();
                play();
            });
        }

        function checkGuess(guess) {
            if (guess.toLowerCase() === currentCountry.capital.toLowerCase()) {
                getGiphy('winner');
                didWin = true;
            } else {
                getGiphy('loser');
                didWin = false;
            }
        }

        function clearAll() {
            guessForm.reset();
            giphyContainer.innerHTML = '';
        }

        function displayResults(resultImg) {
            // display image
            let image = document.createElement('img');
            image.src = resultImg;
            giphyContainer.appendChild(image);

            image.addEventListener('load', () => {
                // show results container
                showContainer('results');
                loading.hide();
            });

            // display correct anwer
            correctAnswer.textContent = currentCountry.capital ? currentCountry.capital : 'Trick Question! No Capital.';

            // Update result text
            if (didWin) {
                resultText.textContent = 'Winner, winner, chicken dinner.';
            } else {
                resultText.textContent = 'Womp womp!';
            }
        }

        function getGiphy(result) {
            loading.show();
            const randNum = Math.floor(Math.random() * loseWords.length);
            const sourceWords = result === 'winner' ? winWords : loseWords;
            const searchTerm = encodeURIComponent(sourceWords[randNum]);

            const http = new XMLHttpRequest();

            http.onreadystatechange = function() {
                if (http.readyState === 4 && http.status === 200) {
                    const data = JSON.parse(http.response).data;
                    const newNum = Math.floor(Math.random() * data.length);
                    const resultImage = data[newNum].images.original.url;

                    displayResults(resultImage);
                }
            };

            http.open('GET', `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=dc6zaTOxFJmzC`, true);
            http.send();
        }

        function showContainer(activeScreen) {
            if (activeScreen === 'begin') {
                beginContainer.classList.remove('is-hidden');
                questionContainer.classList.add('is-hidden');
                resultsContainer.classList.add('is-hidden');
            } else if (activeScreen === 'play') {
                beginContainer.classList.add('is-hidden');
                questionContainer.classList.remove('is-hidden');
                resultsContainer.classList.add('is-hidden');
            } else if (activeScreen === 'results') {
                beginContainer.classList.add('is-hidden');
                questionContainer.classList.add('is-hidden');
                resultsContainer.classList.remove('is-hidden');
            } else {
                console.log("Whatchu talkin' 'bout, Vallyre!?");
            }
        }

        function filterCountries(countriesData) {
            const dataLength = countriesData.length;
            let tempObj = {};

            for (let index = 0; index < dataLength; index++) {
                tempObj = {};
                tempObj.name = countriesData[index].name;
                tempObj.capital = countriesData[index].capital;
                allCountriesArray.push(tempObj);
            }
        }

        function getRandomCountry() {
            const randNum = Math.floor(Math.random() * allCountriesArray.length);
            return allCountriesArray[randNum];
        }

        function loadCountries() {
            loading.show();
            const http = new XMLHttpRequest();

            http.onreadystatechange = function() {
                if (http.readyState === 4 && http.status === 200) {
                    const allCountries = JSON.parse(http.response);
                    filterCountries(allCountries);
                    loading.hide();
                } else if (http.readyState === 4 && http.status >= 300) {
                    console.log('Whoops!');
                }
            };

            http.open('GET', 'https://restcountries.eu/rest/v1/all', true);
            http.send();
        }

        function play() {
            // change the screen to play
            showContainer('play');

            // pick a random country
            currentCountry = getRandomCountry();
            console.log(currentCountry);

            // update display
            updateCountryHeadline();
        }

        function updateCountryHeadline() {
            countryHeadline.textContent = currentCountry.name;
        }

        function init() {
            loadCountries();
            bindEvents();
        }

        return {
            init: init
        };

    };

    const gameApp = gameModule();
    gameApp.init();

})();
