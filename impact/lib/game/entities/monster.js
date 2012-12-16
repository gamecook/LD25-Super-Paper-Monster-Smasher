ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity'
)
.defines(function () {

    EntityMonster = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/monster.png', 160, 240),
        
        size: { x: 160, y: 240 },
        offset: { x: 0, y: 0 },
        type: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
        speed: 10,
        zIndex: 100,
        gravityFactor: 2,
        friction: { x: 400, y: 200 },
        speed: 400,
        flip: false,
        health: 10,
        maxHealth: 10,
        bounciness: .2,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.currentAnim.flip.x = this.flip;

            //console.log("New Knight", this.zIndex);
        },
        move: function (value) {
            if (!this.standing)
                return;
            switch (value) {
                case "right":
                    this.vel.x = this.speed;
                    this.flip = false;
                    break;
                case "left":
                    this.vel.x = -this.speed;
                    this.flip = true;
                    break;
            }


            this.currentAnim.flip.x = this.flip;
        },
        handleMovementTrace: function (res) {
            this.parent(res);
            if (res.collision.y && !this.standing) {
                ig.game.shake(2, 4);
            }
        },
        kill: function()
        {
            this.parent();
            ig.system.setGame(GameOverScreen);

        }
        /*receiveDamage: function (amount, from)
        {
            
            //TODO need to update lifebar

            this.parent(amount, from);

            if (this.health > 0) {
                //this.spawnParticles(2);
                console.log("attacked", this.health);
            }
        }*/
        /*update: function () {
            this.parent();
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
        },*/
    });

});