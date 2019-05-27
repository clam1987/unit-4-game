$(document).ready(function() {
  //Function to start and select a Hero
  function selectHero(heroHp, heroName, heroAP) {
    $('#jaina, #anduin, #valeera, #garrosh').on("click", function(event) {
      //Remove the hero from the start div
      $("#start").empty();

    //   //Display selected hero
      var pickedHero = event.currentTarget.id;
      $("#hero").html(
        `<div id=${pickedHero}> ${
          heroName[pickedHero]}
            \n<img class="img-thumbnail" src="assets/images/${pickedHero}.png" alt=""\n<p id="${pickedHero}Value">${
          heroHp[pickedHero]
        }</p></div>`
      );

      //Display Possible Enemies
      var pickedEnemy = Object.keys(heroName).filter(enemy => {
        return enemy !== pickedHero;
      });
      //Display filtered list of heroes in the enemy div
      pickedEnemy.forEach(enemy => {
        //append enemies
        $("#enemy").append(
          `<div class="w-25 p-3" id=${enemy}> ${
            heroName[enemy]
          }\n<img class="img-thumbnail" src="assets/images/${enemy}.png" alt=""\n<p id="${enemy}Value">${
            heroHp[enemy]
          }</p></div>`
        );
         //Change enemy background colors to red
        $(`#${enemy}`).css({
          "background-color": "red",
          "border-color": "black",
          "border-width": "1px",
          padding: "2px"
        });
      });

     
      //1. Determine enemy ID
      var enemyId = pickedEnemy
        .map(enemy => {
          return `#${enemy}`;
        })
        .toString();
      //Choose a Hero
      var click = 0;
      //2. Enemy Hero is chosen from the list
      $(enemyId).one("click", function(enemy) {
        click++;
        //Limiting click to just 1 click so user cannot click enemy more then once.
        if (click === 1) {
          var enemy = enemy.currentTarget.id;
          //remove enemy from div
          $(`#${enemy}`).remove();

          //add enemy to defender div
          $("#defender").html(
            `<div id=${enemy}> ${
              heroName[enemy]
            }\n<img class="img-thumbnail" src="assets/images/${enemy}.png" alt="">\n <p id="${enemy}Value">${
              heroHp[enemy]
            }</p></div>`
          );
        }
      });
    });
  };

  //function to display chosen enemy in defender div
  function displayEnemy(remaningEnemies, heroName, heroHp) {
      $(remaningEnemies.toString()).one("click", function(enemy) {
          var enemy = enemy.currentTarget.id;
          //remove enemy from enemy div
          $(`#${enemy}`).remove();

          //add enemy to defender div
          $("#defender").html(
              `<div id=${enemy}> ${
                  heroName[enemy]
              }\n<img class="img-thumbnail" src="./assets/images/${enemy}.png" alt="">\n <p id="${enemy}Value">${
                  heroHp[enemy]
              }</p></div>`
          );
          $("#defender").show();
      });
  };

//function for attack button
function attack(heroHp, heroName, heroAP) {
    // keep track of number of defeated enemies and number of clicks
    var defeatedEnemylist = [];
    var clicks = 1;

    $("#attack").on("click", function(event) {
        //only works if there is a hero chosen
        if ($("#start").children().length !==4 && $("#defender").children().length !== 0) {
            // 1. Determine Hero and Enemy Hero
            var hero = $("#hero").children()[0].id;
            var enemyHero = $("#defender").children()[0].id;

            // 2) attack - health depedent on clicks on enemy
            heroHp[enemyHero] -= heroAP[hero] * clicks;
            $(`#${enemyHero}Value`).html(heroHp[enemyHero]);
            if (heroHp[enemyHero] > 0) {
                // attack - health dependent on clicks on hero
                heroHp[hero] -= heroAP[enemyHero];
                $(`#${hero}Value`).html(heroHp[hero]);
      
            }
            // 3) display messages of battle
            if (heroHp[hero] > 0 && heroHp[enemyHero] > 0) {
                //Condition on both hero and enemy are alive
                $("#message").html(
                    `<p>You attacked ${heroName[enemyHero]} for ${heroAP[hero] * clicks} damage.</p><p>${
                        heroName[enemyHero]
                    } Counter attacks for ${heroAP[enemyHero]} damage.`
                );
            } else if (heroHp[hero] > 0 && heroHp[enemyHero] < 0) {
                //if enemy is dead then add new enemy to the list by prompting user for new enemy
                defeatedEnemylist.push(enemyHero);
                $("#message").html(
                    `<p>You have defeated ${heroName[enemyHero]}, a new challenger has entered the arena!`
                );
                //hide defeated defender img
                $("#defender").hide();
                var remaningEnemies = [];
                for (var i = 0; i < $("#enemy").children().length; i++) {
                    remaningEnemies.push("#" + $("#enemy").children()[i].id);
                }
                displayEnemy(remaningEnemies, heroName, heroHp);

                //determine length of defeated enemies
                defeatedEnemylist = Array.from(new Set(defeatedEnemylist));
                //if all enemies defeated, player profits
                if (defeatedEnemylist === 3) {
                    $("#message").text("You Win!");
                    $("#message").append("<br><button id='restart'>Restart</button");
                }
            } else {
                // Player loses the game condition
                $("#messsge").text("You Lost!");
                $("#message").append("<br><button id='restart'>Restart</button");
            }
            clicks++;
        }
    });
};
//function to start game
function start() {
    var heroHp = {
        jaina: 150,
        anduin: 135,
        valeera: 110,
        garrosh: 200
    };

    var heroName = {
        jaina: "Jaina Proudmoore",
        anduin: "Anduin Wrynn",
        valeera: "Valeera Sanguinar",
        garrosh: "Garrosh Hellscream"
    };

    var heroAP = {
        jaina: 14,
        anduin: 10,
        valeera: 25,
        garrosh: 11
    };
    selectHero(heroHp, heroName, heroAP);
    attack(heroHp, heroName, heroAP);    
};

// function to restart game
$(document).on("click", "#restart", function() {
    location.reload();
    start();
});


//start game
start();


});
