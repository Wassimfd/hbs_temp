(function() {


	// Throttle funtion
	function throttle(fn, threshhold, scope) {
        threshhold = typeof threshhold !== "undefined" ? threshhold : 250;
        var
            last,
            deferTimer;
        return function () {
            var
                context = scope || this,
                now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

	if(!window.script) {

		window.script = {

		}
	}
	

})();