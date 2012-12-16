ig.module(
    'game.entities.spawner'
)
    .requires(
    'impact.entity'
)
.defines(function () {

    EntitySpawner = ig.Entity.extend({
        idleTimer: null,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        _wmScalable: true,
        size: {x: 80, y: 80},
        delay: 3,
        maxVel: { x: 0, y: 0 },
        spawnEntity: null,
        target: null,
        targets: [],
        randomSpawnPoint: false,
        pool: 0,
        maxPool: -1,
        activationDelay: 0,
        activationTimer: new ig.Timer(),
        _wmScalable: true,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.idleTimer = new ig.Timer();
            // Transform the target object into an ordered array of targets
            this.targets = ig.ksort(this.target);
        },
        update: function () {
            if (this.idleTimer.delta() > this.delay) {
                this.idleTimer.reset();
                this.spawnNewEntity();
            }
            this.parent();
        },
        spawnNewEntity: function (settings) {
            if (this.pool < this.maxPool || this.maxPool == -1) {
                if (!settings) settings = { spawner: this };
                var x = this.pos.x;
                var y = this.pos.y;
                if (this.targets.length > 0) {
                    //TODO make sure this is always in bounds
                    var rand = (Math.random());
                    //console.log("random", rand, (this.targets.length - 1), Math.floor(Math.random() * (this.targets.length))); 
                    var index = Math.floor(Math.random() * (this.targets.length));
                    
                    
                    var newTarget = ig.game.getEntityByName(this.targets[index]);
                    //console.log("index", index, newTarget.flip);
                    settings.flip = newTarget.flip;

                    x = this.randomSpawnPoint ? Math.round(Math.random() * newTarget.size.x) + newTarget.pos.x : newTarget.pos.x;
                    y = this.randomSpawnPoint ? Math.round(Math.random() * newTarget.size.y) + newTarget.pos.y : newTarget.pos.y;
                }

                var row = Math.floor(y / 20);
                settings.zindex = row - Math.floor(ig.system.height / 20);

                if (this.spawnEntity)
                    ig.game.spawnEntity(this.spawnEntity, x, row * 20, settings);

                // Sort entites to make sure newly spawned entites are at the correct Z index
                ig.game.sortEntitiesDeferred();
                this.pool++;
            }
        },
        draw: function () {
        },
        removeItem: function () {
            this.pool--;
        }
    });


});