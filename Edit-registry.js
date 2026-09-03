admin-panel\js\modules\cars\edit\registry.js
/*==================================================
    CARS EDIT REGISTRY

    Responsible for:
    - Register edit form fields metadata
    - Register edit form sections metadata

    Uses:
    - FieldRegistry
    - SectionRegistry

    No:
    - Validation
    - Rendering
    - Submit logic

==================================================*/

const CarsEditRegistry = (() => {

    /*==================================================
        INIT
    ==================================================*/

    function init() {

        registerFields();

        registerSections();

        console.log(
            "Cars Edit Registry Initialized"
        );

    }

    /*==================================================
        FIELD REGISTRY
    ==================================================*/

    function registerFields() {

        if (
            typeof FieldRegistry === "undefined"
        ) {

            console.error(
                "FieldRegistry is not loaded."
            );

            return;

        }

        FieldRegistry.init({

            /*==========================================
                BASIC INFO
            ==========================================*/

            brand_id: {

                selector:
                    "#brand_id",

                component:
                    "basic-info"

            },

            model: {

                selector:
                    "#model",

                component:
                    "basic-info"

            },

            trim: {

                selector:
                    "#trim",

                component:
                    "basic-info"

            },

            display_title: {

                selector:
                    "#display_title",

                component:
                    "basic-info"

            },

            car_code: {

                selector:
                    "#car_code",

                component:
                    "basic-info"

            },

            slug: {

                selector:
                    "#slug",

                component:
                    "basic-info"

            },

            year: {

                selector:
                    "#year",

                component:
                    "basic-info"

            },

            condition: {

                selector:
                    "#condition",

                component:
                    "basic-info"

            },

            status: {

                selector:
                    "#status",

                component:
                    "basic-info"

            },

            /*==========================================
                TECHNICAL
            ==========================================*/

            color: {

                selector:
                    "#color",

                component:
                    "technical"

            },

            engine_type: {

                selector:
                    "#engine_type",

                component:
                    "technical"

            },

            engine_volume: {

                selector:
                    "#engine_volume",

                component:
                    "technical"

            },

            cylinders: {

                selector:
                    "#cylinders",

                component:
                    "technical"

            },

            horsepower: {

                selector:
                    "#horsepower",

                component:
                    "technical"

            },

            gearbox: {

                selector:
                    "#gearbox",

                component:
                    "technical"

            },

            drive_type: {

                selector:
                    "#drive_type",

                component:
                    "technical"

            },

            fuel: {

                selector:
                    "#fuel",

                component:
                    "technical"

            },

            mileage: {

                selector:
                    "#mileage",

                component:
                    "technical"

            },

            /*==========================================
                COMMERCIAL
            ==========================================*/

            price: {

                selector:
                    "#price",

                component:
                    "commercial"

            },

            old_price: {

                selector:
                    "#old_price",

                component:
                    "commercial"

            },

            currency: {

                selector:
                    "#currency",

                component:
                    "commercial"

            },

            price_status: {

                selector:
                    "#price_status",

                component:
                    "commercial"

            },

            /*==========================================
                DESCRIPTION
            ==========================================*/

            description: {

                selector:
                    "#description",

                component:
                    "description"

            },

            /*==========================================
                SEO
            ==========================================*/

            manufacturer_url: {

                selector:
                    "#manufacturer_url",

                component:
                    "seo"

            },

            meta_title: {

                selector:
                    "#meta_title",

                component:
                    "seo"

            },

            meta_description: {

                selector:
                    "#meta_description",

                component:
                    "seo"

            },

            meta_image: {

                selector:
                    "#meta_image",

                component:
                    "seo"

            },

            /*==========================================
                PUBLISH
            ==========================================*/

            published_at: {

                selector:
                    "#published_at",

                component:
                    "publish"

            },

            is_active: {

                selector:
                    "#is_active",

                component:
                    "publish"

            }

        });

    }

    /*==================================================
        SECTION REGISTRY
    ==================================================*/

    function registerSections() {

        if (
            typeof SectionRegistry === "undefined"
        ) {

            console.error(
                "SectionRegistry is not loaded."
            );

            return;

        }

        SectionRegistry.init({

            "basic-info": {

                selector:
                    "[data-section='basic-info']",

                component:
                    "basic-info",

                title:
                    "اطلاعات پایه"

            },

            technical: {

                selector:
                    "[data-section='technical']",

                component:
                    "technical",

                title:
                    "مشخصات فنی"

            },

            commercial: {

                selector:
                    "[data-section='commercial']",

                component:
                    "commercial",

                title:
                    "اطلاعات تجاری"

            },

            media: {

                selector:
                    "[data-section='media']",

                component:
                    "media",

                title:
                    "تصاویر"

            },

            description: {

                selector:
                    "[data-section='description']",

                component:
                    "description",

                title:
                    "توضیحات"

            },

            seo: {

                selector:
                    "[data-section='seo']",

                component:
                    "seo",

                title:
                    "SEO"

            },

            publish: {

                selector:
                    "[data-section='publish']",

                component:
                    "publish",

                title:
                    "انتشار"

            },

            actions: {

                selector:
                    "[data-section='actions']",

                component:
                    "actions",

                title:
                    "عملیات"

            }

        });

    }

    /*==================================================
        PUBLIC
    ==================================================*/

    return {

        init

    };

})();
