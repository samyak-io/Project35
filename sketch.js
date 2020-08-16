//Create variables here
var dog;
var happyDog;
var database;
var foodS;
var foodStock;
var dogImg;
var happyDogImg;

//variables for buttons to feed the dog and add the food
var feedDog;
var addFoods;

var fedTime;
var lastFed;

var foodObj;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
	var canvas = createCanvas(800, 500);
  
   dog = createSprite(width/2,height/2,10,10);
   dog.addImage(dogImg);
   dog.scale = 0.12;

   food = new Food();

   //creating buttons 
   feed=createButton("Feed the dog");
   feed.position(700,95);
   feed.mousePressed(feedDog);

   addFood=createButton("Add Food"); 
   addFood.position(800,95);
   addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);

    //display Food
    food.display();
    drawSprites();

  //add styles here
  // textSize(14);
  // fill("white");
  // stroke(0.5);
  // strokeWeight(1.2);
  //text("NOTE: PRESS UP ARROW KEY TO FEED DRAGO MILK!",width/2 -200,height/2+220);

  // text("FOOD REMAINING: " + foodS, 20,50);

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  fill(255,255,255);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : " + lastFed%12+ "PM",350,30);
  } else if(lastFed==0){
    text("Last Fed : 12AM",350,350);
  } else{
    text("Last Fed :" + lastFed+"AM",350,30);
  }
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<= 0){
    x=0;
  }else {
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}