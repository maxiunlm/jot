import IoC4Javascript from './js/dist/ioc4javascript'
import RetryManager4Javascript from './js/dist/retryManager4Javascript';

class Jot {
    constructor() {
        this.ioc = new IoC4Javascript();
    }

    getIoc = () => {
        return this.ioc;
    }

    getAop = () => {
        return this.ioc.aop;
    }

    getRetryManager = (configuration) => {
        if (!!configuration || !this.ioc.aop.aopConfigParameters.retryManager) {
            configuration = configuration || new RetryManagerConfiguration();
            let retryManager = new RetryManager4Javascript(configuration);
            this.ioc.aop.aopConfigParameters.retryManager = retryManager;
        }

        return this.ioc.aop.aopConfigParameters.retryManager;
    }

    getMapper = () => {
        return this.ioc.mapper;
    }
}

const jot = new Jot();

export default jot;