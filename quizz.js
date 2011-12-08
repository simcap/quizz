var QUESTIONS_COUNT = quizz.questions.length;

$(document).ready(function() {

	$(':button.next').live('click', function(){
		var questionNumber = $(this).parents('div.question:first').attr('id').substr(8);
		if(questionNumber >= QUESTIONS_COUNT) return;
		displayQuestion((questionNumber * 1) + 1);
	});
	
	$(':button.prev').live('click', function(){
		var questionNumber = $(this).parents('div.question:first').attr('id').substr(8);
		if(questionNumber <= 1) return;
		displayQuestion((questionNumber * 1) - 1);
	});
	
	$(':button.done').live('click', function(){
		if(countQuestionsAnswered() < QUESTIONS_COUNT) return alert('You are not done'); 
		displayResults();
	});
	
	$('input[type=radio]').live('click', function(){
		$('body').data($(this).attr('name'), $(this).val());
	});
	
	$(':button#start').live('click', function(){
		displayQuestion(1);		
	});
	
	$(':button#reset').click(function(){
		$('div.question').html('');
		$('div.question').append('<button class="btn large primary" id="start">Start</button>');
		$('body').removeData();		
	});
	
	$(':button#reset').click();
	
});

function displayQuestion(questionNumber){
	var questionArrayIndex = (questionNumber * 1) - 1;
	var quizzQuestion = window.quizz.questions[questionArrayIndex];
	$('div.question').html('');
	$('div.question').attr('id', 'question' + questionNumber);
	$('div.question').append('<h5>Question ' + questionNumber + '/' + QUESTIONS_COUNT + '</h5>');
	$('div.question').append('<div class="well"><span>' + quizzQuestion.question + '</span></div>');
	$('div.question').append('<ul>');
	$.each(quizzQuestion.answers, function(index, value){
		$('div.question ul').append('<li><input id="answer_' + value.score + '" type="radio" name="question' + questionNumber + '" value="' + value.score + '"/>' + value.answer + '</li>' );
	});
	
	$('input[type=radio]').each(function(){
		if($(this).val() == getActualScoreForQuestion(questionNumber)){
			$(this).attr('checked', 'checked');
		}
	});

	$('div.question').append('<button class="prev btn">Previous</button><button class="next btn">Next</button><button class="done btn pull-right success">Done</button>');
}

function displayResults() {
	$('div.question').html('');
	var totalScore = 0;
	for(i = 1; i <= QUESTIONS_COUNT; i++) {
		totalScore = totalScore + getActualScoreForQuestion(i);
	}

	var scoreInPercent = Math.round((100 * totalScore) / (QUESTIONS_COUNT * 2));
	
	$('div.question').html('<h6>Your team is ' + scoreInPercent + '% XP ......... ;)</h6>');
			
	$('div.question').append('<table id="your-answers" class="zebra-striped"><thead><tr><th>Questions</th><th>Your answers</th></tr></thead></table>');
	
	for(i = 0; i < QUESTIONS_COUNT; i++) {
		var quizzQuestion = window.quizz.questions[i];
		var actualAnswer = getAnswerFromScore(quizzQuestion, getActualScoreForQuestion(i+1));
    	$('table#your-answers').append('<tr><td>' + quizzQuestion.question +'</td><td>' + actualAnswer + '</td></tr>');
  	}
	
}

function countQuestionsAnswered() {
  var prop;
  var propCount = 0;
  for (prop in $('body').data()) {
    propCount++;
  }
  return propCount;
}

function getAnswerFromScore(quizzQuestion, score) {
	if (quizzQuestion.answers[0].score == score) return quizzQuestion.answers[0].answer;
	if (quizzQuestion.answers[1].score == score) return quizzQuestion.answers[1].answer;
	if (quizzQuestion.answers[2].score == score) return quizzQuestion.answers[2].answer;
}

function getActualScoreForQuestion(questionNumber) {
  return  ($('body').data('question' + questionNumber)) * 1;
}



