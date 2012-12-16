ig.module(
	'game.entities.archer'
)
.requires(
	'game.entities.knight',
    'game.entities.arrow'
)
.defines(function () {

    EntityArcher = EntityKnight.extend({
        animSheet: new ig.AnimationSheet('media/archer.png', 43, 62),
        speed: 10,
        attackDelay: 3,
        attackTimer: new ig.Timer(),
        attackValue: 1,
        bounciness: .3,
        health: 2,
        flip: false,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
        },
        update: function () {
            this.parent();

            if (this.attackTimer.delta() > this.attackDelay) {
                this.attackTimer.reset();
                var entity = ig.game.spawnEntity( EntityArrow, this.pos.x, this.pos.y, {flip:this.flip, parentEntity: this} );
            }

        },
        check: function (other) {

            if (other instanceof EntityMonster) {

                this.receiveDamage(1, other);
                this.vel.x += 200 * (this.flip ? -1 : 1);
                ig.game.score ++;

            }
        }
    });

});