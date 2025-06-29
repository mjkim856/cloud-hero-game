/**
 * 클라우드 용사 게임 JavaScript (개인화 엔딩 수정 버전)
 */

class CloudHeroGame {
    constructor() {
        this.apiBaseUrl = '/api';  // 포트 5001로 수정
        this.sessionId = null;
        this.currentQuestion = null;
        this.gameData = null;
        this.isGameCompleted = false;
        
        console.log('🎮 클라우드 용사 게임 초기화)');
        this.initializeElements();
        this.bindEvents();
        this.showWelcomeScreen();
    }

    initializeElements() {
        // console.log('📋 UI 요소 초기화');
        // 화면 요소들 (리더보드 제거)
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen'),
            ending: document.getElementById('ending-screen')
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
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            errorCloseBtn: document.getElementById('error-close')
        };
    }

    bindEvents() {
        // console.log('🔗 이벤트 바인딩');
        // 게임 시작
        this.elements.startGameBtn.addEventListener('click', () => this.startGame());
        this.elements.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // 게임 진행
        this.elements.nextQuestionBtn.addEventListener('click', (e) => {
            // console.log('🔄 다음 문제 버튼 클릭됨');
            e.preventDefault();
            this.loadNextQuestion();
        });

        // 게임 완료 후 액션
        this.elements.restartGameBtn.addEventListener('click', () => this.restartGame());

        // 에러 처리
        this.elements.errorCloseBtn.addEventListener('click', () => this.hideError());
    }

    showWelcomeScreen() {
        console.log('🏠 환영 화면 표시');
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
        console.log('🚀 게임 시작:', playerName);
        
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/game/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player_name: playerName })
            });

            // console.log('📡 게임 시작 응답:', response.status);

            if (!response.ok) {
                throw new Error('게임 시작에 실패했습니다.');
            }

            const data = await response.json();
            console.log('✅ 게임 시작 성공:');
            
            this.sessionId = data.session_id;
            this.elements.currentPlayer.textContent = data.player_name;
            
            this.hideLoading();
            this.showGameScreen();
            this.loadQuestion();
            
        } catch (error) {
            console.error('❌ 게임 시작 오류:', error);
            this.hideLoading();
            this.showError('게임 시작 중 오류가 발생했습니다: ' + error.message);
        }
    }

    showGameScreen() {
        this.hideAllScreens();
        this.screens.game.classList.add('active');
    }

    async loadQuestion() {
        
        if (!this.sessionId) {
            console.error('❌ 세션 ID가 없습니다!');
            this.showError('세션이 만료되었습니다. 게임을 다시 시작해주세요.');
            return;
        }
        
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/game/question/${this.sessionId}`);  
            
            if (!response.ok) {
                throw new Error('문제를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            
            if (data.game_completed) {
                // console.log('🏆 게임 완료! 플레이어:', data.player_name);
                // console.log('✨ 개인화된 엔딩 메시지:', data.ending_message);
                this.hideLoading();
                this.showEndingScreen(data);
                return;
            }

            this.currentQuestion = data.question;
            this.displayQuestion(data);
            this.hideLoading();
            
        } catch (error) {
            console.error('❌ 문제 로딩 오류:', error);
            this.hideLoading();
            this.showError('문제 로딩 중 오류가 발생했습니다: ' + error.message);
        }
    }

    displayQuestion(responseData) {
        console.log('📋 문제 표시 시작');
        
        // API 응답에서 실제 문제 데이터 추출
        const questionData = responseData.question;
        this.currentQuestion = questionData;
        const progress = responseData.progress;
        
        if (!questionData) {
            console.error('❌ 문제 데이터가 없습니다:', responseData);
            this.showError('문제 데이터를 불러올 수 없습니다.');
            return;
        }
        
        // console.log('📋 문제 표시:', progress.current, '/', progress.total);
        
        // 진행률 업데이트
        const progressPercent = (progress.current / progress.total) * 100;
        this.elements.progressFill.style.width = `${progressPercent}%`;
        this.elements.progressText.textContent = `${progress.current}/${progress.total}`;

        // ASCII 아트 표시 (안전한 처리)
        if (questionData.ascii_scene && Array.isArray(questionData.ascii_scene)) {
            this.elements.questionAscii.textContent = questionData.ascii_scene.join('\n');
        } else if (questionData.ascii_art && Array.isArray(questionData.ascii_art)) {
            this.elements.questionAscii.textContent = questionData.ascii_art.join('\n');
        } else {
            // 기본 ASCII 아트
            this.elements.questionAscii.textContent = `
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                            🎮 클라우드 용사                              ║
    ║                                                                            ║
    ║                          AWS 문제를 해결하세요!                          ║
    ╚══════════════════════════════════════════════════════════════════════════╝
            `;
        }

        // 시나리오 텍스트 표시
        this.elements.scenarioText.textContent = questionData.scenario || '문제를 불러오는 중...';

        // 선택지 생성
        this.createChoices(questionData.choices);
    }

    createChoices(choices) {
        console.log('🎯 선택지 생성 시작');
        
        // 안전한 처리
        if (!choices || !Array.isArray(choices) || choices.length === 0) {
            console.warn('⚠️ 선택지 데이터가 없습니다:', choices);
            this.elements.choicesContainer.innerHTML = '<p class="error-message">선택지를 불러올 수 없습니다.</p>';
            return;
        }
        
        // console.log('🎯 선택지 생성:', choices.length, '개');
        this.elements.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice;
            button.setAttribute('data-index', index + 1);
            
            button.addEventListener('click', () => {
                // console.log('🎯 선택지 클릭:', index, choice);
                this.selectChoice(index, button);
            });
            
            this.elements.choicesContainer.appendChild(button);
        });
    }

    selectChoice(answerIndex, buttonElement) {
        // console.log('✅ 답안 선택:', answerIndex);
        
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
        // console.log('📤 답안 제출 시작:', selectedAnswer, '세션:', this.sessionId);
        
        if (!this.sessionId) {
            this.showError('세션이 만료되었습니다. 게임을 다시 시작해주세요.');
            return;
        }
        
        try {
            this.showLoading();
            
            const requestData = {
                session_id: this.sessionId,
                selected_answer: selectedAnswer,
                answer: selectedAnswer  // 백엔드 호환성을 위해 두 필드 모두 전송
            };
            
            // console.log('📤 요청 데이터:', requestData);
            
            const response = await fetch(`${this.apiBaseUrl}/game/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            // console.log('📡 답안 제출 응답:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ 답안 제출 실패:', response.status, errorText);
                throw new Error(`답안 제출에 실패했습니다. (${response.status})`);
            }

            const result = await response.json();
            this.lastResult = result;
            // console.log('✅ 답안 제출 성공:', result);
            
            // this.hideLoading();
            // this.showResult(result, selectedAnswer);
            
            // // 🎯 마지막 문제였는지 확인
            // if (result.game_completed) {
            //     console.log('🎉 게임이 완료되었습니다! 엔딩 화면으로 이동');
            //     await this.showEndingScreen(result);
            //     return;  // 더 이상 다음 문제 호출하지 않음
            // }

            this.hideLoading();
            this.isGameCompleted = result.game_completed;      // ← 플래그 저장
            this.showResult(result, selectedAnswer);           // 결과 화면만 보여줌
            
        } catch (error) {
            console.error('❌ 답안 제출 오류:', error);
            this.hideLoading();
            this.showError('답안 제출 중 오류가 발생했습니다: ' + error.message);
        }
    }

    showResult(result, selectedAnswerIndex) {
        console.log('📊 결과 화면 표시:', result.is_correct ? '정답' : '오답');
        
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

        // 마지막 문제라면 버튼 문구 변경
        if (this.isGameCompleted) {
            this.elements.nextQuestionBtn.textContent = '엔딩 보기';
        } else {
            this.elements.nextQuestionBtn.textContent = '다음 문제';
        }
    }

    async loadNextQuestion() {
        console.log('➡️ 다음 문제로 이동');
        
        // 결과 화면을 숨기고 게임 화면으로 전환
        this.hideAllScreens();
        this.screens.game.classList.add('active');

        // 게임이 끝났으면 엔딩 화면으로
        if (this.isGameCompleted) {
            await this.showEndingScreen(this.lastResult);   // result 객체 없어도 내부에서 처리
            return;
        }
        
        // 새로운 문제 로딩
        await this.loadQuestion();
    }

    async showEndingScreen(gameData = null) {
        // console.log('🏆 게임 완료 화면 표시 (개인화된 엔딩)');
        this.hideAllScreens();
        this.screens.ending.classList.add('active');

        if (gameData && gameData.ending_message) {
            // 개인화된 엔딩 메시지 표시
            this.elements.endingAscii.textContent = gameData.ending_message.join('\n');
            // console.log('✨ 개인화된 엔딩 메시지 표시 완료:', gameData.player_name);
        } 

        // 최종 점수 표시
        if (gameData) {
            this.elements.finalScore.textContent = gameData.final_score;
            this.elements.correctCount.textContent = `${gameData.correct_answers}/${gameData.total_questions}`;
            
            const accuracy = Math.round((gameData.correct_answers / gameData.total_questions) * 100);
            this.elements.accuracyRate.textContent = `${accuracy}%`;
        }
    }

    async restartGame() {
        console.log('🔄 게임 재시작');
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
        console.error('🚨 에러 표시:', message);
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
    console.log('🎮 클라우드 용사 게임이 로드되었습니다! (개인화 엔딩 수정 버전)');
    window.game = new CloudHeroGame();
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
