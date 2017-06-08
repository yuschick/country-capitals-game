/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(1);

	(function () {
	  "use strict";

	  var gameModule = function gameModule() {
	    var startBtn = document.querySelector('.start-btn');
	    var playAgainBtn = document.querySelector('.play-again');
	    var beginContainer = document.querySelector('.begin-container');
	    var questionContainer = document.querySelector('.question-container');
	    var resultsContainer = document.querySelector('.results-container');
	    var loadingContainer = document.querySelector('.loading-container');
	    var scoreDisplay = document.querySelector('.score');
	    var clearBtn = document.querySelector('.clear-score');
	    var guessBox = document.getElementById('capital-guess');
	    var guessForm = document.querySelector('.guess-form');
	    var loseWords = ['womp womp', 'duh', 'wrong', 'fml', 'idiot', 'dumbass', 'terrible', 'awful', "sadness", 'failure'];
	    var winWords = ['get down', 'winner', 'sweet', 'omg', 'party', 'celebrate', 'lit', 'hype', 'success', 'chicken dinner'];
	    var currentCountry = '';
	    var allCountriesArray = [];
	    var didWin = false;
	    var countryHeadline = document.querySelector('.country-headline');
	    var correctAnswer = document.querySelector('.correct-answer');
	    var resultText = document.querySelector('.result-text');
	    var giphyContainer = document.querySelector('.giphy-container');
	    var scoreObj = util.localStorage.get('capitalScore') || {
	      correct: 0,
	      total: 0
	    };

	    var scoreKeeper = {
	      display: function display() {
	        scoreDisplay.textContent = scoreObj.correct + '/' + scoreObj.total;
	        if (scoreObj.total > 0) {
	          clearBtn.classList.remove('is-hidden');
	        } else {
	          clearBtn.classList.add('is-hidden');
	        }
	      },
	      update: function update(correct) {
	        scoreObj.total++;
	        if (correct) scoreObj.correct++;
	      },
	      reset: function reset() {
	        scoreObj = {
	          correct: 0,
	          total: 0
	        };
	      },
	      store: function store() {
	        util.localStorage.set('capitalScore', scoreObj);
	      }
	    };

	    var loading = {
	      show: function show() {
	        loadingContainer.classList.remove('is-hidden');
	      },
	      hide: function hide() {
	        loadingContainer.classList.add('is-hidden');
	      }
	    };

	    function bindEvents() {
	      startBtn.addEventListener('click', function () {
	        event.preventDefault();
	        play();
	      });
	      guessForm.addEventListener('submit', function () {
	        event.preventDefault();
	        var guess = event.target[0].value;
	        checkGuess(guess);
	      });
	      playAgainBtn.addEventListener('click', function () {
	        event.preventDefault();
	        clearAll();
	        play();
	      });
	      clearBtn.addEventListener('click', function () {
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
	      return String(string).toLowerCase().replace(new RegExp("[àáâãäå]", 'g'), "a").replace(new RegExp("æ", 'g'), "ae").replace(new RegExp("ç", 'g'), "c").replace(new RegExp("[èéêë]", 'g'), "e").replace(new RegExp("[ìíîï]", 'g'), "i").replace(new RegExp("ñ", 'g'), "n").replace(new RegExp("[òóôõö]", 'g'), "o").replace(new RegExp("œ", 'g'), "oe").replace(new RegExp("[ùúûü]", 'g'), "u").replace(new RegExp("[ýÿ]", 'g'), "y").replace(/,/g, "").replace(/-/g, "");
	      // Replace taken & modified from: http://stackoverflow.com/a/990922/544847
	    }

	    function displayResults(resultImg) {
	      var image = document.createElement('img');
	      image.src = resultImg;
	      giphyContainer.appendChild(image);

	      image.addEventListener('load', function () {
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

	    function getGiphy() {
	      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'winner';

	      loading.show();
	      var randNum = Math.floor(Math.random() * loseWords.length);
	      var sourceWords = result === 'winner' ? winWords : loseWords;
	      var searchTerm = encodeURIComponent(sourceWords[randNum]);

	      var http = new XMLHttpRequest();

	      http.onreadystatechange = function () {
	        if (http.readyState === 4 && http.status === 200) {
	          var data = JSON.parse(http.response).data;
	          var newNum = Math.floor(Math.random() * data.length);
	          var resultImage = data[newNum].images.original.url;

	          displayResults(resultImage);
	        }
	      };

	      http.open('GET', 'https://api.giphy.com/v1/gifs/search?q=' + searchTerm + '&api_key=dc6zaTOxFJmzC', true);
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
	      var dataLength = countriesData.length;
	      var tempObj = {};

	      for (var index = 0; index < dataLength; index++) {
	        tempObj = {};
	        tempObj.name = countriesData[index].name;
	        tempObj.capital = countriesData[index].capital;
	        allCountriesArray.push(tempObj);
	      }
	    }

	    function getRandomCountry() {
	      var randNum = Math.floor(Math.random() * allCountriesArray.length);
	      return allCountriesArray[randNum];
	    }

	    function loadCountries() {
	      loading.show();
	      var http = new XMLHttpRequest();

	      http.onreadystatechange = function () {
	        if (http.readyState === 4 && http.status === 200) {
	          var allCountries = JSON.parse(http.response);
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

	  var gameApp = gameModule();
	  gameApp.init();
	})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = {
	  localStorage: {
	    set: function set(prop, value) {
	      localStorage.setItem(prop, JSON.stringify(value));
	    },
	    get: function get(prop) {
	      var data = localStorage[prop] === undefined ? false : JSON.parse(localStorage[prop]);
	      return data;
	    },
	    clear: function clear(prop) {
	      localStorage.removeItem(prop);
	      console.log(prop + " cleared from localStorage.");
	    }
	  }
	};

/***/ })
/******/ ]);