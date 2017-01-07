import {FormControl, FormGroup} from "@angular/forms";
import {IValidationResult} from "./ValidationResultInterface";
import {Constants} from "../../../../both/Constants";

export class FormValidator {
    static notEmpty(control:FormControl):IValidationResult {
        var regex = /\S+/;
        if (!regex.test(control.value)) {
            return {empty: true};
        }
    }

    static validEmail(control:FormControl):IValidationResult {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (!EMAIL_REGEXP.test(control.value)) {
            return {invalidEmail: true};
        }
    }

    static registered(control:FormControl):IValidationResult {
        if (Session.get(Constants.SESSION.REGISTERED_ERROR)) {
            Session.set(Constants.SESSION.REGISTERED_ERROR, !Session.get(Constants.SESSION.REGISTERED_ERROR)); //Reset
            return {notRegistered: true};
        }
    }

    static notRegistered(control:FormControl):IValidationResult {
        if (Session.get(Constants.SESSION.NOT_REGISTERED_ERROR)) {
            Session.set(Constants.SESSION.NOT_REGISTERED_ERROR, !Session.get(Constants.SESSION.NOT_REGISTERED_ERROR)); //Reset
            return {registered: true};
        }
    }

    static validPassword(control:FormControl):IValidationResult {
        if (Session.get(Constants.SESSION.INCORRECT_PASSWORD)) {
            Session.set(Constants.SESSION.INCORRECT_PASSWORD, false); //Reset
            return {incorrectPassword: true};
        }
    }

    static validPasswordResetToken(control:FormControl):IValidationResult {
        if (Session.get(Constants.SESSION.RESET_PASSWORD_ERROR)) {
            Session.set(Constants.SESSION.RESET_PASSWORD_ERROR, false); //Reset
            return {resetPasswordError: true};
        }
    }

    static checkFirstCharacterValidator(control:FormControl):IValidationResult {
        if (control.value.match(/^\d/)) {
            return {checkFirstCharacterValidator: true};
        }
    }

    static matchingFields(validatorName:string, key1:string, key2:string) {
        return (group:FormGroup):{[key: string]: any} => {
            let key1value = group.controls[key1];
            let key2value = group.controls[key2];

            if (key1value.value !== key2value.value) {
                return {
                    mismatchedFields: validatorName
                };
            }
        }
    }

    static validUrl(control:FormControl):IValidationResult {
        var URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        if (control.value && !URL_REGEXP.test(control.value)) {
            return {invalidUrl: true};
        }
    }

    static validAddressRegion(control:FormControl):IValidationResult {
        let validRegionsByAbbr =
        {
            "AL": "Alabama",
            "AK": "Alaska",
            "AS": "American Samoa",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "BC": "British Columbia",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District Of Columbia",
            "FM": "Federated States Of Micronesia",
            "FL": "Florida",
            "GA": "Georgia",
            "GU": "Guam",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MB": "Manitoba",
            "MH": "Marshall Islands",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NB": "New Brunswick",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NL": "Newfoundland and Labrador",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "MP": "Northern Mariana Islands",
            "NS": "Nova Scotia",
            "NT": "Northwest Territories",
            "NU": "Nunavut",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "ON": "Ontario",
            "OR": "Oregon",
            "PW": "Palau",
            "PA": "Pennsylvania",
            "PE": "Prince Edward Island",
            "PR": "Puerto Rico",
            "QC": "Quebec",
            "RI": "Rhode Island",
            "SK": "Saskatchewan",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VI": "Virgin Islands",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming",
            "YT": "Yukon"
        };
        let validRegionsByName = FormValidator.swapJsonKeyValues(validRegionsByAbbr);
        if (!validRegionsByAbbr[control.value] && !validRegionsByName[control.value]) {
            return {invalidRegion: true};
        }
    }

    static swapJsonKeyValues(input) {
        var kv, output = {};
        for (kv in input) {
            if (input.hasOwnProperty(kv)) {
                output[input[kv]] = kv;
            }
        }
        return output;
    }
}
