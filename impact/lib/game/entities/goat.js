ig.module(
	'game.entities.goat'
)
.requires(
	'impact.entity'
)
.defines(function () {

    EntityGoat = EntityKnight.extend({
        animSheet: new ig.AnimationSheet('media/goat.png', 42, 47),
        size: { x: 42, y: 47 },
        speed: 5,
        health: 1,
        attackDelay: 8,
        check: function (other) {

            if (other instanceof EntityMonster) {
                if (other.flip != this.flip){
                    other.health += 4;
                    if(other.health > other.maxHealth) other.health = other.maxHealth;
                    this.kill()
                    ig.game.score += 10;
                }else {
                    this.kill();
                }
            }
        }
    });
});