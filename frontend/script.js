/**
 * 클라우드 용사 게임 JavaScript
 * 게임 로직 및 UI 제어
 */

class CloudHeroGame {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.sessionId = null;
        this.currentQuestion = null;
        this.gameData = null;
        
        this.initializeElements();
        this.bindEvents();
        this.showWelcomeScreen();
    }

    initializeElements() {
        // 화면 요소들
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen'),
            ending: document.getElementById('ending-screen'),
            leaderboard: document.getElementById('leaderboard-screen')
        };

        // 입력 요소들
        this.elements = {
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
            viewLeaderboardBtn: document.getElementById('view-leaderboard'),
            leaderboardContent: document.getElementById('leaderboard-content'),
            backToGameBtn: document.getElementById('back-to-game'),
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            errorCloseBtn: document.getElementById('error-close')
        };
    }

    bindEvents() {
        // 게임 시작
        this.elements.startGameBtn.addEventListener('click', () => this.startGame());
        this.elements.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // 게임 진행
        this.elements.nextQuestionBtn.addEventListener('click', () => this.loadNextQuestion());

        // 게임 완료 후 액션
        this.elements.restartGameBtn.addEventListener('click', () => this.restartGame());
        this.elements.viewLeaderboardBtn.addEventListener('click', () => this.showLeaderboard());
        this.elements.backToGameBtn.addEventListener('click', () => this.showEndingScreen());

        // 에러 처리
        this.elements.errorCloseBtn.addEventListener('click', () => this.hideError());
    }

    showWelcomeScreen() {
        this.hideAllScreens();
        this.screens.welcome.classList.add('active');
        this.displayWelcomeAscii();
        this.elements.playerNameInput.focus();
    }

    async displayWelcomeAscii() {
        const welcomeAscii = [
            "╔══════════════════════════════════════╗",
            "║            클라우드 용사              ║",
            "║          CLOUD HERO GAME            ║",
            "╚══════════════════════════════════════╝",
            "",
            "    .-~~~-.     .-~~~-.     .-~~~-.   ",
            "   /       \\   /       \\   /       \\  ",
            "  |   AWS   | |  QUIZ   | | ADVENTURE|",
            "   \\       /   \\       /   \\       /  ",
            "    '~~~~~'     '~~~~~'     '~~~~~'   ",
            "",
            "        클라우드 세계에 이슈가 발생했다!",
            "            용사의 힘이 필요하다!",
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

    async startGame() {
        const playerName = this.elements.playerNameInput.value.trim() || '용사';
        
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/game/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player_name: playerName })
            });

            if (!response.ok) {
                throw new Error('게임 시작에 실패했습니다.');
            }

            const data = await response.json();
            this.sessionId = data.session_id;
            this.elements.currentPlayer.textContent = data.player_name;
            
            this.hideLoading();
            this.showGameScreen();
            this.loadQuestion();
            
        } catch (error) {
            this.hideLoading();
            this.showError('게임 시작 중 오류가 발생했습니다: ' + error.message);
        }
    }

    showGameScreen() {
        this.hideAllScreens();
        this.screens.game.classList.add('active');
    }

    async loadQuestion() {
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/game/question/${this.sessionId}`);
            
            if (!response.ok) {
                throw new Error('문제를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            
            if (data.game_completed) {
                this.hideLoading();
                this.showEndingScreen(data);
                return;
            }

            this.currentQuestion = data;
            this.displayQuestion(data);
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.showError('문제 로딩 중 오류가 발생했습니다: ' + error.message);
        }
    }

    displayQuestion(questionData) {
        // 진행률 업데이트
        const progress = (questionData.question_number / questionData.total_questions) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = `${questionData.question_number}/${questionData.total_questions}`;

        // 아스키 아트 표시
        this.elements.questionAscii.textContent = questionData.ascii_scene.join('\n');

        // 시나리오 텍스트 표시
        this.elements.scenarioText.textContent = questionData.scenario;

        // 선택지 생성
        this.createChoices(questionData.choices);
    }

    createChoices(choices) {
        this.elements.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice;
            button.setAttribute('data-index', index + 1);
            
            button.addEventListener('click', () => {
                this.selectChoice(index, button);
            });
            
            this.elements.choicesContainer.appendChild(button);
        });
    }

    selectChoice(answerIndex, buttonElement) {
        // 모든 선택지에서 selected 클래스 제거
        document.querySelectorAll('.choice-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 선택된 버튼에 selected 클래스 추가
        buttonElement.classList.add('selected');
        
        // 잠시 후 답안 제출
        setTimeout(() => {
            this.submitAnswer(answerIndex);
        }, 500);
    }

    async submitAnswer(selectedAnswer) {
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/game/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    selected_answer: selectedAnswer
                })
            });

            if (!response.ok) {
                throw new Error('답안 제출에 실패했습니다.');
            }

            const result = await response.json();
            this.hideLoading();
            this.showResult(result, selectedAnswer);
            
        } catch (error) {
            this.hideLoading();
            this.showError('답안 제출 중 오류가 발생했습니다: ' + error.message);
        }
    }

    showResult(result, selectedAnswerIndex) {
        this.hideAllScreens();
        this.screens.result.classList.add('active');

        // 결과 헤더
        const isCorrect = result.is_correct;
        this.elements.resultHeader.textContent = isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다!';
        this.elements.resultHeader.className = `result-header ${isCorrect ? 'correct' : 'incorrect'}`;

        // 답안 정보
        this.elements.selectedAnswer.textContent = result.selected_choice;
        this.elements.correctAnswer.textContent = this.currentQuestion.choices[result.correct_answer];

        // 설명
        this.elements.explanationText.textContent = result.explanation;
        this.elements.referenceUrl.href = result.reference_url;

        // 점수 업데이트
        this.elements.currentScore.textContent = result.current_score;
    }

    async loadNextQuestion() {
        await this.loadQuestion();
    }

    async showEndingScreen(gameData = null) {
        this.hideAllScreens();
        this.screens.ending.classList.add('active');

        if (!gameData) {
            // 게임 상태 다시 가져오기
            try {
                const response = await fetch(`${this.apiBaseUrl}/game/status/${this.sessionId}`);
                const statusData = await response.json();
                
                const questionResponse = await fetch(`${this.apiBaseUrl}/game/question/${this.sessionId}`);
                const questionData = await questionResponse.json();
                
                if (questionData.game_completed) {
                    gameData = questionData;
                }
            } catch (error) {
                console.error('게임 상태 확인 중 오류:', error);
            }
        }

        if (gameData && gameData.ending_message) {
            this.elements.endingAscii.textContent = gameData.ending_message.join('\n');
        }

        // 최종 점수 표시
        if (gameData) {
            this.elements.finalScore.textContent = gameData.final_score;
            this.elements.correctCount.textContent = `${gameData.correct_answers}/${gameData.total_questions}`;
            
            const accuracy = Math.round((gameData.correct_answers / gameData.total_questions) * 100);
            this.elements.accuracyRate.textContent = `${accuracy}%`;
        }
    }

    async showLeaderboard() {
        this.hideAllScreens();
        this.screens.leaderboard.classList.add('active');

        try {
            const response = await fetch(`${this.apiBaseUrl}/game/leaderboard`);
            const data = await response.json();
            
            this.displayLeaderboard(data.leaderboard);
            
        } catch (error) {
            this.showError('리더보드를 불러오는데 실패했습니다: ' + error.message);
        }
    }

    displayLeaderboard(leaderboard) {
        this.elements.leaderboardContent.innerHTML = '';
        
        if (leaderboard.length === 0) {
            this.elements.leaderboardContent.innerHTML = '<p>아직 완료된 게임이 없습니다.</p>';
            return;
        }

        leaderboard.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            
            item.innerHTML = `
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-name">${player.player_name}</div>
                <div class="leaderboard-score">${player.score}점 (${player.completion_rate}%)</div>
            `;
            
            this.elements.leaderboardContent.appendChild(item);
        });
    }

    async restartGame() {
        if (this.sessionId) {
            try {
                await fetch(`${this.apiBaseUrl}/game/reset/${this.sessionId}`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('게임 리셋 중 오류:', error);
            }
        }
        
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
    console.log('🎮 클라우드 용사 게임이 로드되었습니다!');
    new CloudHeroGame();
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // ESC 키로 에러 메시지 닫기
    if (e.key === 'Escape') {
        const errorMessage = document.getElementById('error-message');
        if (!errorMessage.classList.contains('hidden')) {
            errorMessage.classList.add('hidden');
        }
    }
});
