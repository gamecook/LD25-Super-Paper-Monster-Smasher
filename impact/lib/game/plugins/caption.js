ig.module(
    'game.plugins.caption'
)
    .requires(
    'impact.game',
    'impact.font'
)
    .defines(function () {

        Caption = ig.Class.extend({
            captionDelay: -1,
            captionTimer: null,
            captionText: "",
            captionFont: new ig.Font('media/nokia-36.font.png'),

            init: function (alignment) {
                this.captionTimer = new ig.Timer();
            },

            draw: function () {
                //TODO need to support multi-line text
                if (this.captionDelay == -1) {
                    return;
                }

                ig.system.context.fillStyle = 'rgba(0,0,0,0.8)';
                ig.system.context.fillRect(0 * ig.system.scale, (ig.system.height - 80) * ig.system.scale, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);

                var x = ig.system.width / 2,
                    y = ig.system.height - 60;

                this.captionFont.draw(this.captionText, x, y, ig.Font.ALIGN.CENTER);

                if (this.captionTimer.delta() > this.captionDelay) {
                    this.captionDelay = -1;
                }
            },
            show: function (value, delay) {
                this.captionText = value;
                this.captionDelay = delay;
                this.captionTimer.reset();
            },
            hide: function () {
                this.captionDelay = -1;
            }


        });

        ig.Game.inject({
            captionInstance: new Caption(),
            displayCaption: function (value, delay) {
                this.captionInstance.show(value, delay ? delay : 2);
            },
            hideCaption: function () {
                this.captionInstance.hide();
            },
            draw: function () {
                this.parent();

                if (this.captionInstance.captionDelay > -1) {
                    this.captionInstance.draw();
                }
            }
        });

    });