var GameState = {
    preload: function(){
        this.load.image('background', 'images/background.png');
        this.load.image('arrow', 'images/arrow.png');
        this.load.spritesheet('chicken', 'images/chicken_spritesheet.png', 131, 200, 3);
        this.load.spritesheet('horse', 'images/horse_spritesheet.png', 212, 200, 3);
        this.load.spritesheet('pig', 'images/pig_spritesheet.png', 297, 200, 3);
        this.load.spritesheet('sheep', 'images/sheep_spritesheet.png', 244, 200, 3);
    },
    create: function(){

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignertically = true;
        this.scale.setScreenSize(true);

        //create a sprite for a background
        this.background = this.game.add.sprite(0, 0, 'background');

        
        

        //group for animal
        var animalData = [
            {key: 'chicken', text: 'CHICKEN'},
            {key: 'horse', text: 'HORSE'},
            {key: 'pig', text: 'PIG'},
            {key: 'sheep', text: 'SHEEP'}
        ];

        this.animals = this.game.add.group();

        var self = this;
        var animal;

        animalData.forEach(function(element) {
            animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);
            
            animal.customParams = {text: element.text};
            animal.anchor.setTo(0.5);

            //animal animation
            animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false)

            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, self);

        });

        this.currentAnimal = this.animals.next();
        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY)

        this.showText(this.currentAnimal);

        //left arrow
        this.leftArrow = this.game.add.sprite(60, this.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.x = -1;
        this.leftArrow.customParams = {direction: 1};
        

        //left arrow user input
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

        //right arrow
        this.rightArrow = this.game.add.sprite(580, this.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {direction: -1};

        //left arrow user input
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

    },
    //this is executed multiple time per second
    update: function(){
        
    },
    animalTorture: function() {

    },
    animateAnimal: function(sprite, event) {
        sprite.play('animate')
    },
    switchAnimal: function(sprite, event) {
        if (this.isMoving) {
            return false;
            this.showText(this.currentAnimal);
        };
        this.isMoving = true;
        
        //hide text
        this.animalText.visible = false;



        var newAnimal, endX;

        if (sprite.customParams.direction > 0) {
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width/2;
            endX = 640 + this.currentAnimal.width/2;
        }
        else {
            newAnimal = this.animals.previous();
            newAnimal.x = 640 + newAnimal.width/2;
            endX = -this.currentAnimal.width/2;
        }
        
        
        var newAnimalMovement = this.game.add.tween(newAnimal);
        newAnimalMovement.to({x: this.game.world.centerX}, 1000)
        newAnimalMovement.onComplete.add(function() {
            this.isMoving = false;
            this.showText(this.currentAnimal);
        }, this);
        newAnimalMovement.start();

        var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x: endX}, 1000);
        currentAnimalMovement.start();

        this.currentAnimal = newAnimal;
    },
    showText: function(animal) {
        if (!this.animalText) {
            var style = {
                font: 'bold 30pt Arial',
                fill: '#D0171B',
                align: 'center'
            }
            this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
        }
        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
    }
        
    
};

var game = new Phaser.Game(640, 360, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');