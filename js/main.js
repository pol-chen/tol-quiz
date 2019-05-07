
/* Data */

var questionList = [];
var optionList = [];

function readJson(path, next) {
  $.ajax({
    type: 'GET',
    url: path,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      next(data);
    }
  });
}

/* Quiz */

var current = 0;

function pickFeedback(qid) {
  var feedback = '';
  for (var option of optionList[qid].correct) {
    if (!option.isUsedAsOption && !option.isUsedAsFeedback) {
      option.isUsedAsFeedback = true;
      feedback = option.text;
      break;
    }
  }
  return feedback;
}

function pickOptions(qid) {
  var options = [];
  
  // Pick correct option as 0
  for (var option of optionList[qid].correct) {
    if (!option.isUsedAsOption && !option.isUsedAsFeedback) {
      option.isUsedAsOption = true;
      options[0] = option;
      break;
    }
  }

  // Pick incorrect options as 1, 2, 3
  var count = 0;
  for (var option of optionList[qid].incorrect) {
    if (!option.isUsedAsOption && !option.isUsedAsFeedback) {
      option.isUsedAsOption = true;
      options[++count] = option;
      if (count === 3) break;
    }
  }

  // Shuffle options
  options.sort(function() {
    return Math.random() - 0.5;
  });
  console.log('OPTIONS', options);

  return options;
}

function loadQuestion() {
  console.log('LOAD Q' + (current + 1));
  var quiz = questionList;
  var q = quiz[current++];
  q.options = pickOptions(q.qid);
  q.feedback = pickFeedback(q.qid);
  // console.log(quiz);
  $('#scene-question h2').text('Question ' + current);
  $('#scene-question p').text(q.text);
  $('#scene-question .btn-continue').addClass('btn-disabled');
  $('#scene-question .select').empty();
  q.options.forEach(function(option, i) {
    console.log(option, i);
    $('#scene-question .select').append(buildOption(option, i));
    if (option.isCorrect) {
      $('#scene-correct p').text(q.feedback);
    } else {
      $('#scene-wrong p').text(q.feedback);
    }
  });
}

function buildOption(op, i) {
  var feedback = op.isCorrect ? 'correct' : 'wrong';
  var nums = ['A', 'B', 'C', 'D'];
  var num = nums[i];
  return '<div class="frame option" data-next="#scene-' + feedback + '">\
    <p>' + num + '. ' + op.text + '</p>\
  </div>';
}

/* Scene */

function hideBoard() {
  $('.scene').hide();
  $('#board').hide();
}
function showBoard(scene) {
  $('.scene').hide();
  $('#board').show();
  showScene(scene);
}

function continueScene(el) {
  var next = $(el).data('next');
  console.log(next);
  $(el).parent('.scene').fadeOut(function () {
    $(next).fadeIn();
  });
}
function showScene(target, prep) {
  var $scene = $('.scene:visible');
  if ($scene.length == 0) {
    console.log('SHOW', target);
    if (prep) {
      prep();
    }
    $(target).show();
  } else {
    $('.scene:visible').fadeOut(function () {
      console.log('FADE IN', target);
      if (prep) {
        prep();
      }
      $(target).fadeIn();
    });
  }
}

/* Event */

function registerEvents() {
  $('.btn-continue').click(function () {
    if (!$(this).hasClass('btn-disabled')) {
      continueScene(this);
    }
  })
  $('.btn-next-question').click(function () {
    if (current == questionList.length) {
      showScene('#scene-end');
    } else {
      showScene('#scene-question', loadQuestion);
    }
  })
  $('.btn-share').click(function () {
    var url = "https://polarischen.github.io/tol-quiz/";
    var text = "Do you take a data-driven quiz? Check this out! 😏";
    var twitterWindow = window.open('https://twitter.com/share?url=' + url + '&text=' + text, 'twitter-popup', 'height=350, width=600');
    if (twitterWindow.focus) {
      twitterWindow.focus();
    }
  })
  $('.select').on('click', '.option', function () {
    var $select = $(this).parent('.select');
    if (!$select.hasClass('select-disabled')) {
      $select.find('.option').removeClass('option-selected');
      $(this).addClass('option-selected');

      var $btn = $select.parent('.scene').children('a');
      $btn.removeClass('btn-disabled');

      var next = $(this).data('next');
      if (next) {
        var target = $select.data('target');
        var $btnTarget = $(target).children('a');
        $btnTarget.data('next', next);
      }
    }
  })
  $('.input-answer').on('change keyup paste', function() {
    var $btn = $(this).parent('.scene').find('.btn-continue');
    if ($(this).val().length === 0) {
      $btn.addClass('btn-disabled');
    } else {
      $btn.removeClass('btn-disabled');
    }
  })
}

$(document).ready(function () {
  registerEvents();
  showBoard('#scene-start');

  readJson('data/questions.json', function(questions) {
    questionList = questions;
    readJson('data/options.json', function(options) {
      optionList = options;
      loadQuestion();
    });
  });
});
