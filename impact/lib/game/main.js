ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'game.entities.knight',
    'game.entities.archer',
    'game.levels.dungeon',
    'game.entities.death-explosion',
    'game.plugins.caption',
    'game.entities.goat',
    'game.plugins.tracking'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
    font: new ig.Font('media/nokia-56.font.png'),
    arrow: new ig.Image('media/arrows.png'),
    lifeBar: new ig.Image('media/life-bar.png'),
	player: null,
	screenBoundary: null,
	gravity: 300,
	score: 0,
	gameTimer: new ig.Timer(),
	levelTime: 0,
	quakeTimer: new ig.Timer(),
	duration: 1,
	strength: 3,
    tracking: null,
    enterSFX: new ig.Sound("media/sounds/enter-level.*"),

	init: function() {
        ig.score = 0;
	    // Initialize your game here; bind keys etc.
        this.tracking = new Tracking('UA-18884514-12');
	    //ig.input.initMouse();
	    ig.input.bind(ig.KEY.MOUSE1, "click");

	    this.loadLevel(LevelDungeon);

        ig.music.play("track2");
	},
	loadLevel: function(data)
	{
	    this.parent(data);
	    this.player = this.getEntitiesByType(EntityMonster)[0];
	    //console.log(data);
	    var map = this.getMapByName("main");
	    var tileSize = map.tilesize;
	    this.screenBoundary = {
	        min: tileSize, max: (map.width * tileSize) - (tileSize) - ig.system.width
	    };

	    this.displayCaption("Monster: You can't stop me!!!", 4);

	},
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		if (this.player) {
		    if (this.player.accel.x > 0 && this.instructText)
		        this.instructText = null;
		    this.screen.x = this.player.pos.x - (ig.system.width * .5);

		    if (this.screen.x < this.screenBoundary.min)
		        this.screen.x = this.screenBoundary.min;
		    else if (this.screen.x > this.screenBoundary.max)
		        this.screen.x = this.screenBoundary.max;

		    ig.game.screen.y = 0;
		    //console.log("screen x", this.screen.x, this.screenBoundary.max);
		}

		if (ig.input.pressed('click')) {
		    var direction = (ig.input.mouse.x > ig.system.width / 2) ? true : false;

		    if(direction)
		        this.player.move("right");
            else
		        this.player.move("left");
		}

	    // Add your own, additional update code here

		if (this.gameTimer.delta() > 1) {
		    this.gameTimer.reset();
		    this.levelTime++;
		}

	    // Handle screen shake
		var delta = this.quakeTimer.delta();
		if (delta < -0.1) {
		    this.quakeRunning = true;
		    var s = this.strength * Math.pow(-delta / this.duration, 2);
		    if (s > 0.5) {
		        ig.game.screen.x += Math.random().map(0, 1, -s, s);
		        ig.game.screen.y += Math.random().map(0, 1, -s, s);
		    }
		}
		else {
		    this.quakeRunning = false;
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
		
		var arrowPadding = 20;
		var arrowCenter = y - (316 * .5);
        // left arrow
		//this.arrow.drawTile(arrowPadding, arrowCenter, 0, 60, 316);

	    // left arrow
		//this.arrow.drawTile(ig.system.width - 60 - arrowPadding, arrowCenter, 0, 60, 316, true);

		this.font.draw(ig.score.toString().pad(6, "0"), 10, 3);


		var totalSec = this.levelTime;
		minutes = parseInt(totalSec / 60) % 60;
		seconds = totalSec % 60;

		var timeText = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

		this.font.draw(timeText, ig.system.width - this.font.widthForString(timeText) -10, 3);

		var health = this.player ? 8 - Math.floor((this.player.health/this.player.maxHealth) * 8) : 8;

		this.lifeBar.drawTile(616, 71, health, 160, 20);
	},
	shake: function (duration, strength, ignoreShakeLock) {
	    this.duration = duration ? duration : 1;
	    this.strength = strength ? strength : 3;

	    if (!ignoreShakeLock && this.quakeRunning) {
	        return;
	    }
        this.enterSFX.play();
	    this.quakeTimer.set(this.duration);
	}
});

        // This is a simple template for the start screen. Replace the draw logic with your own artwork
        StartScreen = ig.Game.extend({
            splash: new ig.Image('media/splash.png'),
            startSFX: new ig.Sound("media/sounds/start-game.*"),
            init:function ()
            {
                // Call parent since I injected logic into the ig.Game class for key binding
                //this.parent();

                ig.input.bind(ig.KEY.MOUSE1, "click")

                // Create tracking
                if (this.tracking)
                {
                    //Pull the tracking code from the config file
                    this.tracking = new Tracking(ig.config.system.trackingID);

                    // By default track the new gaem screen as a page
                    this.tracking.trackPage("/game/new-game-screen");
                }

                this.tracking = new Tracking('UA-18884514-12');

                // By default track the new gaem screen as a page
                this.tracking.trackPage("/game/new-game-screen");
                ig.music.play("track1");
            },
            update:function ()
            {
                if (ig.input.pressed('click'))
                {
                    ig.system.setGame(MyGame);
                    this.startSFX.play();
                }
                this.parent();
            },
            draw:function ()
            {
                this.parent();

                this.drawScreen();
            },
            drawScreen: function()
            {

                this.splash.draw(0,0);
                //TODO this should be coming from the config
                //var text = !ig.ua.mobile ? 'Press Spacebar To Start!' : 'Press Anywhere To Start!' //TODO need to have this configured better for touch controls

                //this.instructText.draw(text, ig.system.width * .5, ig.system.height * .5, ig.Font.ALIGN.CENTER);
            }

        })


        // This is a simple template for the start screen. Replace the draw logic with your own artwork
        GameOverScreen = ig.Game.extend({
            splash: new ig.Image('media/game-over.png'),
            captionFont: new ig.Font('media/nokia-36.font.png'),
            selectSFX: new ig.Sound("media/sounds/selection.*"),
            gameOverSFX: new ig.Sound("media/sounds/death-theme.*"),
            init:function ()
            {
                ig.music.fadeOut(2);

                ig.input.bind(ig.KEY.MOUSE1, "click")

                // Create tracking
                if (this.tracking)
                {
                    //Pull the tracking code from the config file
                    this.tracking = new Tracking(ig.config.system.trackingID);

                    // By default track the new gaem screen as a page
                    this.tracking.trackPage("/game/new-game-screen");
                }

                this.tracking = new Tracking('UA-18884514-12');

                // By default track the new gaem screen as a page
                this.tracking.trackPage("/game/game-over-screen");

                this.gameOverSFX.play();

            },
            update:function ()
            {
                if (ig.input.pressed('click'))
                {
                    ig.system.setGame(StartScreen);
                    this.selectSFX.play();
                }
                this.parent();
            },
            draw:function ()
            {
                this.parent();

                this.drawScreen();
            },
            drawScreen: function()
            {
                this.splash.draw(0,0);
                this.captionFont.draw(ig.score.toString().pad(6, "0"), 67, 203, ig.Font.ALIGN.LEFT);
                //this.captionFont.draw("000000000", 67, 303, ig.Font.ALIGN.LEFT);
                //
            }

        })



        if (ig.ua.mobile) {
            // Disable sound for all mobile devices
            ig.Sound.enabled = false;
        }



        // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main('#canvas', StartScreen, 60, 800, 480, 1);

        ig.music.add( new ig.Sound('media/sounds/heroic-theme.*'), "track1" );
        ig.music.add( new ig.Sound('media/sounds/dungeon-looper.*'), "track2" );
        ig.music.loop = true;
        ig.music.volume = 0.2;

    // UTILS
    String.prototype.pad = function (l, s) {
        return (l -= this.length) > 0
            ? (s = new Array(Math.ceil(l / s.length) + 1).join(s)).substr(0, s.length) + this + s.substr(0, l - s.length)
            : this;
    };
});
