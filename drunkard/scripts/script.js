//author jely_scs
//at 2013
//for: Тестовое задание для Школы разработчиков интерфейсов Яндекса

var COUNT_CARDS = 52;
//в правилах (http://ru.wikipedia.org/wiki/%D0%9F%D1%8C%D1%8F%D0%BD%D0%B8%D1%86%D0%B0_(%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BD%D0%B0%D1%8F_%D0%B8%D0%B3%D1%80%D0%B0)) указано, что число игроков - 2-8
var MAX_COUNT_PLAYERS = 8;	
var LEARS = ["♥","♦","♣","♠"];
var ALL_CARDS = new Array();

//переменная для корректного отображения карт-"картинок". И еще дополнительная карта "1" - пропуск хода. Используется для унификации выкладывания карт
var DISPLAY_PICTURES = {"11":"J","12":"D","13":"K","14":"A","1":"-"};

var countPlayers;
var playerCards;
var currentCone;
var gamingConePlayers;

//Также в условиях не сказано про правило - двойка бьет туза. Поэтому этого правила нет.
//Интерфейс текстовый и простой из-за того, что в задании написано, что важен алгоритм
//Также можно прикрутить сделать несколько ходов, сыграть сразу всю партию: но этого не было в задании.
//И еще, как вариант - можно было для ускорения, при нажатии на кнопку "сыграть всю партию" сразу выдавать одного из игроков - все равно победитель определяется случайным образом

//более красивое расположение функций, декомпозиция и рефакторинг не проводился, так как задание было написано 31-го августа и поджимали сроки

$(document).ready(function(){
	//инициализация констант
	$("#start").bind("click",function(e){newGame();});
	$("#oneStep").bind("click",function(e){oneStep();});

	for (i=2;i<=14;i++){
		for (lear_name in LEARS){
			ALL_CARDS.push({card:i,lear:LEARS[lear_name]});
		}
	}
});

function newGame(){
	//инициализация переменных для всей игры
	playerCards = [new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array()];
	currentCone = [new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array()];
	gamingConePlayers = new Array();
	countPlayers = $("#countPlayers").attr("value");
	//alert(countPlayers + "!");
	for (i=1;i<=MAX_COUNT_PLAYERS;i++){
		$("#player"+ i).css("display","none");
	}
	for (i=1;i<=countPlayers;i++){
		$("#player"+ i).css("display","block");
	}

	//начало игры
	distributionCards();
	displayCountCards();
	displayCards();
}

function distributionCards(){
	var countCardsForPlayer = Math.floor(COUNT_CARDS / countPlayers);

	for (i=0;i<countPlayers;i++){
		gamingConePlayers[i]= true;
	}
	
	var shuffleCards = shuffle(ALL_CARDS);	
	for (i=0;i<countPlayers;i++){
		for (j=0;j<countCardsForPlayer;j++){
			playerCards[i][j]=shuffleCards[i*countCardsForPlayer+j];
		}		
	}	
}	

function displayCountCards(){
	for(i=1;i<=countPlayers;i++){
		$("#player"+ i).text("Игрок "+ i+ " количество карт: "+ playerCards[i-1].length);
	}
}

function displayCards(){
	var textCards = "";
	for(i=1;i<=countPlayers;i++){
		textCards += "Игрок " + i+ ": ";
		for (card in playerCards[i-1]) {
			textCards += " "+ getTextForDisplayOneCard(playerCards[i-1][card])+ ",";
		}
		textCards += '\n';
	}
	$("#textArea").text(textCards);
}

//сначала забираем карты, чтобы на экране увидеть как прошел ход, но чтоб не разбивать на отдельные шаги
function oneStep(){
	takeAwayCards();
	putNewCards()
}


function takeAwayCards(){
	var maxCard = getMaxFromCurrentCone();
	if (maxCard==1){
		return;	
	}
	for (i=1;i<=countPlayers;i++){
		if (currentCone[i-1][currentCone[i-1].length-1].card<maxCard){
			gamingConePlayers[i-1]=false;
		}
	}
	if (isOneGamingPlayers()){
		takeCardToOne();
		displayCards();
		displayCountCards();

		for (i=0;i<countPlayers;i++){
			gamingConePlayers[i]= true;
		}
	}
}

function isOneGamingPlayers(){
	var countActive=0;
	for (i=1;i<=countPlayers;i++){
		if (gamingConePlayers[i-1]){
			countActive++;
		}		
	}
	return countActive==1;
}

function takeCardToOne(){
	var winnerCone=	getWinnerCone();
	for (i=1;i<=countPlayers;i++){
		while (currentCone[i-1].length>0){
			var card = currentCone[i-1].pop();
			if (card.card==1){
				continue;			
			}
			playerCards[winnerCone].push(card);
		}
	}
}

function getWinnerCone(){
	for (i=0;i<countPlayers;i++){
		if (gamingConePlayers[i]){
			return i;
		}	
	}	
}

function getMaxFromCurrentCone(){
	var maxVal = 1;
	for (i=1;i<=countPlayers;i++){
		if (currentCone[i-1].length==0){
			continue;		
		}
		if (maxVal<currentCone[i-1][currentCone[i-1].length-1].card){
			maxVal = currentCone[i-1][currentCone[i-1].length-1].card;
		}		
	}
	return maxVal;
}


function putNewCards(){
	if (countPlaying()<=1){
		alert("end of game");
		return;
	}
	for (i=1;i<=countPlayers;i++){
		var card;
		if (playerCards[i-1].length>0 && gamingConePlayers[i-1]){
			card = playerCards[i-1].shift();
		}
		else{
			card = {card:1,lear:""};
		}
		$("#player"+ i).text($("#player"+ i).text()+ "  "+ getTextForDisplayOneCard(card));
		currentCone[i-1].push(card);
		
	}
	displayCards();
}

function countPlaying(){
	var countActive=0;
	for (i=1;i<=countPlayers;i++){
		if (playerCards[i-1].length>0){
			countActive++;
		}		
	}
	return countActive;
}


function getTextForDisplayOneCard(card){
	var result ="";
	result = card.card;
	if (card.card >10 || card.card ==1){
		result = DISPLAY_PICTURES[card.card];
	}
	result +=""+ card.lear;
	return result;
}

//данная функция взята из http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

