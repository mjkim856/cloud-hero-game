/**
 * 클라우드 용사 게임 JavaScript (다국어 지원 버전)
 */

class CloudHeroGame {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';  // 포트 5001로 변경
        this.sessionId = null;
        this.currentQuestion = null;
        this.gameData = null;
        
        console.log('🎮 클라우드 용사 게임 초기화 (다국어 지원 버전)');
        
        // 언어 설정 초기화
        loadSavedLanguage();
        
        this.initializeElements();
        this.bindEvents();
        this.showLanguageScreen();
    }

    initializeElements() {
        console.log('📋 UI 요소 초기화');
        // 화면 요소들
        this.screens = {
            language: document.getElementById('language-screen'),
            welcome: document.getElementById('welcome-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen'),
            ending: document.getElementById('ending-screen')
        };

        // 입력 요소들
        this.elements = {
            // 언어 선택 요소들
            selectKoreanBtn: document.getElementById('select-korean'),
            selectEnglishBtn: document.getElementById('select-english'),
            
            playerNameInput: document.getElementById('player-name'),
            startGameBtn: document.getElementById('start-game'),
            currentPlayer: document.getElementById('current-player'),
            currentScore: document.getElementById('current-score'),
            progressText: document.getElementById('progress-text'),
            progressFill: document.getElementById('progress-fill'),
            questionAscii: document.getElementById('question-ascii'),
            scenarioText: document.getElementById('scenario-text'),
            choicesContainer: document.getElementById('choices-container'),
            loading: document.getElementById('loading'),
            resultHeader: document.getElementById('result-header'),
            selectedAnswer: document.getElementById('selected-answer'),
            correctAnswer: document.getElementById('correct-answer'),
            explanationText: document.getElementById('explanation-text'),
            referenceUrl: document.getElementById('reference-url'),
            nextQuestionBtn: document.getElementById('next-question'),
            endingAscii: document.getElementById('ending-ascii'),
            finalScore: document.getElementById('final-score'),
            accuracyRate: document.getElementById('accuracy-rate'),
            correctCount: document.getElementById('correct-count'),
            restartGameBtn: document.getElementById('restart-game'),
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            errorCloseBtn: document.getElementById('error-close')
        };
    }

    bindEvents() {
        console.log('🔗 이벤트 바인딩');
        
        // 언어 선택
        this.elements.selectKoreanBtn.addEventListener('click', () => this.selectLanguage('ko'));
        this.elements.selectEnglishBtn.addEventListener('click', () => this.selectLanguage('en'));
        
        // 게임 시작
        this.elements.startGameBtn.addEventListener('click', () => this.startGame());
        this.elements.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // 게임 진행
        this.elements.nextQuestionBtn.addEventListener('click', () => this.loadNextQuestion());

        // 게임 완료 후 액션
        this.elements.restartGameBtn.addEventListener('click', () => this.restartGame());

        // 에러 처리
        this.elements.errorCloseBtn.addEventListener('click', () => this.hideError());
    }

    // 언어 선택 화면 표시
    showLanguageScreen() {
        console.log('🌐 언어 선택 화면 표시');
        this.hideAllScreens();
        this.screens.language.classList.add('active');
        this.displayLanguageAscii();
        this.updateBanner();
        updateLanguageSelectTexts();
    }

    // 언어 선택
    selectLanguage(lang) {
        console.log(`🌐 언어 선택: ${lang}`);
        setLanguage(lang);
        this.updateBanner();
        this.showWelcomeScreen();
    }

    // 배너 텍스트 업데이트
    updateBanner() {
        const banner = document.getElementById('main-banner');
        if (banner) {
            banner.textContent = currentLanguage === 'ko' ? 
                '✨ 다국어 지원 버전 - 한국어/English 선택 가능! ✨' :
                '✨ Multilingual Version - Korean/English Available! ✨';
        }
    }

    // 언어 선택 화면 ASCII 아트
    displayLanguageAscii() {
        const ascii = `
    ╔═══════════════════════════════════════════════════════════════╗
    ║  ██████╗██╗      ██████╗ ██╗   ██╗██████╗     ██╗  ██╗███████╗║
    ║ ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗    ██║  ██║██╔════╝║
    ║ ██║     ██║     ██║   ██║██║   ██║██║  ██║    ███████║█████╗  ║
    ║ ██║     ██║     ██║   ██║██║   ██║██║  ██║    ██╔══██║██╔══╝  ║
    ║ ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝    ██║  ██║███████╗║
    ║  ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝║
    ║                                                                 ║
    ║    ██████╗  █████╗ ███╗   ███╗███████╗                        ║
    ║   ██╔════╝ ██╔══██╗████╗ ████║██╔════╝                        ║
    ║   ██║  ███╗███████║██╔████╔██║█████╗                          ║
    ║   ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝                          ║
    ║   ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗                        ║
    ║    ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝                        ║
    ╚═══════════════════════════════════════════════════════════════╝
        `;
        
        const languageAscii = document.getElementById('language-ascii');
        if (languageAscii) {
            languageAscii.textContent = ascii;
        }
    }

    showWelcomeScreen() {
        console.log('🏠 환영 화면 표시');
        this.hideAllScreens();
        this.screens.welcome.classList.add('active');
        this.displayWelcomeAscii();
        this.updateWelcomeTexts();
        this.elements.playerNameInput.focus();
    }

    updateWelcomeTexts() {
        // 플레이스홀더와 버튼 텍스트 업데이트
        if (currentLanguage === 'en') {
            this.elements.playerNameInput.placeholder = "Enter name and press Enter";
            this.elements.startGameBtn.innerHTML = "🚀 Start Personalized Adventure";
            this.elements.playerNameInput.value = "CloudMaster";
        } else {
            this.elements.playerNameInput.placeholder = "이름을 입력하고 Enter를 누르세요";
            this.elements.startGameBtn.innerHTML = "🚀 개인화된 모험 시작";
            this.elements.playerNameInput.value = "클라우드마스터";
        }
        updateWelcomeTexts();
    }

    displayWelcomeAscii() {
        const ascii = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║   ██████╗██╗      ██████╗ ██╗   ██╗██████╗     ██╗  ██╗███████╗██████╗   ║
    ║  ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗    ██║  ██║██╔════╝██╔══██╗  ║
    ║  ██║     ██║     ██║   ██║██║   ██║██║  ██║    ███████║█████╗  ██████╔╝  ║
    ║  ██║     ██║     ██║   ██║██║   ██║██║  ██║    ██╔══██║██╔══╝  ██╔══██╗  ║
    ║  ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝    ██║  ██║███████╗██║  ██║  ║
    ║   ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝  ║
    ║                                                                            ║
    ║                    ⚡ AWS 클라우드 모험이 시작됩니다! ⚡                    ║
    ╚══════════════════════════════════════════════════════════════════════════╝
        `;
        
        const welcomeAscii = document.getElementById('welcome-ascii');
        if (welcomeAscii) {
            welcomeAscii.textContent = ascii;
        }
    }

    async startGame() {
        const playerName = this.elements.playerNameInput.value.trim();
        if (!playerName) {
            const message = currentLanguage === 'ko' ? 
                '플레이어 이름을 입력해주세요!' : 
                'Please enter your player name!';
            alert(message);
            return;
        }

        console.log(`🚀 게임 시작: ${playerName}`);
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/game/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player_name: playerName
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ 게임 시작 성공:', data);
            
            this.sessionId = data.session_id;
            this.elements.currentPlayer.textContent = data.player_name;
            
            this.hideLoading();
            this.showGameScreen();
            this.loadQuestion();
            
        } catch (error) {
            console.error('❌ 게임 시작 실패:', error);
            this.hideLoading();
            this.showError(currentLanguage === 'ko' ? 
                '게임 시작 중 오류가 발생했습니다: ' + error.message :
                'Error starting game: ' + error.message);
        }
    }

    showGameScreen() {
        console.log('🎮 게임 화면 표시');
        this.hideAllScreens();
        this.screens.game.classList.add('active');
        updateGameTexts();
    }

    async loadQuestion() {
        console.log('❓ 문제 로딩');
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/game/question/${this.sessionId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ 문제 로딩 성공:', data);
            
            this.currentQuestion = data.question;
            this.displayQuestion(data.question);
            this.updateProgress(data.progress);
            this.hideLoading();
            
        } catch (error) {
            console.error('❌ 문제 로딩 실패:', error);
            this.hideLoading();
            this.showError(currentLanguage === 'ko' ? 
                '문제 로딩 중 오류가 발생했습니다: ' + error.message :
                'Error loading question: ' + error.message);
        }
    }

    displayQuestion(question) {
        console.log('📝 문제 표시:', question.scenario);
        
        // ASCII 아트 표시
        this.elements.questionAscii.textContent = question.ascii_art;
        
        // 시나리오 텍스트 표시
        this.elements.scenarioText.textContent = question.scenario;
        
        // 선택지 표시
        this.displayChoices(question.choices);
    }

    displayChoices(choices) {
        console.log('📋 선택지 표시');
        this.elements.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = `${index + 1}. ${choice}`;
            button.addEventListener('click', () => this.selectAnswer(index));
            this.elements.choicesContainer.appendChild(button);
        });
    }

    updateProgress(progress) {
        console.log('📊 진행률 업데이트:', progress);
        this.elements.progressText.textContent = `${progress.current}/${progress.total}`;
        this.elements.progressFill.style.width = `${(progress.current / progress.total) * 100}%`;
    }

    async selectAnswer(answerIndex) {
        console.log(`✅ 답안 선택: ${answerIndex}`);
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/game/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    answer: answerIndex
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ 답안 제출 성공:', result);
            
            this.hideLoading();
            
            if (result.game_completed) {
                this.showEndingScreen(result);
            } else {
                this.showResult(result, answerIndex);
            }
            
        } catch (error) {
            console.error('❌ 답안 제출 실패:', error);
            this.hideLoading();
            this.showError(currentLanguage === 'ko' ? 
                '답안 제출 중 오류가 발생했습니다: ' + error.message :
                'Error submitting answer: ' + error.message);
        }
    }

    showResult(result, selectedAnswerIndex) {
        console.log('📊 결과 표시:', result);
        this.hideAllScreens();
        this.screens.result.classList.add('active');
        updateResultTexts();

        // 결과 헤더
        const isCorrect = result.is_correct;
        const headerText = isCorrect ? 
            (currentLanguage === 'ko' ? '🎉 정답입니다!' : '🎉 Correct!') :
            (currentLanguage === 'ko' ? '❌ 틀렸습니다!' : '❌ Incorrect!');
        this.elements.resultHeader.textContent = headerText;
        this.elements.resultHeader.className = `result-header ${isCorrect ? 'correct' : 'incorrect'}`;

        // 답안 정보
        this.elements.selectedAnswer.textContent = result.selected_choice;
        this.elements.correctAnswer.textContent = this.currentQuestion.choices[result.correct_answer];

        // 설명
        this.elements.explanationText.textContent = result.explanation;
        this.elements.referenceUrl.href = result.reference_url;

        // 점수 업데이트
        this.elements.currentScore.textContent = result.current_score;

        // 다음 문제 버튼 텍스트 업데이트
        this.elements.nextQuestionBtn.innerHTML = currentLanguage === 'ko' ? 
            '➡️ 다음 문제' : '➡️ Next Question';
    }

    async loadNextQuestion() {
        console.log('⏭️ 다음 문제 로딩');
        await this.loadQuestion();
    }

    async showEndingScreen(gameData = null) {
        console.log('🏁 엔딩 화면 표시');
        this.hideAllScreens();
        this.screens.ending.classList.add('active');
        updateEndingTexts();

        if (!gameData) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/game/status/${this.sessionId}`);
                const statusData = await response.json();
                gameData = statusData;
            } catch (error) {
                console.error('게임 상태 조회 실패:', error);
            }
        }

        if (gameData) {
            console.log('🎯 최종 게임 데이터:', gameData);
            this.displayPersonalizedEnding(gameData);
            this.displayFinalScore(gameData);
        }
    }

    displayPersonalizedEnding(gameData) {
        const playerName = gameData.player_name || this.elements.currentPlayer.textContent;
        const score = gameData.final_score || gameData.current_score || 0;
        const accuracy = Math.round((gameData.correct_answers / gameData.total_questions) * 100) || 0;
        
        let personalizedMessage = '';
        let asciiArt = '';
        
        if (currentLanguage === 'ko') {
            if (accuracy >= 90) {
                personalizedMessage = `🌟 축하합니다, ${playerName}님! 🌟\n완벽한 AWS 마스터입니다!`;
                asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                            🏆 AWS 마스터 🏆                              ║
    ║                                                                            ║
    ║    ${playerName}님, 당신은 진정한 클라우드 전문가입니다!                    ║
    ║                                                                            ║
    ║                    ⭐⭐⭐ 완벽한 성과! ⭐⭐⭐                              ║
    ╚══════════════════════════════════════════════════════════════════════════╝`;
            } else if (accuracy >= 70) {
                personalizedMessage = `🎉 잘했습니다, ${playerName}님! 🎉\n훌륭한 AWS 실력을 보여주셨네요!`;
                asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                          🥈 AWS 전문가 🥈                                ║
    ║                                                                            ║
    ║      ${playerName}님, 뛰어난 클라우드 지식을 가지고 계시네요!              ║
    ║                                                                            ║
    ║                      ⭐⭐ 훌륭한 성과! ⭐⭐                               ║
    ╚══════════════════════════════════════════════════════════════════════════╝`;
            } else {
                personalizedMessage = `💪 수고하셨습니다, ${playerName}님! 💪\n더 많은 학습으로 발전해보세요!`;
                asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                        🥉 AWS 학습자 🥉                                  ║
    ║                                                                            ║
    ║        ${playerName}님, 좋은 시작입니다! 계속 학습해보세요!                ║
    ║                                                                            ║
    ║                        ⭐ 노력하는 모습! ⭐                               ║
    ╚══════════════════════════════════════════════════════════════════════════╝`;
            }
        } else {
            if (accuracy >= 90) {
                personalizedMessage = `🌟 Congratulations, ${playerName}! 🌟\nYou are a perfect AWS Master!`;
                asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                            🏆 AWS Master 🏆                              ║
    ║                                                                            ║
    ║      ${playerName}, you are a true cloud professional!                    ║
    ║                                                                            ║
    ║                    ⭐⭐⭐ Perfect Performance! ⭐⭐⭐                      ║
    ╚══════════════════════════════════════════════════════════════════════════╝`;
            } else if (accuracy >= 70) {
                personalizedMessage = `🎉 Well done, ${playerName}! 🎉\nYou showed excellent AWS skills!`;
                asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                          🥈 AWS Expert 🥈                                ║
    ║                                                                            ║
    ║        ${playerName}, you have outstanding cloud knowledge!               ║
    ║                                                                            ║
    ║                      ⭐⭐ Great Performance! ⭐⭐                         ║
    ╚══════════════════════════════════════════════════════════════════════════╝`;
            } else {
                personalizedMessage = `💪 Good effort, ${playerName}! 💪\nKeep learning to improve further!`;
                asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                        🥉 AWS Learner 🥉                                 ║
    ║                                                                            ║
    ║          ${playerName}, great start! Keep learning!                       ║
    ║                                                                            ║
    ║                        ⭐ Keep Trying! ⭐                                ║
    ╚══════════════════════════════════════════════════════════════════════════╝`;
            }
        }
        
        this.elements.endingAscii.textContent = asciiArt;
        
        // 개인화 메시지를 화면에 추가
        const messageElement = document.createElement('div');
        messageElement.className = 'personalized-message';
        messageElement.style.cssText = `
            text-align: center;
            font-size: 1.2rem;
            color: #ffaa00;
            margin: 20px 0;
            padding: 15px;
            border: 2px solid #ffaa00;
            border-radius: 10px;
            background: rgba(255, 170, 0, 0.1);
            white-space: pre-line;
        `;
        messageElement.textContent = personalizedMessage;
        
        const container = this.screens.ending.querySelector('.ending-container');
        const scoreContainer = container.querySelector('.final-score-container');
        container.insertBefore(messageElement, scoreContainer);
    }

    displayFinalScore(gameData) {
        console.log('🎯 최종 점수 표시');
        this.elements.finalScore.textContent = gameData.final_score || gameData.current_score || 0;
        this.elements.correctCount.textContent = `${gameData.correct_answers}/${gameData.total_questions}`;
        
        if (gameData.correct_answers && gameData.total_questions) {
            const accuracy = Math.round((gameData.correct_answers / gameData.total_questions) * 100);
            this.elements.accuracyRate.textContent = `${accuracy}%`;
        }

        // 다시 도전 버튼 텍스트 업데이트
        this.elements.restartGameBtn.innerHTML = currentLanguage === 'ko' ? 
            '🔄 다시 도전' : '🔄 Try Again';
    }

    restartGame() {
        console.log('🔄 게임 재시작');
        this.sessionId = null;
        this.currentQuestion = null;
        this.gameData = null;
        this.elements.currentScore.textContent = '0';
        this.elements.progressFill.style.width = '0%';
        this.elements.progressText.textContent = '0/10';
        
        // 개인화 메시지 제거
        const personalizedMessage = document.querySelector('.personalized-message');
        if (personalizedMessage) {
            personalizedMessage.remove();
        }
        
        this.showWelcomeScreen();
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        const loadingText = this.elements.loading.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = currentLanguage === 'ko' ? '처리 중...' : 'Processing...';
        }
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    showError(message) {
        console.error('❌ 에러 표시:', message);
        updateErrorTexts();
        this.elements.errorText.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }

    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM 로딩 완료, 게임 시작');
    new CloudHeroGame();
});
