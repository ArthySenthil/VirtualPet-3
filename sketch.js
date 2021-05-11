var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
  sadDog=loadImage("../VirtualPet/images3/Dog.png");
  happyDog=loadImage("../VirtualPet/images3/happyDog.png");
  garden=loadImage("../VirtualPet/images3/Garden.png");
  washroom=loadImage("../VirtualPet/images3/WashRoom.png");
  bedroom=loadImage("../VirtualPet/images3/BedRoom.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);

  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  
}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Play");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleep");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bath");
      foodObj.washroom();
   }else{
    update("Hunger")
    foodObj.display();
   }
   
   if(gameState!="Hunger"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hunger"
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


function update(state){
  database.ref('/').update({
    gameState:state
  })
}