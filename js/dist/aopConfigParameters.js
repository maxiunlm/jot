import RetryManagerConfiguration from './retryManagerConfiguration';
import RetryManager4Javascript from './retryManager4Javascript';

class AopConfigParameters {
    constructor(
            objectReference,
            methodName,
            beforeCallback,
            afterCallback,
            exceptionCallback,
            finallyCallback,
            wrapperCallback,
            mustUseRetryManager
            ) {
        this.objectReference = objectReference || window;
        this.methodName = methodName || '<unknown>';
        this.beforeCallback = beforeCallback || false;
        this.afterCallback = afterCallback || false;
        this.exceptionCallback = exceptionCallback || false;
        this.finallyCallback = finallyCallback || false;
        this.wrapperCallback = wrapperCallback || false;
        this.mustUseRetryManager = mustUseRetryManager || false;
        this.methodReference = () => {};
        
        if (this.mustUseRetryManager) {
            this.setRetryManager();
        }
    }

    setRetryManager(configuration) {
        configuration = configuration || new RetryManagerConfiguration();
        this.retryManager = new RetryManager4Javascript(configuration);
    }
    
    setMethodReference(methodName, surrounderMethod){
        if (!!this.objectReference.prototype
            && this.objectReference.prototype[methodName] instanceof Function
            ) {
            this.methodReference = this.objectReference.prototype[methodName];
            this.objectReference.prototype[methodName] = surrounderMethod.bind(this);
        }
        else {
            this.methodReference = this.objectReference[methodName];
            this.objectReference[methodName] = surrounderMethod.bind(this);
        }
    }

    execMethodReference(argumentsCall) {
        let result = undefined;
        
        if (!!this.objectReference) {
            result = this.methodReference.apply(this.objectReference, argumentsCall);
        } else {
            result = this.methodReference.apply(window, argumentsCall);
        }
        
        return result;
    }

    copy(aopConfigParameters) {
        this.objectReference = aopConfigParameters.objectReference;
        this.methodName = aopConfigParameters.methodName;
        this.methodReference = aopConfigParameters.methodReference;
        this.beforeCallback = aopConfigParameters.beforeCallback;
        this.afterCallback = aopConfigParameters.afterCallback;
        this.exceptionCallback = aopConfigParameters.exceptionCallback;
        this.finallyCallback = aopConfigParameters.finallyCallback;
        this.wrapperCallback = aopConfigParameters.wrapperCallback;
        this.mustUseRetryManager = aopConfigParameters.mustUseRetryManager;
        this.retryManager = aopConfigParameters.retryManager;
        this.wrapper = aopConfigParameters.wrapper;
    }
}


export default AopConfigParameters;
