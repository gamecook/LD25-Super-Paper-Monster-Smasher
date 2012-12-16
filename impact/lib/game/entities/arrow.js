ig.module(
    'game.entities.arrow'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {
        EntityArrow = ig.Entity.extend({
    size:{x:4, y:4},
    offset:{x:2, y:2},
    animSheet:new ig.AnimationSheet('media/arrow.png', 20, 9),
    type:ig.Entity.TYPE.NONE,
    checkAgainst:ig.Entity.TYPE.A,
    collides:ig.Entity.COLLIDES.NONE,
    maxVel:{x:200, y:200},
    bounciness:0,
    bounceCounter:0,
    automatic:false,
    recoil:0,
    blastRadius:30,
    maxPool:1,
    flip: false,
    velYBase: 300,
    damage: 1,
    init:function (x, y, settings)
    {
        this.parent(x + (settings.flip ? -4 : 7), y, settings);
        this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
        this.vel.y = -(50 + (Math.random() * this.velYBase));
        this.addAnim('idle', 0.2, [0]);
        this.currentAnim.flip.x = this.flip;
    },
    handleMovementTrace:function (res)
    {
        this.parent(res);
        if (res.collision.x || res.collision.y)
        {
            this.bounce();
        }
    },
    check:function (other)
    {
        other.receiveDamage(this.damage, this);
        this.kill();
    },
    bounce:function ()
    {
        this.bounceCounter++;
        if (this.bounceCounter > 3)
        {
            this.kill();
        }
    }
});

        EntityProjectile = EntityArrow.extend({
            animSheet:new ig.AnimationSheet('media/projectile.png', 75, 74),
            size:{x:75, y:74},
            velYBase: 1000,
            damage: 3,
            bounciness:0.6,
            bounceCounter:0,
            shootSFX: new ig.Sound('media/sounds/shot.*'),
            bounceSFX: new ig.Sound('media/sounds/bounce.*'),
            init: function(x, y, settings)
            {
                this.parent(x, y - 300, settings)
                this.shootSFX.play();

            },
            handleMovementTrace:function (res)
            {
                this.parent(res);
                if (res.collision.x || res.collision.y)
                {
                    this.bounce();
                }
            },
            bounce:function ()
            {
                this.bounceCounter++;
                this.bounceSFX.play();
                this.damage --;
                if (this.bounceCounter > 3)
                {
                    this.kill();
                }
            },
        });
});