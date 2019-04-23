describe("The v-context-menu directive basic behavior", function() {
    beforeEach(function() {
        cy.visit("/directive-basics");
    });

    it(`v-context-menu="null" doesn't open a context menu`, function() {
        cy.get(".target[data-cy='cm-null']")
            .trigger("contextmenu")
            .wait(10);

        cy.get(".context-menu")
            .should("not.exist");
    });

    it(`v-context-menu="null" also affects children`, function() {
        cy.get(".target[data-cy='cm-null-child-none']")
            .trigger("contextmenu")
            .wait(10);

        cy.get(".context-menu")
            .should("not.exist");
    });

    it(`v-context-menu="null" can be overwritten with another context menu`, function() {
        cy.get(".target[data-cy='cm-null-child-cm-alpha']")
            .trigger("contextmenu")
            .wait(10);

        cy.contains(".context-menu", "cm-alpha");
    });

    it(`v-context-menu="'cm-alpha'" opens the "cm-alpha" context menu`, function() {
        cy.get(".target[data-cy='cm-alpha']")
            .trigger("contextmenu")
            .wait(10);

        cy.contains(".context-menu", "cm-alpha");
    });

    it(`v-context-menu="'cm-alpha'" also affects children`, function() {
        cy.get(".target[data-cy='cm-alpha-child-none']")
            .trigger("contextmenu")
            .wait(10);

        cy.contains(".context-menu", "cm-alpha");
    });

    it(`v-context-menu="'cm-alpha'" can be overwritten with "null"`, function() {
        cy.get(".target[data-cy='cm-alpha-child-cm-null']")
            .trigger("contextmenu")
            .wait(10);

        cy.get(".context-menu")
            .should("not.exist");
    });

    it(`v-context-menu="'cm-alpha'" can be overwritten with another context menu`, function() {
        cy.get(".target[data-cy='cm-alpha-child-cm-beta']")
            .trigger("contextmenu")
            .wait(10);

        cy.contains(".context-menu", "cm-beta");
    });
});
