
const keyword = require('./keyword');

const correctAnswer = "Rajeev is getting a lot of practice, but he should ask an art instructor each day for feedback on how well he drew the day’s portrait";

const answers = [
  "it's not deliberate practice",
  "Even without deliberate practice, Rajeev could improve his skill by practice. If his skill doesn't improve at all, that is not a problem of deliberate practice, it's a problem that he didn't practice the same skill every day. He is not practicing a specific skill (draw the eye of the portrait). Although the lack of feedback is also important, it's more important to focus on the same practice)",
  "The task of creating a portrait is a complex one and should be studied step by step rather than in full. Hence, Rajeev should identify what parts of the portrait are problematic and practice them regularly instead of drawing new full portrait every day.",
  "lack of deliberate practice, to say, always practice a general and broad task set without pinpointing where exactly is not good.",
  "It's not specific enough. Portraiture could be considered the whole task - there are specific techniques that Rajeev should focus on improving before practicing combining into the whole portrait. (Compare to practicing a putt in golf, not all of golf)",
  "People generally can't improve to a higher level without some figure telling them what that higher level is/looks like. For all we know, Rajeev is drawing stick figures and thinks them pretty good. He needs someone/something to evaluate him and tell him what parts of his portrait need improving on so that he can practice those particular aspects.",
  "First, the instruction of practice might not be the best; Second, he didn't have a teacher monitor his practice; Last, he didn't have informative feedback and remedial training.",
  "Despite doing so much practice, there is no one to give Rajeev feedback on his errors and remedial training based on that feedback. So while Rajeev is practicing a lot, he is not doing deliberate practice which focuses on correcting his errors and then improving his skill.",
  "Rajeev needs expert feedback in order to identify his mistakes and how to correct them.",
  "Rajeev is getting a lot of practice, but he should ask an art instructor each day for feedback on how well he drew the day’s portrait",
  "Currently, Rajeev is not receiving feedback and remedial instruction for his work which are an integral part of deliberate practice.",
  "He is not doing deliberate practice. That is, his practice might not be focused on the part that needs improvement, there is no feedback on his performance from experts.",
  "Because he doesn't have a mentor who diagnoses his problems about painting. He doesn't get immediate feedback and remedial training.",
  "He doesn't have a teacher who supervises him and diagnoses his errors.",
  "Rajiv may not know the optimal techniques for drawing because of a lack of explicit instruction, he has no supervision in terms of mistakes that he's making and he gets no feedback or remedial training for the components he's weak at.",
  "Rajeev is not improving because he is not undergoing deliberate practice. He is drawing alone, which means that one of the conditions of deliberate practice is not being met: he is not being supervised by a teacher to diagnose errors.",
  "It might be that there's no informative feedback and remedial training for him to correct his errors and to improve his skill.",
  "Because he is neither given explicit instruction about the best method, nor supervised by a teacher to diagnose errors and get informative feedback and remedial training. Repeated practice at the same level won't lead to performance.",
  "He is not doing deliberate practice. B/c there is no feedback provided.",
  "To improve quickly, Rajeev needs deliberate practice, which requires feedbacks.",
  "There's no supervision of an external agent so no feedback",
  "Reason could be because he didn't get corrective feedback.",
  "because he needs to be supervised by a teacher to diagnose errors",
  "Not receiving immediate feedback may make Rajeev not yield an improvement.",
];

for (const answer of answers) {
  // console.log(answer);
  const match = keyword.calculateMatch(correctAnswer, answer);
  if (match > 0.2) {
    console.log(match);
    console.log(correctAnswer);
    console.log(answer);
  }
}
