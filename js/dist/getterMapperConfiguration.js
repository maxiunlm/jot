import BaseMapperConfiguration from './baseMapperConfiguration';

class GetterMapperConfiguration extends BaseMapperConfiguration {
    constructor(
            destinationObjectType,
            originObject,
            destinationObject,
            ignoredAttributes,
            ignoreAllAttributes,
            exceptedAttributes
            ) {
        super(
                destinationObjectType,
                ignoredAttributes,
                ignoreAllAttributes,
                exceptedAttributes
                );

        this.originObject = originObject || false;
        this.destinationObject = destinationObject || false;
    }

    configureIgnoredAttributes(registerConfiguration) {
        let hasGetterIgnoredAttributes = this.getHasGetterIgnoredAttributes();
        let hasRegisterIgnoredAttributes = this.getHasRegisterIgnoredAttributes(registerConfiguration);

        if (!hasGetterIgnoredAttributes
                && hasRegisterIgnoredAttributes) {
            this.ignoredAttributes = registerConfiguration.ignoredAttributes;
            this.ignoreAllAttributes = registerConfiguration.ignoreAllAttributes;
            this.ignoredAttributes = registerConfiguration.exceptedAttributes;
        }
    }

    getHasGetterIgnoredAttributes() {
        if ((!!this.ignoredAttributes
                && Array.isArray(this.ignoredAttributes)
                && this.ignoredAttributes.length > 0)
                || !!this.ignoreAllAttributes
                ) {
            return true;
        }

        return false;
    }

    getHasRegisterIgnoredAttributes(registerConfiguration) {
        if ((!!registerConfiguration.ignoredAttributes
                && Array.isArray(registerConfiguration.ignoredAttributes)
                && registerConfiguration.ignoredAttributes.length > 0)
                || !!registerConfiguration.ignoreAllAttributes
                ) {
            return true;
        }

        return false;
    }
}

export default GetterMapperConfiguration;
