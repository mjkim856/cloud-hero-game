// 다국어 지원 데이터
const LANGUAGES = {
    ko: {
        // 언어 선택 화면
        languageSelect: {
            title: "클라우드 용사",
            subtitle: "Cloud Hero Game",
            selectLanguage: "언어를 선택하세요",
            korean: "한국어",
            english: "English"
        },
        
        // 게임 시작 화면
        welcome: {
            enterName: "용사의 이름을 입력하세요:",
            placeholder: "이름을 입력하고 Enter를 누르세요",
            startGame: "🚀 개인화된 모험 시작"
        },
        
        // 게임 진행 화면
        game: {
            player: "플레이어:",
            score: "점수:",
            progress: "진행:",
            processing: "처리 중..."
        },
        
        // 결과 화면
        result: {
            selectedAnswer: "선택한 답:",
            correctAnswer: "정답:",
            explanation: "💡 설명:",
            reference: "📚 AWS 공식 문서 보기",
            nextQuestion: "➡️ 다음 문제"
        },
        
        // 게임 완료 화면
        ending: {
            finalResult: "🏆 최종 결과",
            totalScore: "총 점수:",
            accuracy: "정답률:",
            correctCount: "정답 수:",
            restart: "🔄 다시 도전"
        },
        
        // 에러 메시지
        error: {
            title: "⚠️ 오류 발생",
            confirm: "확인"
        }
    },
    
    en: {
        // 언어 선택 화면
        languageSelect: {
            title: "Cloud Hero",
            subtitle: "클라우드 용사 게임",
            selectLanguage: "Select Language",
            korean: "한국어",
            english: "English"
        },
        
        // 게임 시작 화면
        welcome: {
            enterName: "Enter your hero name:",
            placeholder: "Enter name and press Enter",
            startGame: "🚀 Start Personalized Adventure"
        },
        
        // 게임 진행 화면
        game: {
            player: "Player:",
            score: "Score:",
            progress: "Progress:",
            processing: "Processing..."
        },
        
        // 결과 화면
        result: {
            selectedAnswer: "Your Answer:",
            correctAnswer: "Correct Answer:",
            explanation: "💡 Explanation:",
            reference: "📚 View AWS Official Documentation",
            nextQuestion: "➡️ Next Question"
        },
        
        // 게임 완료 화면
        ending: {
            finalResult: "🏆 Final Results",
            totalScore: "Total Score:",
            accuracy: "Accuracy:",
            correctCount: "Correct Answers:",
            restart: "🔄 Try Again"
        },
        
        // 에러 메시지
        error: {
            title: "⚠️ Error Occurred",
            confirm: "OK"
        }
    }
};

// 현재 언어 설정
let currentLanguage = 'ko';

// 언어 변경 함수
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    updateAllTexts();
}

// 저장된 언어 불러오기
function loadSavedLanguage() {
    const saved = localStorage.getItem('selectedLanguage');
    if (saved && LANGUAGES[saved]) {
        currentLanguage = saved;
    }
}

// 텍스트 가져오기 함수
function getText(path) {
    const keys = path.split('.');
    let current = LANGUAGES[currentLanguage];
    
    for (const key of keys) {
        if (current && current[key]) {
            current = current[key];
        } else {
            console.warn(`Translation not found for: ${path}`);
            return path;
        }
    }
    
    return current;
}

// 모든 텍스트 업데이트
function updateAllTexts() {
    // HTML lang 속성 업데이트
    document.documentElement.lang = currentLanguage;
    
    // 제목 업데이트
    document.title = currentLanguage === 'ko' ? 
        '클라우드 용사 - 다국어 지원 버전' : 
        'Cloud Hero - Multilingual Version';
    
    // 각 화면의 텍스트 업데이트
    updateLanguageSelectTexts();
    updateWelcomeTexts();
    updateGameTexts();
    updateResultTexts();
    updateEndingTexts();
    updateErrorTexts();
}

// 각 화면별 텍스트 업데이트 함수들
function updateLanguageSelectTexts() {
    const elements = {
        'language-title': getText('languageSelect.title'),
        'language-subtitle': getText('languageSelect.subtitle'),
        'select-language-text': getText('languageSelect.selectLanguage')
    };
    
    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });
}

function updateWelcomeTexts() {
    const promptText = document.getElementById('prompt-text');
    if (promptText) {
        promptText.textContent = getText('welcome.enterName');
    }
    
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.placeholder = getText('welcome.placeholder');
    }
    
    const startGameBtn = document.getElementById('start-game');
    if (startGameBtn) {
        startGameBtn.innerHTML = getText('welcome.startGame');
    }
}

function updateGameTexts() {
    const statusLabels = document.querySelectorAll('.status-label');
    const statusTexts = [
        getText('game.player'),
        getText('game.score'),
        getText('game.progress')
    ];
    
    statusLabels.forEach((label, index) => {
        if (statusTexts[index]) {
            label.textContent = statusTexts[index];
        }
    });
    
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = getText('game.processing');
    }
}

function updateResultTexts() {
    const selectedAnswerLabel = document.querySelector('.selected-answer-label');
    if (selectedAnswerLabel) {
        selectedAnswerLabel.textContent = getText('result.selectedAnswer');
    }
    
    const correctAnswerLabel = document.querySelector('.correct-answer-label');
    if (correctAnswerLabel) {
        correctAnswerLabel.textContent = getText('result.correctAnswer');
    }
    
    const explanationTitle = document.querySelector('.explanation-title');
    if (explanationTitle) {
        explanationTitle.textContent = getText('result.explanation');
    }
    
    const referenceLink = document.querySelector('.reference-link-text');
    if (referenceLink) {
        referenceLink.textContent = getText('result.reference');
    }
    
    const nextQuestionBtn = document.getElementById('next-question');
    if (nextQuestionBtn) {
        nextQuestionBtn.innerHTML = getText('result.nextQuestion');
    }
}

function updateEndingTexts() {
    const finalScoreTitle = document.querySelector('.final-score-title');
    if (finalScoreTitle) {
        finalScoreTitle.textContent = getText('ending.finalResult');
    }
    
    const restartGameBtn = document.getElementById('restart-game');
    if (restartGameBtn) {
        restartGameBtn.innerHTML = getText('ending.restart');
    }
    
    // 점수 라벨들 업데이트
    const scoreLabels = document.querySelectorAll('.score-label');
    const scoreTexts = [
        getText('ending.totalScore'),
        getText('ending.accuracy'),
        getText('ending.correctCount')
    ];
    
    scoreLabels.forEach((label, index) => {
        if (scoreTexts[index]) {
            label.textContent = scoreTexts[index];
        }
    });
}

function updateErrorTexts() {
    const errorTitle = document.querySelector('.error-title');
    if (errorTitle) {
        errorTitle.textContent = getText('error.title');
    }
    
    const errorCloseBtn = document.getElementById('error-close');
    if (errorCloseBtn) {
        errorCloseBtn.textContent = getText('error.confirm');
    }
}
