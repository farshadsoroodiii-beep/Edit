admin-panel\js\modules\cars\edit\api.js
/*==================================================
    EDIT CAR API MODULE

    Vehicle Edit API Client

    Version : 1.1

==================================================*/

/**
 * Responsibility:
 *
 * Handle Edit Car API communication.
 *
 * No:
 * - Mapping
 * - Validation
 * - DOM manipulation
 * - Form logic
 *
 * Uses:
 * CarsAPI
 *
 * Architecture:
 * IIFE Module
 */

const CarsEditAPI = (() => {

    /*==================================================
        LOAD CAR
    ==================================================*/

    async function loadCar(
        carId
    ) {

        if (
            !carId
        ) {

            throw new Error(
                "Car ID is required."
            );

        }

        const response =
            await CarsAPI.request(

                `/admin/cars/${carId}`

            );

        return response.data;

    }

    /*==================================================
        UPDATE CAR
    ==================================================*/

    async function updateCar(

        carId,

        data

    ) {

        if (
            !carId
        ) {

            throw new Error(
                "Car ID is required."
            );

        }

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new Error(
                "Update data is required."
            );

        }

        const response =

            await CarsAPI.request(

                `/admin/cars/${carId}`,

                {

                    method: "PUT",

                    body:
                        JSON.stringify(data)

                }

            );

        return response.data;

    }

    /*==================================================
        PUBLIC
    ==================================================*/

    return {

        loadCar,

        updateCar

    };

})();
