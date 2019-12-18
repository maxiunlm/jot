class RetryManagerConfiguration {
    constructor(maxAttemps, retryMessage, exceptionMessage, startValue, onRetryEvent, onStopRetryingEvent, confirmAction) {
        this.startValue = startValue || 0;
        this.hasAnotherAttempt = false;
        this.maxAttemps = maxAttemps || 3;
        this.exceptionMessage = exceptionMessage || 'There was an error: ';
        this.retryMessage = retryMessage || 'Retry?';
        this.onRetryEvent = onRetryEvent || false;
        this.onStopRetryingEvent = onStopRetryingEvent || false;
        this.confirmAction = confirmAction || false;

        this.validateConfiguration();
    }

    validateConfiguration() {
        if (this.startValue >= this.maxAttemps) {
            throw new TypeError('ERROR [validateConfiguration]: The "startValue" must be less than the "maxAttemps" value.');
        }
    }
}

export default RetryManagerConfiguration;
