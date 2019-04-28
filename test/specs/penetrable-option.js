module.exports = {
    "@tags": ["options", "penetrable-option"],

    [`a penetrable context menu's overlay is penetrable`] : function (browser) {
        browser.url('http://localhost:8080/penetrable-option');

        browser.getLocationInView(".target.cm-impenetrable", function(pos) {
            let impenetrableTargetPos = pos.value;

            browser.moveToElement(".target.cm-penetrable", 10, 10, function() {
                browser.mouseButtonClick("right");
                browser.expect.element(".context-menu").text.to.contain("penetrable");

                browser.moveToElement(".context-menu-overlay", impenetrableTargetPos.x + 300, impenetrableTargetPos.y + 10, function() {
                    browser.mouseButtonClick("right");
                    browser.expect.element(".context-menu").text.to.contain("impenetrable");
                });
            })
        });
    },

    [`an impenetrable context menu's overlay is impenetrable`] : function (browser) {
        browser.url('http://localhost:8080/penetrable-option');

        browser.getLocationInView(".target.cm-penetrable", function(pos) {
            let penetrableTargetPos = pos.value;

            browser.moveToElement(".target.cm-impenetrable", 10, 10, function() {
                browser.mouseButtonClick("right").pause(1000);
                browser.expect.element(".context-menu").text.to.contain("impenetrable");

                browser.moveToElement(".context-menu-overlay", penetrableTargetPos.x + 300, penetrableTargetPos.y + 10, function() {
                    browser.mouseButtonClick("right").pause(1000);
                    browser.expect.element(".context-menu").to.not.be.present;
                });
            })
        });
    },
};
