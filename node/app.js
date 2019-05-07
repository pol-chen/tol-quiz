
const csvToJson = require('csvtojson');
const fs = require('fs');
const keyword = require('./keyword');

let questionList = [];
let optionList = {};

const readCsv = async (path, next) => {
  await csvToJson()
  .fromFile(path)
  .then((json) => {
      // console.log(json);
      next(json);
  });
};

const parseQuestions = (data) => {
  for (var i = 0; i < data.length; i++) {
    var q = data[i];

    let correctAnswer = '';
    const correctChoices = q.Correct_answer_choice.replace(' ', '').split(',');
    for (const choice of correctChoices) {
      correctAnswer += q['Choice_' + choice + '_text'];
    }
    
    var question = {
      qid: q.Question_id,
      text: q.Question_text,
      correctAnswer: correctAnswer,
      options: []
    }
    questionList.push(question);
  }
  console.log('Finished parsing questions');
};

const parseOptions = (data) => {
  // Read data
  var difficultyList = {};
  var quizScoreList = {};
  var avgScoreList = {};
  for (var i = 0; i < data.length; i++) {
    var o = data[i];
    var qid = o.Question_id;
    if (optionList[qid] == null) {
      optionList[qid] = [];
      difficultyList[qid] = 0;
      quizScoreList[qid] = 0;
      avgScoreList[qid] = 0;
    }
    var option = {
      qid: qid,
      text: o.Answer_text,
      isCorrect: false, // Default, analyze later in analyzeOption
      isUseful: false, // Default, analyze later in analyzeOption
      isUsedAsOption: false,
      isUsedAsFeedback: false,
      score: Number(o.Student_score_on_question),
      quizScore: Number(o.Quiz_score),
      avgScore: Number(o.Average_quizzes_score),
      irtCorrectness: 0.0, // Default, calculate later in calculateIRTCorrectness
      keywordMatchness: 0.0 // Default, calculate later in calculateKeywordMatchness
    }
    optionList[qid].push(option);
    difficultyList[qid] += option.score;
    quizScoreList[qid] += option.quizScore;
    avgScoreList[qid] += option.avgScore;
  }

  // Calculate difficulty, quiz and avg scores
  for (let [i, options] of Object.entries(optionList)) {
    var optionCount = options.length;

    var score = difficultyList[i];
    difficultyList[i] = score / optionCount;

    var quizScore = quizScoreList[i];
    quizScoreList[i] = quizScore / optionCount;

    var avgScore = avgScoreList[i];
    avgScoreList[i] = avgScore / optionCount;
  }

  // Analyze options
  for (let [i, options] of Object.entries(optionList)) {
    for (var j = 0; j < options.length; j++) {
      var op = options[j];
      analyzeOption(op, quizScoreList[i], avgScoreList[i]);
      calculateIRTCorrectness(op, difficultyList[i]);
      calculateKeywordMatchness(op);
    }
  }

  console.log('Finished parsing options');
  // console.log('difficultyList', difficultyList);
  // console.log('quizScoreList', quizScoreList);
  // console.log('avgScoreList', avgScoreList);
};

const analyzeOption = (option, quizScoreAvg, avgScoreAvg) => {
  // Check score
  if (option.score <= 0.5) {
    option.isCorrect = false;
    option.isUseful = true;
    return;
  }
  // Check length
  if (option.text.length < 40) {
    option.isCorrect = false;
    option.isUseful = true;
    return;
  }

  // Check quiz and avg score
  if (option.quizScore >= quizScoreAvg || option.avgScore >= avgScoreAvg) {
    option.isCorrect = true;
    option.isUseful = true;
  }
};

const calculateIRTCorrectness = (option, difficulty) => {
  // Use IRT Rasch Model
  var ability = (option.quizScore + option.avgScore) / 2.0;
  option.irtCorrectness = Math.exp(ability - difficulty) / (1 + Math.exp(ability - difficulty));
};

const calculateKeywordMatchness = (option) => {
  // Use keywords and their synonyms to calculate matchness
  const correctAnswer = questionList.find(q => q.qid === option.qid).correctAnswer;
  option.keywordMatchness = keyword.calculateMatch(correctAnswer, option.text);
};

const exportToJson = (data, path) => {
  fs.writeFile(path, data, 'utf8', (err) => {
    if (err) throw err;
    console.log('Finished exporting json to', path);
  });
};

const runAnalysis = async () => {
  await readCsv('../data/questions.csv', parseQuestions);
  await readCsv('../data/answers.csv', parseOptions);
  exportToJson(JSON.stringify(questionList), '../data/questions.json');
  exportToJson(JSON.stringify(optionList), '../data/options.json');
};

runAnalysis();