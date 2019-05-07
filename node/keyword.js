
const synonyms = require("synonyms");
const keywordExtractor = require("keyword-extractor");

const extractOptions = {
  language: "english",
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false
};

const calculateMatch = (correctAnswer, studentAnswer) => {
  const correctKeywords = keywordExtractor.extract(correctAnswer, extractOptions);
  const studentKeywords = keywordExtractor.extract(studentAnswer, extractOptions);
  let matchCount = 0;
  for (let i = 0; i < correctKeywords.length; i++) {
    const word = correctKeywords[i];
    if (studentKeywords.includes(word)) {
      // console.log('YES', word);
      matchCount++;
    } else {
      let match = false;
      const syn = synonyms(word);
      if (syn) {
        let synFlat = [];
        for (let [key, value] of Object.entries(syn)) {
            synFlat = synFlat.concat(value);
        }
        for (let j = 0; j < synFlat.length; j++) {
          if (studentKeywords.includes(synFlat[j])) {
            // console.log('YES', 'SYN', word, synFlat[j]);
            matchCount++;
            match = true;
          }
        }
      }
      if (!match) {
        // console.log('NO', word);
      }
    }
  }
  // console.log('MATCH', matchCount, '/', correctKeywords.length);
  return matchCount / correctKeywords.length;
};

module.exports = {
  calculateMatch: calculateMatch
};
