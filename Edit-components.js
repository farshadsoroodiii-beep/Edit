admin-panel\js\modules\cars\edit\components.js
/**
 * ==================================================
 * Cars Edit Components
 * ==================================================
 *
 * Responsibility:
 * Manage edit-only component behaviors.
 *
 * No:
 * - API
 * - Validation
 * - Mapping
 * - Business Logic
 *
 * Architecture:
 * IIFE Module
 * ==================================================
 */

const CarsEditComponents = (() => {

    /*==================================================
        INIT
    ==================================================*/

    function init() {

        disableCreateOnlyActions();

        console.log(
            "Cars Edit Components Initialized"
        );

    }

    /*==================================================
        REMOVE CREATE ONLY ACTIONS
    ==================================================*/

    function disableCreateOnlyActions() {

        const createOnlyButtons =

            document.querySelectorAll(
                "[data-create-only]"
            );

        if (
            !createOnlyButtons.length
        ) {

            return;

        }

        createOnlyButtons.forEach(button => {

            button.remove();

        });

    }

    /*==================================================
        PUBLIC
    ==================================================*/

    return {

        init

    };

})();
