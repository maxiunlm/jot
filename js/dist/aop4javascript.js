import AopConfigParameters from './aopConfigParameters';
import UtilsBase4Javascript from './utilbase4javascript';

class Aop4Javascript extends UtilsBase4Javascript {
    constructor(aopConfigParameters, types) {
        super();
        this.aopConfigParameters = aopConfigParameters || new AopConfigParameters();
        this.types = types || {};
    }

    getAopConfigParameters(
            objectReference,
            methodName,
            beforeCallback,
            afterCallback,
            exceptionCallback,
            finallyCallback,
            wrapperCallback,
            mustUseRetryManager) {
        let aopConfigParameters = new AopConfigParameters(
                objectReference || this.aopConfigParameters.objectReference,
                methodName || this.aopConfigParameters.methodName,
                beforeCallback || this.aopConfigParameters.beforeCallback,
                afterCallback || this.aopConfigParameters.afterCallback,
                exceptionCallback || this.aopConfigParameters.exceptionCallback,
                finallyCallback || this.aopConfigParameters.finallyCallback,
                wrapperCallback || this.aopConfigParameters.wrapperCallback,
                mustUseRetryManager || this.aopConfigParameters.mustUseRetryManager
                );

        return aopConfigParameters;
    }

    wrap(aopConfigParameters) {
        aopConfigParameters = aopConfigParameters || this.aopConfigParameters;
        aopConfigParameters.wrapper = this.wrapper;
        this.surround(aopConfigParameters, this.wrapper);
    }

    wrapper(hasPassedBefore, hasPassedMethodReference, hasPassedAfter, hasPassedFinally) {
        hasPassedBefore = hasPassedBefore || false;
        hasPassedMethodReference = hasPassedMethodReference || false;
        hasPassedAfter = hasPassedAfter || false;
        hasPassedFinally = hasPassedFinally || false;

        try {
            //console.log(this.beforeCallback, hasPassedBefore);
            if (!!this.beforeCallback && !hasPassedBefore) {
                this.beforeCallback.call(this);
                hasPassedBefore = true;
            }

            //console.log(this, this.methodReference, hasPassedMethodReference, arguments);
            if (!!this.methodReference && !hasPassedMethodReference) {
                let argumentsCall = Array.prototype.slice.call(arguments, 1);

                if (this.mustContinueExecuting()) {
                    this.execMethodReference(argumentsCall);

                    hasPassedMethodReference = true;
                }
            } else {
                throw new Error('The "methodReference" is required.');
            }

            if (!!this.afterCallback && this.mustContinueExecuting() && !hasPassedAfter) {
                this.afterCallback.call(this);
                hasPassedAfter = true;
            }
        } catch (e) {
            //console.log('EXCEPTION [wrapper]', e);
            if (!!this.mustUseRetryManager && this.retryManager.getHasAnotherAttempt(e)) {
                this.wrapper(hasPassedBefore, hasPassedMethodReference, hasPassedAfter, hasPassedFinally);
                return;
            }

            if (!!this.exceptionCallback) {
                this.exceptionCallback.call(this, e);
            }
            else {
                console.log('EXCEPTION [wrapper]', e);
            }
        } finally {
            try {
                if (!!this.finallyCallback && this.mustContinueExecuting() && !hasPassedFinally) {
                    this.finallyCallback.call(this);
                    hasPassedFinally = true;
                }
            } catch (ex) {
                console.log('EXCEPTION [wrapper][finally]', ex);
                if (!!this.mustUseRetryManager && this.retryManager.getHasAnotherAttempt(ex)) {
                    this.wrapper(true, true, true, false);
                }
            }
        }
    }
    
    setMaxAttemps(maxAttemps) {
        this.aopConfigParameters.setMaxAttemps(maxAttemps);
    }

    intercept(aopConfigParameters) {
        this.surround.call(this, aopConfigParameters, this.interceptor);
    }

    interceptor() {
        try {
            let argumentsCall = Array.prototype.slice.call(arguments, 1);
            let result = this.wrapperCallback(this, argumentsCall);
            
            return result;
        } catch (e) {
            console.log('EXCEPTION [interceptor]', e);
        }
    }

    surround(aopConfigParameters, surrounderMethod) {
        this.validateAopConfigParameters(aopConfigParameters);
        this.configObjectReference(aopConfigParameters);

        let methodNames = this.getMethodNamesList(aopConfigParameters);

        methodNames.forEach(function (methodName, index, allMethodNames) {
            this.doSurround(aopConfigParameters, surrounderMethod, methodName);
        }.bind(this));
    }

    configObjectReference(aopConfigParameters) {
        if (this.isString(aopConfigParameters.objectReference)) {
            aopConfigParameters.objectReference = this.types[aopConfigParameters.objectReference].type;
        }
    }

    getMethodNamesList(aopConfigParameters) {
        let methodName = aopConfigParameters.methodName;
        let objectReference = aopConfigParameters.objectReference;
        let methodNamesList = [];

        if (this.isFunction(methodName)) {
            methodName = methodName.name;
        } else if (methodName instanceof RegExp) {
            let objectReferenceKeys = this.getObjectReferenceKeys(objectReference);

            objectReferenceKeys.forEach(function (key, index, allKeys) {
                if (this.isMatchedMethodName(objectReference, methodName, key)) {
                    methodNamesList.push(key);
                }
            }.bind(this));
        }

        if (methodNamesList.length === 0) {
            methodNamesList = [methodName];
        }

        return methodNamesList;
    }

    getObjectReferenceKeys(objectReference) {
        let objectReferenceKeys = [];

        if (!!objectReference.prototype) {
            objectReferenceKeys = objectReferenceKeys.concat(Object.keys(objectReference.prototype));
        }

        if (objectReference instanceof Object) {
            objectReferenceKeys = objectReferenceKeys.concat(Object.keys(objectReference.__proto__));
        }

        if (!!objectReference) {
            objectReferenceKeys = objectReferenceKeys.concat(Object.keys(objectReference));
        }

        return objectReferenceKeys;
    }

    isMatchedMethodName(objectReference, regularExpession, key) {
        return ((!!objectReference[key] && this.isFunction(objectReference[key]))
                || (!!objectReference.prototype && !!objectReference.prototype[key] && this.isFunction(objectReference.prototype[key])))
                && regularExpession.test(key);
    }

    doSurround(aopConfigParameters, surrounderMethod, methodName) {
        let aopEvent = this.getAopEvent();
        let configParameters = new AopConfigParameters();
        configParameters.copy(aopConfigParameters);
        configParameters.aopEvent = aopEvent;
        configParameters.mustContinueExecuting = this.mustContinueExecuting.bind(configParameters);
        configParameters.setMethodReference.call(configParameters, methodName, surrounderMethod);
    }

    validateAopConfigParameters(aopConfigParameters) {
        if (!aopConfigParameters) {
            throw new Error('EXCEPTION [wrap]: the "aopConfigParameters" is obligatory.');
        }

        this.aopConfigParameters.objectReference = aopConfigParameters.objectReference || this.aopConfigParameters.objectReference;
        this.aopConfigParameters.methodName = aopConfigParameters.methodName || this.aopConfigParameters.methodName;
        this.aopConfigParameters.beforeCallback = aopConfigParameters.beforeCallback || this.aopConfigParameters.beforeCallback;
        this.aopConfigParameters.afterCallback = aopConfigParameters.afterCallback || this.aopConfigParameters.afterCallback;
        this.aopConfigParameters.exceptionCallback = aopConfigParameters.exceptionCallback || this.aopConfigParameters.exceptionCallback;
        this.aopConfigParameters.exceptionCallback = aopConfigParameters.exceptionCallback || this.aopConfigParameters.finallyCallback;
        this.aopConfigParameters.wrapperCallback = aopConfigParameters.wrapperCallback || this.aopConfigParameters.wrapperCallback;
        this.aopConfigParameters.mustUseRetryManager = aopConfigParameters.mustUseRetryManager || this.aopConfigParameters.mustUseRetryManager;
        this.aopConfigParameters.retryManager = aopConfigParameters.retryManager || this.aopConfigParameters.retryManager;
        this.aopConfigParameters.wrapper = aopConfigParameters.wrapper || this.aopConfigParameters.wrapper;
    }

    getAopEvent() {
        let aopEvent = new Event(this.__proto__.constructor.name, {
            bubbles: false,
            cancelable: false,
            scopped: false,
            composed: false
        });

        return aopEvent;
    }

    mustContinueExecuting() {
        return !this.aopEvent.defaultPrevented;
    }
    
    registerType(type, key) {
        this.validateAlreadyRegistered(this.types, key);
        this.validateKeyType(key);
        this.validateType(type);

        this.types[key] = { key: key, typeName: type.name, type: type };

        return this;
    }
}

export default Aop4Javascript;
