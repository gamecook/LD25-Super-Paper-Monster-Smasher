ig.module(
	'game.entities.knight'
)
.requires(
	'impact.entity'
)
.defines(function () {

    EntityKnight = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/knight.png', 20, 60),
        size: { x: 20, y: 60 },
        offset: { x: 0, y: 0 },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        speed: 25,
        gravityFactor: 0,
        attackDelay: 1,
        attackTimer: new ig.Timer(),
        attackValue: 1,
        bounciness: .3,
        health: 2,
        flip: false,
        hitSFX: new ig.Sound('media/sounds/hurt2.*'),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.currentAnim.flip.x = this.flip;
            //console.log("spawn goat");
        },
        update: function () {
            this.parent();
            var xdir = this.flip ? -1 : 1;
            this.vel.x += this.speed * xdir;

        },

        handleMovementTrace: function (res) {
            this.parent(res);

            if (res.collision.x) {
                //console.log("collision kill", res);
                this.kill(false);
            }
        },
        check: function (other) {

            if (other instanceof EntityMonster) {
                //console.log(other.flip, this.flip);
                if (other.flip != this.flip){
                    this.receiveDamage(1, other);
                    this.vel.x += 200 * (this.flip ? -1 : 1);
                ig.score ++;
             }else {

                if (this.attackTimer.delta() > this.attackDelay) {
                    this.attackTimer.reset();
                    other.receiveDamage(this.attackValue, this);
                    this.vel.x += 400 * (this.flip ? -1 : 1);
                }   
            }
            }
        },
        kill: function(showBlood)
        {
            this.parent();
            if(!showBlood)
            {
                ig.game.spawnEntity(EntityBloodPuddle, this.pos.x, this.pos.y + this.size.y-20, {flip: this.flip});
                ig.game.sortEntitiesDeferred();
            }
        },
        receiveDamage: function(value, target)
        {
            this.parent(value, target);
            this.hitSFX.play();
        }
    });


        EntityBloodPuddle = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/blood-puddle.png', 46, 16),
            flip: false,
            delay: 20,
            fadetime: 20,
            idleTimer: null,
            zindex: 100,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.currentAnim.flip.x = this.flip;
                this.idleTimer =  new ig.Timer();
            },
            update: function () {
                if (this.idleTimer.delta() > this.delay) {
                    this.kill();
                    //console.log("kll blood")
                    return;
                }

                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.delay - this.fadetime, this.delay,
                    1, 0
                );

            }

        });
});