"use strict";

// 基本データ

// 地理クイズのデータ
const data = [
    {
        question: '日本で一番面積の大きい都道府県は？',
        answers: ['北海道', '岩手県', '鹿児島県', '長野県'],
        correct: '北海道'
    },
    {
        question: '日本で二番目に面積の大きい都道府県は？',
        answers: ['北海道', '岩手県', '鹿児島県', '長野県'],
        correct: '岩手県'
    },
    {
        question: '日本で一番人口密度の多い都道府県は？',
        answers: ['大阪府', '東京都', '愛知県', '福岡県'],
        correct: '東京都'
    },
];

// 出題する問題数
const QUESTION_LENGTH = 3;
// 回答時間(ms)
const ANSWER_TIME_MS = 10000;
// インターバル時間(ms)
const INTERVAL_TIME_MS = 10;

// インターバルID
let intervalId = null;
// 回答開始時間
let startTime = null;
// 回答中の経過時間
let elapsedTime = 0;

// 出題する問題データ
let questions = getRundomQuestions();
// 出題する問題のインデックス
let questionIndex = 0;
// 正解数
let correctCount = 0;

//　要素一覧

const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');

const startButton = document.getElementById('startButton');

const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const optionButtons = document.querySelectorAll('#questionPage button');
const questionProgress = document.getElementById('questionProgress');

const resultMessage = document.getElementById('resultMessage');
const backButton = document.getElementById('backButton');

const dialog = document.getElementById('dialog');
const questionResult = document.getElementById('questionResult');
const nextButton = document.getElementById('nextButton');

// 処理

startButton.addEventListener('click', clickStartButton);

optionButtons.forEach((button) => {
    button.addEventListener('click', clickOptionButton);
});

nextButton.addEventListener('click', clickNextButton);

backButton.addEventListener('click', clickBackButton);

// 関数一覧

function questionTimeOver() {
    // 時間切れの場合は不正解とする
    questionResult.innerText = '×';
    // ダイアログのボタンのテキストを設定する
    if (isQuestionEnd()) {
        nextButton.innerText = '結果を見る';
    } else {
        nextButton.innerText = '次の問題へ';
    }
    // ダイアログを表示する
    dialog.showModal();
}

function startProgress() {
    // 開始時間を取得する
    startTime = Date.now();
    intervalId = setInterval(() => {
        // 現在の時刻を表示する
        const currentTime = Date.now();
        // 経過時間を計算する
        const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 100;
        // progressバーに経過時間を反映(表示)させる
        questionProgress.value = progress;
        // 経過時間が回答時間を超えた場合、インターバルを停止する
        if (startTime + ANSWER_TIME_MS <= currentTime) {
            stopProgress();
            questionTimeOver();
            return;
        }
    }, INTERVAL_TIME_MS);

    //     intervalId = setInterval(() => {
    //         // 経過時間を計算する
    //         const progress = (elapsedTime / ANSWER_TIME_MS) * 100;
    //         // progressバーに経過時間を反映(表示)させる
    //         questionProgress.value = progress;
    //         // 経過時間が回答時間を超えた場合、インターバルを停止する
    //         if (ANSWER_TIME_MS <= elapsedTime) {
    //             stopProgress();
    //             questionTimeOver();
    //             return;
    //         }
    //         // 経過時間を更新(加算)する
    //         elapsedTime += INTERVAL_TIME_MS;
    //     }, INTERVAL_TIME_MS);
}

function stopProgress() {
    // インターバルを停止する
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function reset() {
    // 出題する問題をランダムに取得する
    questions = getRundomQuestions();
    // 出題する問題のインデックスを初期化する
    questionIndex = 0;
    // 正解数を初期化する
    correctCount = 0;
    // インターバルIDを初期化する
    intervalId = null;
    // 回答中の経過時間を初期化する
    elapsedTime = 0;
    // 開始時間を初期化する
    startTime = null;
    // ボタンを有効化する
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].removeAttribute('disabled')
    }
}

function isQuestionEnd() {
    // 問題が最後かどうかを判定する
    return questionIndex + 1 === QUESTION_LENGTH;
}

function getRundomQuestions() {
    // 出力する問題のインデックスリスト
    const questionIndexList = [];
    while (questionIndexList.length !== QUESTION_LENGTH) {
        // 出対する問題のインデクスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        // インデックスリストに含まれていない場合、インデックスリストに追加する
        if (!questionIndexList.includes(index)) {
            questionIndexList.push(index);
        }
    }
    // 出題する問題のリストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}

function setResult() {
    // 正解率を計算する
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    // 正解率を表示する
    resultMessage.innerText = `正解率: ${accuracy}%`
}

function setQuestion() {
    // 問題を取得する
    const question = questions[questionIndex];
    // 問題番号を表示する
    questionNumber.innerText = `第 ${questionIndex + 1} 問`;
    // 問題文を表示する
    questionText.innerText = question.question;
    // 選択肢を表示する
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].innerText = question.answers[i];
    }
}

// イベント関連の関数一覧

function clickOptionButton(event) {
    // 回答中の経過時間を停止する
    stopProgress();
    // すべての選択肢を無効化する
    optionButtons.forEach((button) => {
        button.disabled = true;
        // button.setAttribute('disabled', 'disabled');
    });

    // 選択した選択肢のテキストを取得する
    const optionText = event.target.innerText;
    // 正解のテキストを取得する
    const correctText = questions[questionIndex].correct;

    if (optionText === correctText) {
        correctCount++;
        // alert('正解');
        questionResult.innerText = '○';
    } else {
        // alert('不正解');
        questionResult.innerText = '×';
    }

    // 最後の問題かどうかを判定する
    if (isQuestionEnd()) {
        nextButton.innerText = '結果を見る';
    } else {
        nextButton.innerText = '次の問題へ';
    }
    // ダイアログを表示する
    dialog.showModal();
}

function clickStartButton() {
    // クイズをリセットする
    reset();
    // 問題画面に問題を設定する
    setQuestion();
    // 回答の計測を開始する
    startProgress();
    // スタート画面を非表示にする
    startPage.classList.add('hidden');
    // 問題画面を表示する
    questionPage.classList.remove('hidden');
    // 結果画面を非表示にする
    resultPage.classList.add('hidden');
}

function clickNextButton() {
    if (isQuestionEnd()) {
        // 正解率を設定する
        setResult();
        // スタート画面を非表示にする
        startPage.classList.add('hidden');
        // 問題画面を非表示にする
        questionPage.classList.add('hidden');
        // 結果画面を表示にする
        resultPage.classList.remove('hidden');
    } else {
        questionIndex++;
        // 問題画面に問題を設定する
        setQuestion();
        // インターバルIDを初期化する
        intervalId = null;
        // 回答中の経過時間を初期化する
        elapsedTime = 0;
        // 開始時間を初期化する
        // startTime = null;
        for (let i = 0; i < optionButtons.length; i++) {
            optionButtons[i].removeAttribute('disabled');
        }
    }
    // ダイアログを停止する
    dialog.close();
    // 回答の計測を開始する
    startProgress();
}

function clickBackButton() {
    // スタート画面を表示にする
    startPage.classList.remove('hidden');
    // 問題画面を非表示にする
    questionPage.classList.add('hidden');
    // 結果画面を非表示にする
    resultPage.classList.add('hidden');
}