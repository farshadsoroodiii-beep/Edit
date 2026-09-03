admin-panel\js\modules\cars\edit\form.js
/*==================================================
    CARS EDIT FORM

    Responsible for:
    - Form lifecycle
    - Event management
    - Slug generation
    - Submit coordination
    - Loading state
    - Navigation handling
    - Edit Session Cancel / Discard coordination
    - Form Dirty Detection coordination
    - Combined Edit Dirty Detection
    - Client Commit after successful Save

    Delegates:
    - Data loading → CarsEditLoader
    - Submit workflow → CarsEditSubmit
    - Validation → CarsEditValidation
    - Mapping → CarsEditMapper
    - Errors → FormErrorManager
    - Form Runtime State → FormState
    - Gallery Working State → CarsImages
    - Gallery Server Baseline → CarsImagesState
    - Display Locations State → DisplayLocationsState

    Architecture:
    IIFE Module

    IMPORTANT:

    FormState owns:
    - Form Baseline
    - Form Dirty Detection

    CarsImagesState owns:
    - Gallery Server Baseline
    - Gallery Working State
    - Gallery Dirty Detection

    DisplayLocationsState owns:
    - Display Locations Baseline
    - Display Locations Working State
    - Display Locations Dirty Detection

    CarsEditForm owns:
    - Edit lifecycle
    - Combined Dirty decision
    - Cancel orchestration

==================================================*/

'use strict';

const CarsEditForm = (() => {

    let form = null;

    let currentCarId = null;

    /*==================================================
        INIT
    ==================================================*/

    async function init(
        carId
    ) {

        form =
            document.getElementById(
                "car-edit-form"
            );

        if (!form) {

            console.error(
                "Cars Edit Form not found."
            );

            return;

        }

        currentCarId = carId;

        /*
         * A new form lifecycle starts here.
         *
         * FormState owns the Form Baseline.
         *
         * Clear any previous runtime state before
         * establishing the new Edit baseline.
         */

        if (
            typeof FormState !== "undefined"
        ) {

            FormState.reset();

        }

        /*
         * Display Locations State belongs to the
         * current Edit lifecycle.
         *
         * The authoritative baseline will be
         * established by CarsEditLoader.
         *
         * Reset here only clears any previous page
         * lifecycle state and does not create a
         * baseline.
         */

        if (
            typeof DisplayLocationsState !==
                "undefined"
        ) {

            DisplayLocationsState.reset();

        }

        bindEvents();

        /*==============================================
            LOAD DATA
        ==============================================*/

        if (
            typeof CarsEditLoader === "undefined"
        ) {

            console.error(
                "CarsEditLoader module is not loaded."
            );

            return;

        }

        CarsEditLoader.init({

            form,

            carId: currentCarId

        });

        const loaded =
            await CarsEditLoader.load();

        if (!loaded) {

            return;

        }

        /*==============================================
            CAPTURE FORM BASELINE
        ==============================================*/

        captureFormBaseline();

        /*
         * Display Locations baseline is already
         * initialized by CarsEditLoader through:
         *
         * CarsEditLoader
         *      ↓
         * DisplayLocationsLoader
         *      ↓
         * DisplayLocationsState.setBaseline()
         *
         * CarsEditForm does not recreate or modify
         * that authoritative baseline.
         */

        console.log(
            "Cars Edit Form Initialized"
        );

    }

    /*==================================================
        EVENTS
    ==================================================*/

    function bindEvents() {

        if (
            form.dataset.eventsBound
        ) {

            return;

        }

        form.dataset.eventsBound = "true";

        form.addEventListener(
            "submit",
            handleSubmit
        );

        form.addEventListener(
            "click",
            handleActionClick
        );

        bindSlugGenerator();

    }

    /*==================================================
        SLUG GENERATOR
    ==================================================*/

    function bindSlugGenerator() {

        const titleInput =
            form.querySelector(
                "#display_title"
            );

        const slugInput =
            form.querySelector(
                "#slug"
            );

        if (
            !titleInput ||
            !slugInput
        ) {

            console.warn(
                "Slug fields not found."
            );

            return;

        }

        titleInput.addEventListener(
            "input",
            () => {

                if (
                    slugInput.dataset.manual === "true"
                ) {

                    return;

                }

                if (
                    typeof SlugGenerator === "undefined"
                ) {

                    console.warn(
                        "SlugGenerator is not loaded."
                    );

                    return;

                }

                slugInput.value =
                    SlugGenerator.generate(
                        titleInput.value
                    );

            }
        );

        slugInput.addEventListener(
            "input",
            () => {

                slugInput.dataset.manual =
                    "true";

            }
        );

    }

    /*==================================================
        FORM BASELINE
    ==================================================*/

    function captureFormBaseline() {

        if (!form) {

            return;

        }

        if (
            typeof FormState === "undefined"
        ) {

            console.error(
                "FormState is not loaded."
            );

            return;

        }

        const currentValues =
            FormFields.collect(
                form
            );

        const normalizedValues =
            normalizeFormData(
                currentValues
            );

        FormState.setBaseline(
            normalizedValues
        );

        console.log(
            "Cars Edit Form Baseline captured."
        );

    }

    /*==================================================
        GET CURRENT FORM STATE
    ==================================================*/

    function getCurrentFormState() {

        if (!form) {

            return {};

        }

        return normalizeFormData(
            FormFields.collect(
                form
            )
        );

    }

    /*==================================================
        FORM DIRTY DETECTION
    ==================================================*/

    function isFormDirty() {

        if (
            typeof FormState === "undefined"
        ) {

            console.error(
                "FormState is not loaded."
            );

            return false;

        }

        const currentState =
            getCurrentFormState();

        return FormState.isDirty(
            currentState
        );

    }

    /*==================================================
        EDIT DIRTY DETECTION
    ==================================================

        Final Edit Dirty state:

            Form Dirty
                OR
            Gallery Dirty
                OR
            Display Locations Dirty

        Each State module owns its own comparison
        against its authoritative baseline.

        CarsEditForm only coordinates the final
        Edit Session decision.

    ==================================================*/

    function isEditDirty() {

        const formDirty =
            isFormDirty();

        let galleryDirty =
            false;

        let displayLocationsDirty =
            false;

        /*==============================================
            GALLERY
        ==============================================*/

        if (
            typeof CarsImagesState === "undefined"
        ) {

            console.error(
                "CarsImagesState is not loaded."
            );

        } else if (
            typeof CarsImagesState.isGalleryDirty !==
                "function"
        ) {

            console.error(
                "CarsImagesState.isGalleryDirty is not available."
            );

        } else {

            galleryDirty =
                CarsImagesState.isGalleryDirty();

        }

        /*==============================================
            DISPLAY LOCATIONS
        ==============================================*/

        if (
            typeof DisplayLocationsState ===
                "undefined"
        ) {

            console.error(
                "DisplayLocationsState is not loaded."
            );

        } else if (
            typeof DisplayLocationsState.isDirty !==
                "function"
        ) {

            console.error(
                "DisplayLocationsState.isDirty is not available."
            );

        } else {

            displayLocationsDirty =
                DisplayLocationsState.isDirty();

        }

        return (
            formDirty ||
            galleryDirty ||
            displayLocationsDirty
        );

    }

    /*==================================================
        NORMALIZE FORM DATA
    ==================================================*/

    function normalizeFormData(
        data = {}
    ) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return {};

        }

        const normalized = {};

        Object.keys(data)
            .sort()
            .forEach(
                key => {

                    const value =
                        data[key];

                    if (
                        value === null ||
                        typeof value === "undefined"
                    ) {

                        normalized[key] = "";

                        return;

                    }

                    if (
                        typeof File !== "undefined" &&
                        value instanceof File
                    ) {

                        if (
                            value.name === "" &&
                            value.size === 0
                        ) {

                            normalized[key] = {

                                name: "",

                                size: 0,

                                type: ""

                            };

                            return;

                        }

                        normalized[key] = {

                            name:
                                value.name,

                            size:
                                value.size,

                            type:
                                value.type,

                            lastModified:
                                value.lastModified

                        };

                        return;

                    }

                    normalized[key] =
                        String(value);

                }
            );

        return normalized;

    }

    /*==================================================
        ACTION BUTTONS
    ==================================================*/

    function handleActionClick(event) {

        if (
            typeof FormState !== "undefined" &&
            FormState.isLoading()
        ) {

            return;

        }

        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {

            return;

        }

        const action =
            button.dataset.action;

        switch(action) {

            case "cancel":

                handleCancel();

                break;

            case "save":

                /*
                    Native form submit
                    handles save action
                */

                break;

            case "save-continue":

                /*
                    Edit module
                    does not support
                    save-continue
                */

                break;

        }

    }

    /*==================================================
        SUBMIT
    ==================================================*/

    async function handleSubmit(event) {

        if (
            typeof CarsEditSubmit === "undefined"
        ) {

            console.error(
                "CarsEditSubmit module is not loaded."
            );

            return;

        }

        await CarsEditSubmit.submit(

            event,

            {

                form,

                carId: currentCarId,

                setLoading,

                clearErrors,

                onSuccess: handleSuccess

            }

        );

    }

    /*==================================================
        LOADING
    ==================================================*/

    function setLoading(
        status
    ) {

        if (
            typeof FormState !== "undefined"
        ) {

            FormState.setLoading(
                status
            );

        }

        if (
            typeof FormUI !== "undefined"
        ) {

            FormUI.setLoading(
                form,
                status
            );

        }

    }

    /*==================================================
        SUCCESS / CLIENT COMMIT
    ==================================================

        The Backend response is authoritative.

        IMPORTANT:

        This method runs only after the complete
        save request has succeeded.

        Backend response:

            {
                car: {...},
                gallery: [...],
                locations: [...]
            }

        Each domain receives its own authoritative
        response data and commits independently.

    ==================================================*/

    function handleSuccess(
        response
    ) {

        console.log(
            "Car updated successfully."
        );

        /*==============================================
            VALIDATE AUTHORITATIVE RESPONSE
        ==============================================*/

        if (
            !response ||
            typeof response !== "object"
        ) {

            console.error(
                "Cars Edit Client Commit: Invalid authoritative response."
            );

            return;

        }

        /*==============================================
            AUTHORITATIVE GALLERY COMMIT
        ==============================================*/

        if (
            !Array.isArray(
                response.gallery
            )
        ) {

            console.error(
                "Cars Edit Client Commit: Authoritative gallery is missing."
            );

            return;

        }

        if (
            typeof CarsImagesState === "undefined"
        ) {

            console.error(
                "CarsImagesState is not loaded."
            );

            return;

        }

        CarsImagesState.setServerImages(
            response.gallery
        );

        console.log(
            "Cars Images Client Commit completed."
        );

        /*==============================================
            AUTHORITATIVE DISPLAY LOCATIONS COMMIT
        ==============================================*/

        /*
         * IMPORTANT:
         *
         * `locations` is the authoritative field
         * returned by the complete edit save response.
         *
         * `displayLocations` belongs to the save intent
         * sent TO the backend and is not the response
         * property used here.
         */

        if (
            !Array.isArray(
                response.locations
            )
        ) {

            console.error(
                "Cars Edit Client Commit: Authoritative Display Locations are missing."
            );

            return;

        }

        if (
            typeof DisplayLocationsState ===
                "undefined"
        ) {

            console.error(
                "DisplayLocationsState is not loaded."
            );

            return;

        }

        DisplayLocationsState.setBaseline(
            response.locations
        );

        /*
         * Re-sync UI from the newly committed
         * authoritative State.
         *
         * This is intentionally optional so that
         * the Edit page does not depend on the UI
         * component for State correctness.
         */

        if (
            typeof DisplayLocations !== "undefined" &&
            typeof DisplayLocations.refresh ===
                "function"
        ) {

            DisplayLocations.refresh();

        }

        console.log(
            "Display Locations Client Commit completed."
        );

        /*==============================================
            END EDIT SESSION
        ==============================================*/

        CarsImagesState.endSession();

        console.log(
            "✅ Cars Images Client Commit completed."
        );

        /*==============================================
            SUCCESS NOTIFICATION
        ==============================================*/

        sessionStorage.setItem(

            "admin_notification",

            JSON.stringify({

                type:
                    "success",

                message:
                    "اطلاعات خودرو با موفقیت بروزرسانی شد."

            })

        );

        /*==============================================
            LEAVE EDIT
        ==============================================*/

        window.location.hash =
            "#/cars";

    }

    /*==================================================
        CLEAR ERRORS
    ==================================================*/

    function clearErrors() {

        if (
            typeof FormErrorManager !== "undefined"
        ) {

            FormErrorManager.clear();

        }

    }

    /*==================================================
        CANCEL
    ==================================================

        Professional Edit Cancel lifecycle:

        Clean:
            Leave without confirmation.

        Dirty:
            Ask for confirmation.

        Dirty + Cancel confirmation:
            Stay in Edit.

        Dirty + Confirm:
            Discard Working State.
            End Edit Session.
            Leave Edit.

        IMPORTANT:

        Cancel never calls Save API.

        Cancel never performs Temporary Promotion.

        Cancel never performs backend persistence.

    ==================================================*/

    function handleCancel() {

        if (
            typeof FormState !== "undefined" &&
            FormState.isLoading()
        ) {

            return;

        }

        /*==============================================
            DETERMINE FINAL EDIT DIRTY STATE
        ==============================================*/

        const dirty =
            isEditDirty();

        /*==============================================
            CLEAN EDIT
        ==============================================*/

        if (!dirty) {

            leaveEditWithoutConfirmation();

            return;

        }

        /*==============================================
            DIRTY EDIT
        ==============================================*/

        const confirmCancel =
            confirm(
                "آیا از لغو ویرایش خودرو مطمئن هستید؟"
            );

        if (!confirmCancel) {

            return;

        }

        /*==============================================
            CONFIRMED DISCARD
        ==============================================*/

        discardAndLeave();

    }

    /*==================================================
        CLEAN LEAVE
    ==================================================*/

    function leaveEditWithoutConfirmation() {

        if (
            typeof CarsImagesState === "undefined"
        ) {

            console.error(
                "CarsImagesState is not loaded."
            );

            return;

        }

        /*
         * Gallery
         */

        if (
            typeof CarsImages !== "undefined" &&
            typeof CarsImages.discardWorkingChanges ===
                "function"
        ) {

            CarsImages.discardWorkingChanges();

        } else {

            console.error(
                "Cars Images discardWorkingChanges is not available."
            );

            return;

        }

        /*
         * Display Locations
         */

        if (
            typeof DisplayLocationsState !==
                "undefined" &&
            typeof DisplayLocationsState.discard ===
                "function"
        ) {

            DisplayLocationsState.discard();

        } else {

            console.error(
                "DisplayLocationsState discard is not available."
            );

            return;

        }

        /*
         * Main Vehicle Images
         *
         * Main Vehicle Images has its own independent
         * Working State and must be discarded when the
         * Edit lifecycle ends.
         */

        if (
            typeof MainVehicleImagesState !==
                "undefined" &&
            typeof MainVehicleImagesState.discard ===
                "function"
        ) {

            MainVehicleImagesState.discard();

        }

        CarsImagesState.endSession();

        if (
            typeof MainVehicleImagesState !==
                "undefined" &&
            typeof MainVehicleImagesState.endSession ===
                "function"
        ) {

            MainVehicleImagesState.endSession();

        }

        window.location.hash =
            "#/cars";

    }

    /*==================================================
        DISCARD AND LEAVE
    ==================================================*/

    function discardAndLeave() {

        /*==============================================
            DISCARD GALLERY
        ==============================================*/

        if (
            typeof CarsImages === "undefined" ||
            typeof CarsImages.discardWorkingChanges !==
                "function"
        ) {

            console.error(
                "Cars Images discardWorkingChanges is not available."
            );

            return;

        }

        CarsImages.discardWorkingChanges();

        /*==============================================
            DISCARD DISPLAY LOCATIONS
        ==============================================*/

        if (
            typeof DisplayLocationsState ===
                "undefined" ||
            typeof DisplayLocationsState.discard !==
                "function"
        ) {

            console.error(
                "DisplayLocationsState discard is not available."
            );

            return;

        }

        DisplayLocationsState.discard();

        /*==============================================
            DISCARD MAIN VEHICLE IMAGES
        ==============================================*/

        if (
            typeof MainVehicleImagesState !==
                "undefined" &&
            typeof MainVehicleImagesState.discard ===
                "function"
        ) {

            MainVehicleImagesState.discard();

        }

        /*==============================================
            END GALLERY SESSION
        ==============================================*/

        if (
            typeof CarsImagesState === "undefined"
        ) {

            console.error(
                "CarsImagesState is not loaded."
            );

            return;

        }

        CarsImagesState.endSession();

        /*==============================================
            END MAIN VEHICLE IMAGES SESSION
        ==============================================*/

        if (
            typeof MainVehicleImagesState !==
                "undefined" &&
            typeof MainVehicleImagesState.endSession ===
                "function"
        ) {

            MainVehicleImagesState.endSession();

        }

        /*==============================================
            LEAVE EDIT
        ==============================================*/

        window.location.hash =
            "#/cars";

    }

    /*==================================================
        PUBLIC API
    ==================================================*/

    return {

        init,

        isFormDirty,

        isEditDirty

    };

})();
