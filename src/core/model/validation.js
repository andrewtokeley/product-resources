
export { isObjectValid, validateUrl, validateObject, validateProperty, validateMandatoryProperty }

import Result from '@/core/model/Result';

const addhttp = function(url) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
      url = "http://" + url;
  }
  return url;
}

/**
 * Validates a URL to ensure it is well formed.
 * 
 * Note the method doesn't check whether the url is accessible.
 * 
 * @param {*} url the url to validate.
 * @returns {Result} the result of the validation.
 */
const validateUrl = function(url) {
  let tryUrl = addhttp(url);
  try {
    let url = new URL(tryUrl);
    // mark as successful and send the modified URL back
    return Result.success(url.href);
  } catch (error) {
    return Result.failure("That URL doesn't look quite right.");
  }
}


/**
 * Returns array of failing Result instances.
 * 
 * ```
 * let person = {
 *  name: 'Tokes';
 *  age: 12,
 * }
 * 
 * const schema = {
 *    age: (value) => {
 *      if (!value < 18 ) {
 *        return Result.failure("Not old enough")
 *      }
 *        return Result.success();
 *     }
 *  }
 * 
 * // result.length => 1
 * // result[0].success => false
 * // result[0].errormessage => 'Not old enough'
 * const result = objectValidationResult(person, schema)
 * 
 * ```
 *  
 * @param {Object} object object to validate
 * @param {Object} schema object that defines the validation routine for any properties that need
 *  to be validated.
 * 
 * @returns {{}} object with properties (for each failed object property) containing a Result instance
*/
const validateObject = function(object, schema) {
  let props = Object.getOwnPropertyNames(object);  
  var results = [];
  for (const i in props) {
    const propertyName = props[i];
    const validate = validateProperty(object, schema, propertyName);
    if (!validate.success) {
      results.push(validate);
    }
  }
  return results;
}

/**
 * Returns whether object has any validation errors
 * @param {*} object 
 * @param {*} schema 
 * @returns {Boolean}
 */
const isObjectValid = function(object, schema) {
  return validateObject(object, schema).length == 0;
}

/**
 * Validates an individual object property
 * @param {*} object 
 * @param {*} schema 
 * @param {*} propertyName 
 * @returns Result instance
 */
const validateProperty = function(object, schema, propertyName) {
  var result = Result.success();
  if (schema[propertyName]) {
    result = schema[propertyName](object[propertyName]);
  }
  return result; 
}

const validateMandatoryProperty = function(propertyName, value) {
  if (!value || value.length == 0) {
    return Result.failure('Missing field', propertyName);
  } else {
    return Result.success();
  }
}