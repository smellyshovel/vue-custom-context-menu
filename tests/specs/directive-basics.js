module.exports = {
    "@tags": ["directive", "directive-basics"],

    beforeEach(browser) {
        browser.url('http://localhost:8080/directive-basics');
    },

    [`v-context-menu="null" doesn't open a context menu`] : function (browser) {
        browser.moveToElement(".target.cm-null", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").to.not.be.present;
        });
    },

    [`v-context-menu="null" also affects children`] : function (browser) {
        browser.moveToElement(".target.cm-null-child-none", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").to.not.be.present;
        });
    },

    [`v-context-menu="null" can be overwritten with another context menu`] : function (browser) {
        browser.moveToElement(".target.cm-null-child-cm-alpha", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").text.to.contain("alpha");
        });
    },

    [`v-context-menu="'cm-alpha'" opens the "cm-alpha" context menu`] : function (browser) {
        browser.moveToElement(".target.cm-alpha", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").text.to.contain("alpha");
        });
    },

    [`v-context-menu="'cm-alpha'" also affects children`] : function (browser) {
        browser.moveToElement(".target.cm-alpha-child-none", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").text.to.contain("alpha");
        });
    },

    [`v-context-menu="'cm-alpha'" can be overwritten with "null"`] : function (browser) {
        browser.moveToElement(".target.cm-alpha-child-cm-null", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").to.not.be.present;
        });
    },

    [`v-context-menu="'cm-alpha'" can be overwritten with another context menu`] : function (browser) {
        browser.moveToElement(".target.cm-alpha-child-cm-beta", 10, 10, function() {
            browser.mouseButtonClick("right");
            browser.expect.element(".context-menu").text.to.contain("beta");
        });
    },
};
