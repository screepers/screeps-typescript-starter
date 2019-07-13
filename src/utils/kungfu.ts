
const Kungfu = (function () {
    'use strict';

    // Private Methods -----------
    const private_methods: any = {};

    // Array Helpers

    // ---------------


    // Math Helpers

    private_methods.randomNumber = function (min: any, max: any) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // ---------------


    // String Helpers

    // ---------------


    // Collection Helpers

    // ---------------


    // Date Helpers

    // ---------------


    // Object Helpers

    // ---------------
    // ---------------------------


    // Public, exposed methods ---
    const public_methods: any = {};

    // Array Utilities

    /**
     * Returns and object split by true and false values defined by a condition
     * @param array the array we are splitting up
     * @param condition [Optional] the condition we are checking, defaults true
     * @returns {'true': trueValues, 'false': falseValues}
     */
    public_methods.splitArrayBy = function (array: any, condition: any = true) {
        const trueArray = [];
        const falseArray = [];

        for (const key in array) {
            const item = array[key];
            if (item === condition) {
                trueArray.push(item);
            }
            else {
                falseArray.push(item);
            }
        }

        return {
            true: trueArray,
            false: falseArray
        };
    };

    /**
     * remove all falsey values from an array
     * @param array the array we are removing values from
     * @returns the updated array
     */
    public_methods.removeFalseyFromArray = function (array: any) {
        const returnArray = [];

        for (const key in array) {
            const item = array[key];
            if (item) {
                returnArray.push(item);
            }
        }

        return returnArray;
    };

    /**
     * initialize a 2D array with default values inserted
     * @param width the width of the array
     * @param height the height of the array
     * @param defaultValue [Optional] the default value for each element in the array, defaults to 0
     * @returns 2D array of the specified size
     */
    public_methods.init2DArray = function (width: any, height: any, defaultValue: any = 0) {
        const mainArray = [];

        for (let i = 0; i < width; ++i) {
            const subArray = [];
            for (let j = 0; j < height; ++j) {
                subArray.push(defaultValue);
            }
            mainArray.push(subArray);
        }

        return mainArray;
    };

    /**
     * init and array of specific size with default values
     * @param size the size of the array
     * @param defaultValue [Optional] the default value, defaults to 0
     * @returns the array requested
     */
    public_methods.initArray = function (size: any, defaultValue: any = 0) {
        const returnArray = [];
        for (let i = 0; i < size; ++i) {
            returnArray.push(defaultValue);
        }
        return returnArray;
    };

    /**
     * returns the last element in an array
     * @param array the array we are searching through
     * @returns the last element of the array
     */
    public_methods.getLastElementOfArray = (array: any) => array[array.length - 1];

    /**
     * returns a random element from the array
     * @param array the array we are using
     * @returns a random element from the array
     */
    public_methods.sampleArray = function (array: any) {
        const index = private_methods.randomNumber(0, array.length - 1);
        return array[index];
    };

    /**
     * returns an array of specified size, of random elements from the array
     * returns empty array if no allowed duplicates, and the requested size is larger than the given array
     * @param array the array we are using
     * @param size the number of elements we want
     * @param allowDuplicates [Optional] allow duplicate values to be found, defaults to false
     * @returns an array of random elements from the array
     */
    public_methods.sampleArraySize = function (array: any, size: any, allowDuplicates: any = false) {
        const sampleArr: any = [];
        const usedIndicies: any = [];

        if (!allowDuplicates && array.length < size) {
            return [];
        }
        else if (!allowDuplicates && array.length === size) {
            return array;
        }

        for (let i = 0; i < size; ++i) {

            const index = private_methods.randomNumber(0, array.length - 1);

            if (!allowDuplicates && usedIndicies.contains(index)) {
                --i;
                continue;
            }

            usedIndicies.push(index);
            sampleArr.push(array[index]);
        }

        return sampleArr;
    };

    /**
     * get the first defined value in the array
     * @param array the array we are searching through
     * @returns the first defined value in the array
     */
    public_methods.getFirstDefinedInArray = function (array: any) {
        for (const key in array) {
            const item = array[key];
            if (item !== undefined) {
                return item;
            }
        }
    };

    /**
     * convert CSV string to a 2d array
     * @param csvString the csv value we are converting into a 2d array
     * @param delim the delim seperator between the values
     * @returns a 2D array of the CSV string, array[0][x] being headers if present
     */
    public_methods.convertCSVTo2DArray = function (csvString: any, delim: any) {
        // TODO fill this in
    };

    /**
     * join the elements of the array into a single string seperated by the delim
     * @param array the array we are joining
     * @param delim [Optional] the deliemter seperating them, defaults to no space
     * @returns a string of elements joined
     */
    public_methods.join = function (array: any, delim: any = "") {
        let finalString = "";

        for (const key in array) {
            const item = array[key];
            finalString += (item + delim);
        }

        return finalString;
    };

    /**
     * reverse the array, so the last element is first and vice versa
     * returns empty array if start is greater than end
     * @param array
     * @param start [Optional] the index you want to start the reversal at
     * @param end [Optional] the index you want to end the reversal at
     * @returns the array with the specified reversal
     */
    public_methods.reverseArray = function (array: any, start: any = 0, end: any = 0) {
        if (end === 0) {
            end = array.length - 1;
        }
        if (start > end) {
            return [];
        }
        if (start === end) {
            return array;
        }

        const reversedArray = [];
        let j = 0;

        for (let i = 0; i < array.length; ++i) {

            if (i <= end && i >= start) {
                reversedArray.push(array[end - j]);
                ++j;
            }
            else {
                reversedArray.push(array[i]);
            }
        }

        return reversedArray;
    }
    // ---------------


    // Math Utilities

    // ---------------


    // String Utilities

    /**
     * Add commas to a string of numbers how a number should look in US format
     * @param number the number we want to add commas to
     * @param dollarize [Optional] if we want to prepend a dollarsign to the return string, defaults false
     * @returns the string formatted correctly
     */
    public_methods.addCommasToNumber = function (numba: any, dollarize: any = false) {
        const formattedString = numba.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return dollarize ? "$" + formattedString : formattedString;
    };
    // ---------------


    // Collection Utilities

    // ---------------


    // Date Utilities

    // ---------------


    // Object Utilities

    // ---------------
    // ---------------------------

    // Expose the public methods
    return public_methods;
})();
