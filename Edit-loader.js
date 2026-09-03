admin-panel\js\modules\cars\edit\loader.js
/*==================================================
    CARS EDIT LOADER

    Responsible for:
    - Loading car data
    - Mapping response data
    - Populating edit form
    - Initializing Main Vehicle Images State
    - Initializing Display Locations State

    No:
    - Validation
    - Submit logic
    - API definition
    - Gallery logic
    - Main Image business logic
    - Display Locations UI logic

    Architecture:
    IIFE Module

    IMPORTANT:

    Display Locations is an independent domain.

    A Display Locations initialization failure
    MUST NOT prevent:

    - Form initialization
    - Main Vehicle Images initialization
    - Gallery initialization
    - Edit page lifecycle

==================================================*/

'use strict';

const CarsEditLoader = (() => {

    let form = null;

    let carId = null;

    /*==================================================
        INIT
    ==================================================*/

    function init(options = {}) {

        form =
            options.form || null;

        carId =
            options.carId || null;

    }

    /*==================================================
        LOAD CAR
    ==================================================*/

    async function load() {

        if (!form) {

            console.error(
                "Cars Edit Loader: Form not found."
            );

            return false;

        }

        if (!carId) {

            console.error(
                "Cars Edit Loader: Car ID missing."
            );

            return false;

        }

        try {

            const response =
                await CarsEditAPI.loadCar(
                    carId
                );

            /*==========================================
                FORM
            ==========================================*/

            const formData =
                CarsEditMapper.mapResponseToForm(
                    response
                );

            FormFields.populate(
                form,
                formData
            );

            /*==========================================
                MAIN VEHICLE IMAGES
            ==========================================*/

            initializeMainVehicleImages(
                response
            );

            /*==========================================
                DISPLAY LOCATIONS
            ==========================================*/

            /*
             * Display Locations is an independent
             * domain.
             *
             * CarsEditLoader only provides the
             * authoritative Edit response.
             *
             * The dedicated DisplayLocationsLoader
             * owns:
             *
             *     response.locations[]
             *             ↓
             *     section_slug[]
             *             ↓
             *     DisplayLocationsState
             *
             * Failure is isolated so it cannot abort
             * the remaining Edit lifecycle.
             */

            initializeDisplayLocations(
                response
            );

            /*==========================================
                COMPLETE
            ==========================================*/

            console.log(
                "Cars Edit Data Loaded"
            );

            return true;

        }

        catch(error) {

            console.error(
                "Cars Edit Load Error:",
                error
            );

            handleError(error);

            return false;

        }

    }

    /*==================================================
        INITIALIZE MAIN VEHICLE IMAGES
    ==================================================*/

    function initializeMainVehicleImages(
        response
    ) {

        if (
            typeof MainVehicleImagesState ===
                "undefined"
        ) {

            throw new Error(
                "MainVehicleImagesState is not loaded."
            );

        }

        if (
            !response ||
            typeof response !== "object"
        ) {

            throw new Error(
                "Cars Edit Loader: Invalid car response."
            );

        }

        if (
            !response.car ||
            typeof response.car !== "object"
        ) {

            throw new Error(
                "Cars Edit Loader: Car data is missing."
            );

        }

        const car =
            response.car;

        /*
         * MainVehicleImagesState already received the
         * shared Edit Session ID from CarsEdit.
         *
         * Loader does not create, read, or manage
         * the Session lifecycle.
         */

        MainVehicleImagesState.initialize({

            main_image:
                car.main_image || null,

            background_image:
                car.background_image || null

        });

        console.log(
            "Main Vehicle Images State initialized."
        );

    }

    /*==================================================
        INITIALIZE DISPLAY LOCATIONS
    ==================================================*/

    function initializeDisplayLocations(
        response
    ) {

        /*
         * Display Locations is intentionally isolated
         * from the main Edit loading lifecycle.
         *
         * The authoritative response contract is:
         *
         *     response.locations[]
         *
         * The dedicated Loader owns the transformation:
         *
         *     locations[]
         *          ↓
         *     section_slug[]
         *          ↓
         *     DisplayLocationsState
         *
         * CarsEditLoader does not inspect, filter,
         * normalize, or transform location data.
         */

        if (
            typeof DisplayLocationsLoader ===
                "undefined"
        ) {

            console.error(
                "Cars Edit Loader: DisplayLocationsLoader is not loaded."
            );

            return false;

        }

        try {

            DisplayLocationsLoader.load(
                response
            );

            /*
             * Do NOT log "Display Locations State
             * initialized" here.
             *
             * The dedicated DisplayLocationsLoader
             * owns that lifecycle message.
             */

            return true;

        }

        catch(error) {

            /*
             * Display Locations is an independent
             * Edit domain.
             *
             * Failure must never propagate into
             * the main Cars Edit Loader.
             */

            console.error(
                "Cars Edit Loader: Display Locations initialization failed.",
                error
            );

            return false;

        }

    }

    /*==================================================
        ERROR
    ==================================================*/

    function handleError(error) {

        if (
            typeof FormErrorManager !== "undefined"
        ) {

            FormErrorManager.handleBackend(
                error
            );

            return;

        }

        console.error(
            "Cars Edit Loader Error:",
            error
        );

    }

    /*==================================================
        PUBLIC
    ==================================================*/

    return {

        init,

        load

    };

})();
