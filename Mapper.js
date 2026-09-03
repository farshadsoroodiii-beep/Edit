admin-panel\js\modules\cars\edit\mapper.js
/**
 * ==================================================
 * Edit Car Mapper
 * ==================================================
 *
 * Responsibility:
 * Convert edit data models.
 *
 * Backend Response
 *          ↓
 * Form Model
 *
 * Form Model
 *          ↓
 * Update Payload
 *
 * No:
 * API
 * DOM
 * Validation
 *
 * Architecture:
 * IIFE Module
 * ==================================================
 */

const CarsEditMapper = (() => {

    /*==================================================
        FORMAT DATETIME LOCAL
    ==================================================*/

    function formatDateTimeLocal(
        value
    ) {

        if (!value) {

            return "";

        }

        return value

            .replace(" ", "T")

            .slice(0,16);

    }

    /*==================================================
        RESPONSE TO FORM
    ==================================================*/

    function mapResponseToForm(
        response
    ) {

        if (

            !response ||

            !response.car

        ) {

            return {};

        }

        const car =

            response.car;

        return {

            brand_id:
                car.brand_id,

            model:
                car.model,

            trim:
                car.trim,

            display_title:
                car.display_title,

            car_code:
                car.car_code,

            slug:
                car.slug,

            condition:
                car.condition,

            status:
                car.status,

            year:
                car.year,

            color:
                car.color,

            engine_type:
                car.engine_type,

            engine_volume:
                car.engine_volume,

            cylinders:
                car.cylinders,

            horsepower:
                car.horsepower,

            drive_type:
                car.drive_type,

            gearbox:
                car.gearbox,

            fuel:
                car.fuel,

            mileage:
                car.mileage,

            price:
                car.price,

            old_price:
                car.old_price,

            currency:
                car.currency,

            price_status:
                car.price_status,

            main_image:
                car.main_image,

            background_image:
                car.background_image,

            description:
                car.description,

            manufacturer_url:
                car.manufacturer_url,

            meta_title:
                car.meta_title,

            meta_description:
                car.meta_description,

            meta_image:
                car.meta_image,

            published_at:

                formatDateTimeLocal(
                    car.published_at
                ),

            is_active:
                car.is_active

        };

    }

    /*==================================================
        FORM TO PAYLOAD
    ==================================================*/

    function mapFormToPayload(
        formData = {}
    ) {

        return {

            brand_id:
                formData.brand_id,

            model:
                formData.model,

            trim:
                formData.trim || null,

            display_title:
                formData.display_title,

            slug:
                formData.slug,

            condition:
                formData.condition,

            status:
                formData.status,

            year:
                formData.year,

            color:
                formData.color || null,

            engine_type:
                formData.engine_type || null,

            engine_volume:
                formData.engine_volume || null,

            cylinders:
                formData.cylinders || null,

            horsepower:
                formData.horsepower || null,

            drive_type:
                formData.drive_type || null,

            gearbox:
                formData.gearbox || null,

            fuel:
                formData.fuel || null,

            mileage:
                formData.mileage || null,

            price:
                formData.price || null,

            old_price:
                formData.old_price || null,

            currency:
                formData.currency || null,

            price_status:
                formData.price_status || null,

            main_image:
                formData.main_image || null,

            background_image:
                formData.background_image || null,

            description:
                formData.description || null,

            manufacturer_url:
                formData.manufacturer_url || null,

            meta_title:
                formData.meta_title || null,

            meta_description:
                formData.meta_description || null,

            meta_image:
                formData.meta_image || null,

            published_at:
                formData.published_at || null,

            is_active:
                formData.is_active ? 1 : 0

        };

    }

    /*==================================================
        PUBLIC
    ==================================================*/

    return {

        mapResponseToForm,

        mapFormToPayload

    };

})();
