ig.module(
	'game.entities.goat'
)
.requires(
	'impact.entity',
    'game.entities.knight'
)
.defines(function () {

    EntityGoat = EntityKnight.extend({
        animSheet: new ig.AnimationSheet('media/goat.png', 42, 47),
        size: { x: 42, y: 47 },
        speed: 5,
        health: 1,
        attackDelay: 8,
        bonusSFX: new ig.Sound('media/sounds/goat-powerup.*'),
        check: function (other) {

            if (other instanceof EntityMonster) {
                if (other.flip != this.flip){
                    other.health += 4;
                    if(other.health > other.maxHealth) other.health = other.maxHealth;
                    this.kill()
                    ig.score += 10;
                    this.bonusSFX.play();
                }else {
                    this.kill();
                }
            }
        }

    });
});