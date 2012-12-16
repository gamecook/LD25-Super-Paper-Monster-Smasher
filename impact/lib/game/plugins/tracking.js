ig.module(
    'game.plugins.tracking'
)
    .requires(
)
    .defines(function ()
    {
        //TODO need to make this into a singleton
        Tracking = ig.Class.extend({
            debug:true,
            init:function (account)
            {
                if (_gaq)
                {
                    _gaq.push(['_trackPageview']);
                    if (account)
                        this.setAccount(account);
                }
                else
                {
                    this.analyticsNotFound();
                }
            },
            setAccount:function (account)
            {
                if (_gaq)
                    _gaq.push(['_setAccount', account]);
                else
                    this.analyticsNotFound();
            },
            trackPage:function (url)
            {
                if (_gaq)
                    _gaq.push(['_trackPageview', url]);
                else
                    this.analyticsNotFound();
            },
            trackEvent:function (category, action, label, value)
            {
                if (_gaq)
                    _gaq.push(['_trackEvent', category, action, label, value]);
                else
                    this.analyticsNotFound();

            },
            analyticsNotFound:function ()
            {
                if (this.debug) console.log("Tracking object not found.");
            }

        });

        // This sets up the Google Analytics code
        var _gaq = _gaq || [];

        (function ()
        {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();

    });