const util = require('./util');

(function() {
  "use strict";

  const gameModule = function() {
    const startBtn = document.querySelector('.start-btn');
    const playAgainBtn = document.querySelector('.play-again');
    const beginContainer = document.querySelector('.begin-container');
    const questionContainer = document.querySelector('.question-container');
    const resultsContainer = document.querySelector('.results-container');
    const loadingContainer = document.querySelector('.loading-container');
    const scoreDisplay = document.querySelector('.score');
    const clearBtn = document.querySelector('.clear-score');
    const guessBox = document.getElementById('capital-guess');
    const guessForm = document.querySelector('.guess-form');
    const loseWords = ['womp womp', 'duh', 'wrong', 'fml', 'idiot', 'dumbass', 'terrible', 'awful', "sadness", 'failure'];
    const winWords = ['get down', 'winner', 'sweet', 'omg', 'party', 'celebrate', 'lit', 'hype', 'success', 'chicken dinner'];
    let currentCountry = '';
    let allCountriesArray = [];
    let didWin = false;
    let countryHeadline = document.querySelector('.country-headline');
    let correctAnswer = document.querySelector('.correct-answer');
    let resultText = document.querySelector('.result-text');
    let giphyContainer = document.querySelector('.giphy-container');
    let scoreObj = util.localStorage.get('capitalScore') || {
      correct: 0,
      total: 0
    };

    const scoreKeeper = {
      display() {
        scoreDisplay.textContent = `${scoreObj.correct}/${scoreObj.total}`;
        if (scoreObj.total > 0) {
          clearBtn.classList.remove('is-hidden');
        } else {
          clearBtn.classList.add('is-hidden');
        }
      },

      update(correct) {
        scoreObj.total++;
        if (correct) scoreObj.correct++;
      },
      reset() {
        scoreObj = {
          correct: 0,
          total: 0
        };
      },
      store() {
        util.localStorage.set('capitalScore', scoreObj);
      }
    }

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
      clearBtn.addEventListener('click', () => {
        clearScore();
      });
    }

    function checkGuess(guess) {
      if (cleanCharacters(guess) === cleanCharacters(currentCountry.capital)) {
        getGiphy();
        didWin = true;
        scoreKeeper.update(didWin);
        scoreKeeper.display();
      } else {
        getGiphy('loser');
        didWin = false;
        scoreKeeper.update(didWin);
        scoreKeeper.display();
      }
      scoreKeeper.store();
    }

    function clearAll() {
      guessForm.reset();
      giphyContainer.innerHTML = '';
    }

    function clearScore() {
      util.localStorage.clear('capitalScore');
      scoreKeeper.reset();
      scoreKeeper.display();
    }

    function cleanCharacters(string) {
      return String(string)
        .toLowerCase()
        .replace(new RegExp("[àáâãäå]", 'g'), "a")
        .replace(new RegExp("æ", 'g'), "ae")
        .replace(new RegExp("ç", 'g'), "c")
        .replace(new RegExp("[èéêë]", 'g'), "e")
        .replace(new RegExp("[ìíîï]", 'g'), "i")
        .replace(new RegExp("ñ", 'g'), "n")
        .replace(new RegExp("[òóôõö]", 'g'), "o")
        .replace(new RegExp("œ", 'g'), "oe")
        .replace(new RegExp("[ùúûü]", 'g'), "u")
        .replace(new RegExp("[ýÿ]", 'g'), "y")
        .replace(/,/g, "")
        .replace(/-/g, "");
      // Replace taken & modified from: http://stackoverflow.com/a/990922/544847
    }

    function displayResults(resultImg) {
      let image = document.createElement('img');
      image.src = resultImg;
      giphyContainer.appendChild(image);

      image.addEventListener('load', () => {
        showContainer('results');
        loading.hide();
      });

      correctAnswer.textContent = currentCountry.capital ? currentCountry.capital : 'Trick Question! No Capital.';

      if (didWin) {
        resultText.textContent = 'Winner, winner, chicken dinner.';
      } else {
        resultText.textContent = 'Womp womp!';
      }
    }

    function getGiphy(result = 'winner') {
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
        guessBox.focus();
      } else if (activeScreen === 'results') {
        beginContainer.classList.add('is-hidden');
        questionContainer.classList.add('is-hidden');
        resultsContainer.classList.remove('is-hidden');
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
      showContainer('play');

      currentCountry = getRandomCountry();
      console.log(currentCountry);

      updateCountryHeadline();
    }

    function updateCountryHeadline() {
      countryHeadline.textContent = currentCountry.name;
    }

    function init() {
      loadCountries();
      bindEvents();
      scoreKeeper.display();
    }

    return {
      init: init
    };

  };

  const gameApp = gameModule();
  gameApp.init();

})();
