import UtilsBase4Javascript from './utilbase4javascript';

class BaseMapperConfiguration extends UtilsBase4Javascript {
    constructor(
            destinationObjectType,
            ignoredAttributes,
            ignoreAllAttributes,
            exceptedAttributes
            ) {
        super();
        this.destinationObjectType = destinationObjectType || false;
        this.ignoreAllAttributes = !!ignoreAllAttributes;
        this.exceptedAttributes = exceptedAttributes || [];
        this.ignoredAttributes = ignoredAttributes || [];

        this.validateType(this.destinationObjectType, 'destinationObjectType');
        this.validateConfig();
    }

    validateConfig() {
        if (!!this.ignoredAttributes && !Array.isArray(this.ignoredAttributes)) {
            throw new Error('ERROR [validateConfig]: The "ignoredAttributes" list must be an Array.');
        }

        if (!!this.exceptedAttributes && !Array.isArray(this.exceptedAttributes)) {
            throw new Error('ERROR [validateConfig]: The "exceptedAttributes" list must be an Array.');
        }

        if (!!this.ignoreAllAttributes && this.ignoredAttributes.length > 0) {
            throw new Error('ERROR [validateConfig]: If you want to ignore all attrbiutes, you can\t use the "ignoredAttributes" list.');
        }

        if (!this.ignoreAllAttributes && this.exceptedAttributes.length > 0) {
            throw new Error('ERROR [validateConfig]: If you don\'t want to ignore all attrbiutes, you can\t use the "exceptedAttributes" list.');
        }
    }
}

export default BaseMapperConfiguration;
