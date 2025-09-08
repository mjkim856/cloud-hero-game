/**
 * Cloud Hero JavaScript – English version with language selector
 */

class CloudHeroGame {
    constructor() {
        this.apiBaseUrl = '/api';
        this.lang = 'en';

        this.sessionId       = null;
        this.currentQuestion = null;
        this.lastResult      = null;
        this.isGameCompleted = false;

        console.log('🎮 init – English');
        this.initializeElements();
        this.bindEvents();
        this.showWelcomeScreen();
    }

    /* ------------------------------------------------------------------ */
    /*  UI references                                                     */
    /* ------------------------------------------------------------------ */
    initializeElements() {
        this.screens = {
            welcome : document.getElementById('welcome-screen'),
            game    : document.getElementById('game-screen'),
            result  : document.getElementById('result-screen'),
            ending  : document.getElementById('ending-screen')
        };

        this.elements = {
            playerNameInput : document.getElementById('player-name'),
            startGameBtn    : document.getElementById('start-game'),
            currentPlayer   : document.getElementById('current-player'),
            currentScore    : document.getElementById('current-score'),
            progressText    : document.getElementById('progress-text'),
            progressFill    : document.getElementById('progress-fill'),
            questionAscii   : document.getElementById('question-ascii'),
            scenarioText    : document.getElementById('scenario-text'),
            choicesContainer: document.getElementById('choices-container'),
            loading         : document.getElementById('loading'),
            resultHeader    : document.getElementById('result-header'),
            selectedAnswer  : document.getElementById('selected-answer'),
            correctAnswer   : document.getElementById('correct-answer'),
            explanationText : document.getElementById('explanation-text'),
            referenceUrl    : document.getElementById('reference-url'),
            nextQuestionBtn : document.getElementById('next-question'),
            endingAscii     : document.getElementById('ending-ascii'),
            finalScore      : document.getElementById('final-score'),
            accuracyRate    : document.getElementById('accuracy-rate'),
            correctCount    : document.getElementById('correct-count'),
            restartGameBtn  : document.getElementById('restart-game'),
            errorMessage    : document.getElementById('error-message'),
            errorText       : document.getElementById('error-text'),
            errorCloseBtn   : document.getElementById('error-close'),
            langSwitch      : document.getElementById('lang-switch')
        };
        
        // DOM 요소 존재 확인
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.warn(`Missing DOM element: ${key}`);
            }
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Events                                                            */
    /* ------------------------------------------------------------------ */
    bindEvents() {
        this.elements.startGameBtn.addEventListener('click', () => this.startGame());
        this.elements.playerNameInput.addEventListener('keypress', e => e.key === 'Enter' && this.startGame());
        this.elements.nextQuestionBtn.addEventListener('click', e => { e.preventDefault(); this.loadNextQuestion(); });
        this.elements.restartGameBtn.addEventListener('click', () => this.restartGame());
        this.elements.errorCloseBtn.addEventListener('click', () => this.hideError());

        // language selector at top‑right (both htmls share same id)
        if (this.elements.langSwitch) {
            this.elements.langSwitch.value = this.lang;
            this.elements.langSwitch.addEventListener('change', e => {
                const targetLang = this.sanitizeInput(e.target.value);
                if (['ko', 'en'].includes(targetLang)) {
                    location.href = '/?lang=' + encodeURIComponent(targetLang);
                }
            });
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Welcome                                                           */
    /* ------------------------------------------------------------------ */
    showWelcomeScreen() {
        this.hideAllScreens();
        this.screens.welcome.classList.add('active');
        this.displayWelcomeAscii();
        this.elements.playerNameInput.focus();
    }

    displayWelcomeAscii() {
        const welcomeAscii = [
            "╔════════════════════════════════════╗",
            "║              🗡️  🛡️  🗡️             ║",
            "║          CLOUD HERO GAME           ║",
            "╚════════════════════════════════════╝",
            "",
            "    .-~~~-.     .-~~~-.     .-~~~-.   ",
            "   /       \\   /       \\   /       \\  ",
            "  |   AWS   | |  QUIZ   | | ADVENTURE|",
            "   \\       /   \\       /   \\       /  ",
            "    '~~~~~'     '~~~~~'     '~~~~~'   ",
            "",
            "   A crisis has occurred in the world of CLOUDS!",
            "        The power of a HERO is needed!",
            "",
            "    /\\   /\\",
            "   (  . .)  ",
            "    )   (   ",
            "   (  v  )  ",
            "  ^^  |  ^^ ",
            "     /|\\    ",
            "    / | \\   ",
            "   /  |  \\  "
        ];
        document.getElementById('welcome-ascii').textContent = welcomeAscii.join('\n');
    }

    /* ------------------------------------------------------------------ */
    /*  API helpers                                                       */
    /* ------------------------------------------------------------------ */
 
    async startGame() {
        const playerName = this.elements.playerNameInput.value.trim() || 'Hero';
        console.log('🚀 Game Start:', playerName);
        
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/game/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player_name: playerName, lang: this.lang })
            });

            if (!response.ok) {
                throw new Error(`Failed to start game: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Game start');
            
            this.sessionId = data.session_id;
            this.elements.currentPlayer.textContent = data.player_name;
            
            this.hideLoading();
            this.showGameScreen();
            this.loadQuestion();
            
        } catch (error) {
            this.hideLoading();
            console.error('Game start error:', error);
            this.showError('Failed to start game. Please try again.');
        }
    }

    showGameScreen() {
        this.hideAllScreens();
        this.screens.game.classList.add('active');
    }

    async loadQuestion() {
        
        if (!this.sessionId) {
            // console.error('❌ No Session Id!');
            this.showError('Your session has expired. Please restart the game.');
            return;
        }
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBaseUrl}/game/question/${this.sessionId}`);  
            if (!response.ok) {
                throw new Error('Failed to load the question.');
            }
            const data = await response.json();
            
            if (data.game_completed) {
                this.hideLoading();
                this.showEndingScreen(data);
                return;
            }
            this.currentQuestion = data.question;
            this.displayQuestion(data);
            this.hideLoading(); 
        } catch (error) {
            this.hideLoading();
            console.error('Load question error:', error);
            this.showError('Failed to load question. Please try again.');
        }
    }

    displayQuestion(responseData) {
        const questionData = responseData.question;
        this.currentQuestion = questionData;
        const progress = responseData.progress;
        
        if (!questionData) {
            this.showError('Load question error');
            return;
        }

        const progressPercent = (progress.current / progress.total) * 100;
        this.elements.progressFill.style.width = `${progressPercent}%`;
        this.elements.progressText.textContent = `${progress.current}/${progress.total}`;

        if (questionData.ascii_scene && Array.isArray(questionData.ascii_scene)) {
            this.elements.questionAscii.textContent = questionData.ascii_scene.join('\n');
        } else if (questionData.ascii_art && Array.isArray(questionData.ascii_art)) {
            this.elements.questionAscii.textContent = questionData.ascii_art.join('\n');
        } 

        this.elements.scenarioText.textContent = questionData.scenario || 'Loading...';
        this.createChoices(questionData.choices);
    }

    createChoices(choices) {

        if (!choices || !Array.isArray(choices) || choices.length === 0) {
            console.warn('⚠️ Unable to load choices:', choices);
            this.elements.choicesContainer.innerHTML = '<p class="error-message">Unable to load choices.</p>';
            return;
        }
        
        this.elements.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = this.sanitizeInput(choice);
            button.setAttribute('data-index', index + 1);
            
            button.addEventListener('click', () => {
                this.selectChoice(index, button);
            });
            
            this.elements.choicesContainer.appendChild(button);
        });
    }

    selectChoice(answerIndex, buttonElement) {

        this.elements.choicesContainer.querySelectorAll('.choice-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        buttonElement.classList.add('selected');
        
        setTimeout(() => {
            this.submitAnswer(answerIndex);
        }, 500);
    }

    async submitAnswer(selectedAnswer) {
        
        if (!this.sessionId) {
            this.showError('Your session has expired. Please restart the game.');
            return;
        }
        
        try {
            this.showLoading();
            
            const requestData = {
                session_id: this.sessionId,
                selected_answer: selectedAnswer,
                answer: selectedAnswer  // 백엔드 호환성을 위해 두 필드 모두 전송
            };

            const response = await fetch(`${this.apiBaseUrl}/game/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Submit error: (${response.status})`);
            }

            const result = await response.json();
            this.lastResult = result;

            this.hideLoading();
            this.isGameCompleted = result.game_completed;      // ← 플래그 저장
            this.showResult(result, selectedAnswer);           // 결과 화면만 보여줌
            
        } catch (error) {
            this.hideLoading();
            this.showError('Submit error: ' + error.message);
        }
    }

    showResult(result, selectedAnswerIndex) {
        this.hideAllScreens();
        this.screens.result.classList.add('active');

        // 결과 헤더
        const isCorrect = result.is_correct;
        this.elements.resultHeader.textContent = isCorrect ? '🎉 Correct!' : '❌ Wrong!';
        this.elements.resultHeader.className = `result-header ${isCorrect ? 'correct' : 'incorrect'}`;

        // 답안 정보 (XSS 방지)
        this.elements.selectedAnswer.textContent = this.sanitizeInput(result.selected_choice);
        if (this.currentQuestion?.choices && result.correct_answer < this.currentQuestion.choices.length) {
            this.elements.correctAnswer.textContent = this.sanitizeInput(this.currentQuestion.choices[result.correct_answer]);
        }

        // 설명 (XSS 방지)
        this.elements.explanationText.textContent = this.sanitizeInput(result.explanation);
        if (result.reference_url && this.isValidUrl(result.reference_url)) {
            this.elements.referenceUrl.href = result.reference_url;
        }

        // 점수 업데이트
        this.elements.currentScore.textContent = result.current_score;

        // 마지막 문제라면 버튼 문구 변경
        if (this.isGameCompleted) {
            this.elements.nextQuestionBtn.textContent = 'View Ending';
        } else {
            this.elements.nextQuestionBtn.textContent = 'Next Question';
        }
    }

    async loadNextQuestion() {
        this.hideAllScreens();
        this.screens.game.classList.add('active');

        if (this.isGameCompleted) {
            await this.showEndingScreen(this.lastResult);   
            return;
        }
        
        await this.loadQuestion();
    }

    async showEndingScreen(gameData = null) {
        this.hideAllScreens();
        this.screens.ending.classList.add('active');

        if (gameData && Array.isArray(gameData.ending_message)) {
            const sanitizedMessage = gameData.ending_message.map(line => this.sanitizeInput(line)).join('\n');
            this.elements.endingAscii.textContent = sanitizedMessage;
        } 

        if (gameData) {
            this.elements.finalScore.textContent = gameData.final_score;
            this.elements.correctCount.textContent = `${gameData.correct_answers}/${gameData.total_questions}`;
            
            const accuracy = gameData.total_questions > 0 ? 
                Math.round((gameData.correct_answers / gameData.total_questions) * 100) : 0;
            this.elements.accuracyRate.textContent = `${accuracy}%`;
        }
    }

    async restartGame() {
        this.sessionId = null;
        this.currentQuestion = null;
        this.elements.currentScore.textContent = '0';
        this.elements.progressFill.style.width = '0%';
        this.elements.progressText.textContent = '0/10';
        this.showWelcomeScreen();
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    showError(message) {
        console.error('🚨 Error:', message);
        if (this.elements.errorText && this.elements.errorMessage) {
            this.elements.errorText.textContent = this.sanitizeInput(message);
            this.elements.errorMessage.classList.remove('hidden');
        }
    }

    hideError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.add('hidden');
        }
    }

    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    // 보안 헬퍼 메서드들
    sanitizeInput(input) {
        if (typeof input !== 'string') return String(input || '');
        return input.replace(/[<>"'&]/g, (match) => {
            const map = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return map[match];
        });
    }
    
    isValidUrl(string) {
        try {
            const url = new URL(string);
            return ['http:', 'https:'].includes(url.protocol);
        } catch {
            return false;
        }
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CloudHeroGame();
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage && !errorMessage.classList.contains('hidden')) {
            window.game?.hideError();
        }
    }
});
