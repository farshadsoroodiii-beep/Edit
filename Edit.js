admin-panel\js\modules\cars\edit\edit.js
/*==================================================
    CARS EDIT MODULE

    Vehicle Edit Page Controller

    Responsible for:
    - Route initialization
    - Edit Session lifecycle
    - Loading shared components
    - Initializing brands
    - Initializing registry
    - Starting edit form
    - Starting Display Locations UI
    - Starting images module
    - Starting Main Vehicle Images Preview
    - Starting Main Vehicle Images uploader
    - Starting Main Vehicle Images actions
    - Providing Edit Session ID to independent
      image domains

    No:
    - API Logic
    - Validation Logic
    - Submit Logic
    - Image Business Logic
    - Display Locations State Logic
    - Display Locations API Logic

    Architecture:
    IIFE Module

    Version : 2.6

==================================================*/

'use strict';

const CarsEdit = (() => {

    /*==================================================
        GET CAR ID
    ==================================================*/

    function getCarId() {

        const params =
            new URLSearchParams(
                window.location.hash.split("?")[1]
            );

        return params.get("id");

    }

    /*==================================================
        START EDIT SESSION
    ==================================================*/

    function startEditSession() {

        if (
            typeof CarsImagesState === "undefined"
        ) {

            console.error(
                "CarsImagesState is not loaded."
            );

            return null;

        }

        const sessionId =
            CarsImagesState.startSession();

        if (!sessionId) {

            console.error(
                "Cars Edit: Failed to start Edit Session."
            );

            return null;

        }

        console.log(
            "Cars Edit Session started:",
            sessionId
        );

        return sessionId;

    }

    /*==================================================
        INITIALIZE MAIN VEHICLE IMAGES SESSION
    ==================================================*/

    function initializeMainVehicleImagesSession(
        sessionId
    ) {

        if (
            typeof MainVehicleImagesState ===
                "undefined"
        ) {

            console.error(
                "MainVehicleImagesState is not loaded."
            );

            return false;

        }

        if (
            !sessionId
        ) {

            console.error(
                "Cars Edit: Main Vehicle Images Session ID is missing."
            );

            return false;

        }

        try {

            MainVehicleImagesState.setSessionId(
                sessionId
            );

            console.log(
                "Main Vehicle Images Session initialized."
            );

            return true;

        }

        catch(error) {

            console.error(
                "Cars Edit: Failed to initialize Main Vehicle Images Session.",
                error
            );

            return false;

        }

    }

    /*==================================================
        INITIALIZE DISPLAY LOCATIONS
    ==================================================*/

    function initializeDisplayLocations() {

        if (
            typeof DisplayLocations ===
                "undefined"
        ) {

            console.error(
                "DisplayLocations is not loaded."
            );

            return false;

        }

        try {

            const initialized =
                DisplayLocations.init();

            if (!initialized) {

                console.error(
                    "Cars Edit: Display Locations UI initialization failed."
                );

                return false;

            }

            /*
             * DisplayLocations.init() owns its own
             * initialization log.
             *
             * CarsEdit does not emit another success
             * message here.
             */

            return true;

        }

        catch(error) {

            /*
             * Display Locations is an independent UI
             * domain.
             *
             * Its UI failure must not prevent the
             * remaining Edit page domains from starting.
             */

            console.error(
                "Cars Edit: Failed to initialize Display Locations UI.",
                error
            );

            return false;

        }

    }

    /*==================================================
        INITIALIZE MAIN VEHICLE IMAGES PREVIEW
    ==================================================*/

    async function initializeMainVehicleImagesPreview(
        carId
    ) {

        if (
            typeof MainVehicleImagesPreview ===
                "undefined"
        ) {

            console.error(
                "MainVehicleImagesPreview is not loaded."
            );

            return false;

        }

        if (
            !carId
        ) {

            console.error(
                "Cars Edit: Main Vehicle Images Preview Car ID is missing."
            );

            return false;

        }

        try {

            /*
             * Preview is initialized only after
             * CarsEditForm.init() has completed.
             *
             * CarsEditForm.init() waits for
             * CarsEditLoader.load().
             *
             * CarsEditLoader.load() initializes
             * MainVehicleImagesState with the
             * authoritative car.main_image and
             * car.background_image values.
             *
             * Therefore Preview can safely render
             * the current Main Vehicle Images State
             * here.
             */

            await MainVehicleImagesPreview.init({

                carId

            });

            console.log(
                "Main Vehicle Images Preview initialized."
            );

            return true;

        }

        catch(error) {

            console.error(
                "Cars Edit: Failed to initialize Main Vehicle Images Preview.",
                error
            );

            return false;

        }

    }

    /*==================================================
        INITIALIZE MAIN VEHICLE IMAGES UPLOADER
    ==================================================*/

    function initializeMainVehicleImagesUploader(
        carId
    ) {

        if (
            typeof MainVehicleImagesUploader ===
                "undefined"
        ) {

            console.error(
                "MainVehicleImagesUploader is not loaded."
            );

            return false;

        }

        if (
            !carId
        ) {

            console.error(
                "Cars Edit: Main Vehicle Images Uploader Car ID is missing."
            );

            return false;

        }

        try {

            MainVehicleImagesUploader.init({

                carId

            });

            console.log(
                "Main Vehicle Images Uploader initialized."
            );

            return true;

        }

        catch(error) {

            console.error(
                "Cars Edit: Failed to initialize Main Vehicle Images Uploader.",
                error
            );

            return false;

        }

    }

    /*==================================================
        INIT
    ==================================================*/

    async function init() {

        try {

            console.log(
                "Cars Edit Initializing..."
            );

            const carId =
                getCarId();

            if (!carId) {

                console.error(
                    "Car ID not found."
                );

                return;

            }

            /*==========================================
                EDIT SESSION
            ==========================================*/

            /*
             * CarsEdit owns the Edit Page lifecycle.
             *
             * Exactly one Session ID is created when
             * entering the Edit page.
             *
             * Independent image domains receive the
             * same Session ID.
             */

            const sessionId =
                startEditSession();

            if (!sessionId) {

                return;

            }

            /*==========================================
                MAIN VEHICLE IMAGES SESSION
            ==========================================*/

            /*
             * Main Vehicle Images is an independent
             * domain from Gallery.
             *
             * It does NOT read the Session ID from
             * CarsImagesState.
             *
             * CarsEdit explicitly provides the shared
             * Edit Session ID.
             */

            if (
                !initializeMainVehicleImagesSession(
                    sessionId
                )
            ) {

                return;

            }

            /*==========================================
                LOAD COMPONENTS
            ==========================================*/

            if (
                typeof CarsFormComponents === "undefined"
            ) {

                console.error(
                    "CarsFormComponents is not loaded."
                );

                return;

            }

            await CarsFormComponents.loadAll();

            /*==========================================
                EDIT COMPONENTS
            ==========================================*/

            if (
                typeof CarsEditComponents === "undefined"
            ) {

                console.error(
                    "CarsEditComponents is not loaded."
                );

                return;

            }

            CarsEditComponents.init();

            /*==========================================
                BRANDS
            ==========================================*/

            if (
                typeof CarsBrands === "undefined"
            ) {

                console.error(
                    "CarsBrands module is not loaded."
                );

                return;

            }

            await CarsBrands.init(
                "brand_id",
                "انتخاب برند"
            );

            /*==========================================
                REGISTRY
            ==========================================*/

            if (
                typeof CarsEditRegistry === "undefined"
            ) {

                console.error(
                    "CarsEditRegistry is not loaded."
                );

                return;

            }

            CarsEditRegistry.init();

            /*==========================================
                FORM
            ==========================================*/

            if (
                typeof CarsEditForm === "undefined"
            ) {

                console.error(
                    "CarsEditForm module is not loaded."
                );

                return;

            }

            /*
             * IMPORTANT:
             *
             * CarsEditForm.init() performs the complete
             * Edit data loading lifecycle.
             *
             * Internally:
             *
             * CarsEditForm.init()
             *      ↓
             * CarsEditLoader.load()
             *      ↓
             * CarsEditAPI.loadCar()
             *      ↓
             * CarsEditMapper.mapResponseToForm()
             *      ↓
             * FormFields.populate()
             *      ↓
             * MainVehicleImagesState.initialize()
             *      ↓
             * DisplayLocationsLoader.load()
             *      ↓
             * DisplayLocationsState.setBaseline()
             *      ↓
             * FormState.captureBaseline()
             *
             * Therefore both independent State domains
             * are populated before their UI modules
             * are initialized.
             */

            await CarsEditForm.init(
                carId
            );

            /*==========================================
                DISPLAY LOCATIONS UI
            ==========================================*/

            /*
             * Display Locations State has already been
             * initialized by CarsEditLoader.
             *
             * The UI module now only connects the
             * existing State to the rendered checkboxes.
             *
             * It does NOT fetch data.
             * It does NOT initialize State.
             * It does NOT create a baseline.
             */

            initializeDisplayLocations();

            /*==========================================
                MAIN VEHICLE IMAGES PREVIEW
            ==========================================*/

            /*
             * media.html has already been loaded by
             * CarsFormComponents.loadAll().
             *
             * MainVehicleImagesState has already been
             * initialized by CarsEditLoader.
             *
             * Preview therefore starts after the
             * authoritative Edit data has entered State.
             */

            if (
                !await initializeMainVehicleImagesPreview(
                    carId
                )
            ) {

                return;

            }

            /*==========================================
                IMAGES MODULE
            ==========================================*/

            if (
                typeof CarsImages === "undefined"
            ) {

                console.error(
                    "CarsImages module is not loaded."
                );

                return;

            }

            await CarsImages.init(
                carId
            );

            /*==========================================
                MAIN VEHICLE IMAGES UPLOADER
            ==========================================*/

            /*
             * media.html has already been loaded by
             * CarsFormComponents.loadAll().
             *
             * Preview has already been initialized.
             *
             * Therefore:
             *
             * 1. Existing Main Vehicle Images have
             *    already been rendered.
             *
             * 2. Preview is listening for:
             *
             *    main-vehicle-image:uploaded
             *
             * 3. The uploader can now safely bind to:
             *
             *    #main_image
             *    #background_image
             */

            if (
                !initializeMainVehicleImagesUploader(
                    carId
                )
            ) {

                return;

            }

            /*==========================================
                MAIN VEHICLE IMAGES ACTIONS
            ==========================================*/

            if (
                typeof MainVehicleImagesActions === "undefined"
            ) {

                console.error(
                    "MainVehicleImagesActions is not loaded."
                );

                return;

            }

            try {

                MainVehicleImagesActions.init();

                console.log(
                    "Main Vehicle Images Actions initialized."
                );

            }

            catch(error) {

                console.error(
                    "Cars Edit: Failed to initialize Main Vehicle Images Actions.",
                    error
                );

                return;

            }

            /*==========================================
                READY
            ==========================================*/

            console.log(
                "✅ Cars Edit Ready"
            );

        }

        catch(error) {

            console.error(
                "❌ Cars Edit Init Error:",
                error
            );

        }

    }

    /*==================================================
        PUBLIC
    ==================================================*/

    return {

        init

    };

})();
