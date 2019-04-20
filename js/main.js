
function hideBoard() {
  $('.scene').hide();
  $('#board').hide();
}
function showBoard() {
  $('.scene').hide();
  $('#board').show();
}

function startScene(scene) {
  $(scene).fadeIn();
}
function continueScene(el) {
  var next = $(el).data('next');
  console.log(next);
  $(el).parent('.scene').fadeOut(function () {
    $(next).fadeIn();
  });
}
function endScene(el) {
  $(el).parent('.scene').fadeOut(function () {
    hideBoard();
  });
}

function triggerScenePractice() {
  showBoard();
  startScene('#scene-title-practice');
}

$(document).ready(function () {
  showBoard();
  $('#scene-start').show();

  $('.btn-continue').click(function () {
    if (!$(this).hasClass('btn-disabled')) {
      continueScene(this);
    }
  })
  $('.btn-end').click(function () {
    endScene(this);
  })
  $('.btn-share').click(function () {
    var url = "https://polarischen.github.io/tol-quiz/";
    var text = "Do you take a data-driven quiz? Check this out! 😏";
    var twitterWindow = window.open('https://twitter.com/share?url=' + url + '&text=' + text, 'twitter-popup', 'height=350, width=600');
    if (twitterWindow.focus) {
      twitterWindow.focus();
    }
  })
  $('.option').click(function () {
    $(this).parent('.gallery').find('.option').removeClass('option-selected');
    $(this).addClass('option-selected');
  })
  $('.select .option').click(function () {
    var $btn = $(this).parent('.select').parent('.scene').find('.btn-continue');
    $btn.removeClass('btn-disabled');

    var next = $(this).data('next');
    var target = $(this).parent('.select').data('target');
    var $btnTarget = $(target).find('.btn-continue');
    $btnTarget.data('next', next);
  })
  $('.input-answer').on('change keyup paste', function() {
    var $btn = $(this).parent('.scene').find('.btn-continue');
    if ($(this).val().length === 0) {
      $btn.addClass('btn-disabled');
    } else {
      $btn.removeClass('btn-disabled');
    }
  })
})
