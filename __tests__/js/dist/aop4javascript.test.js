/* global expect, spyOn */

import ApiFakes from '../../Selenium/Fakes/apiFakes';
import AopConfigParameters from '../../src/apis/aopConfigParameters';
import Aop4Javascript from '../../src/apis/aop4javascript';

window['myFunction'] = function () {
    //console.log('--> myFunction');
};

window['myInterceptedFunction'] = function () {
    //console.log('--> myInterceptedFunction');
    return true;
};

window['myExceptionedFunction'] = function () {
    throw Error('myExceptionedFunction controlled exception');
};


function wrapperCallback(aopConfigParameters, argumentsCall) {
    let result = aopConfigParameters.execMethodReference(argumentsCall);
    
    return result;
}

describe('Aop4Javascript - ', () => {
    let apiFakes = new ApiFakes();

    describe('CONSTRUCTOR - ', () => {
        it('without parameters then instances an "Aop4Javascript" object', () => {

            let sut = new Aop4Javascript();

            expect(sut.aopConfigParameters instanceof AopConfigParameters).toBeTruthy();
            expect(sut.types instanceof Object).toBeTruthy();
        });

        it('with an "AopConfigParameters" and the "types" parameters then instances an Aop4Javascript object', () => {
            let config = new AopConfigParameters();

            let sut = new Aop4Javascript(config, apiFakes.types);

            expect(sut.aopConfigParameters).toEqual(config);
            expect(sut.types).toEqual(apiFakes.types);
        });
    });

    describe('wrap - ', () => {
        it('with an "AopConfigParameters" parameter when calls the "test" method then invokes "beforeCallback, afterCallback, finallyCallback, wrapperCallback" methods', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.wrap(aop.getAopConfigParameters(
                    apiFakes.MyClass,
                    'test',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    null,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = apiFakes.MyClass;

            sut.test();

            expect(apiFakes.beforeCallback).toHaveBeenCalled();
            expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.afterCallback).toHaveBeenCalled();
            expect(apiFakes.afterCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.finallyCallback).toHaveBeenCalled();
            expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
        });

        it('with an "AopConfigParameters" parameter when calls the method that "/another*/" then invokes "beforeCallback, afterCallback, finallyCallback, wrapperCallback" methods', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.wrap(aop.getAopConfigParameters(
                    apiFakes.MyClass,
                    /^another+/,
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    null,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = apiFakes.MyClass;

            sut.test();
            sut.anotherTest();

            expect(apiFakes.beforeCallback).toHaveBeenCalled();
            expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.afterCallback).toHaveBeenCalled();
            expect(apiFakes.afterCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.finallyCallback).toHaveBeenCalled();
            expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
        });

        it('with an "AopConfigParameters" parameter when calls methods of the array list then invokes "beforeCallback, afterCallback, finallyCallback, wrapperCallback" methods', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.wrap(aop.getAopConfigParameters(
                    apiFakes.MyClass,
                    ['test', 'anotherTest'],
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    null,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = apiFakes.MyClass;

            sut.test();
            sut.anotherTest();

            expect(apiFakes.beforeCallback).toHaveBeenCalled();
            expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.twice);
            expect(apiFakes.afterCallback).toHaveBeenCalled();
            expect(apiFakes.afterCallback.calls.count()).toEqual(apiFakes.twice);
            expect(apiFakes.finallyCallback).toHaveBeenCalled();
            expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.twice);
            expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
        });

        it('with an "AopConfigParameters" parameter when calls the "test" method and it has an exception then invokes "beforeCallback, finallyCallback, wrapperCallback" methods', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'exceptionCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.wrap(aop.getAopConfigParameters(
                    apiFakes.MySecondClass,
                    'exceptionTest',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    apiFakes.exceptionCallback,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = new apiFakes.MySecondClass();

            try {
                sut.exceptionTest();
            } catch (e) {
            }

            expect(apiFakes.beforeCallback).toHaveBeenCalled();
            expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.afterCallback).not.toHaveBeenCalled();
            expect(apiFakes.exceptionCallback).toHaveBeenCalled();
            expect(apiFakes.exceptionCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.finallyCallback).toHaveBeenCalled();
            expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.once);
            expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
        });
    });
    
    describe('wrapAll - ', () => {
        it('with an "AopConfigParameters" parameter for each method then invokes "beforeCallback, afterCallback, finallyCallback, wrapperCallback" methods', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.wrapAll(aop.getAopConfigParameters(
                    apiFakes.MyClass,
                    null,
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    null,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = apiFakes.MyClass;

            sut.test();
            sut.anotherTest();

            expect(apiFakes.beforeCallback).toHaveBeenCalled();
            expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.twice);
            expect(apiFakes.afterCallback).toHaveBeenCalled();
            expect(apiFakes.afterCallback.calls.count()).toEqual(apiFakes.twice);
            expect(apiFakes.finallyCallback).toHaveBeenCalled();
            expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.twice);
            expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
        });
    });

    describe('intercept - When you want to change the original method for an interceptor - ', () => {
        it('with an "AopConfigParameters" parameter when calls the "test" method then invokes "wrapperCallback" method', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.intercept(aop.getAopConfigParameters(
                    apiFakes.MyClass,
                    'test',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    null,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = apiFakes.MyClass;

            sut.test();

            expect(apiFakes.beforeCallback).not.toHaveBeenCalled();
            expect(apiFakes.afterCallback).not.toHaveBeenCalled();
            expect(apiFakes.finallyCallback).not.toHaveBeenCalled();
            expect(apiFakes.wrapperCallback).toHaveBeenCalled();
            expect(apiFakes.wrapperCallback.calls.count()).toEqual(apiFakes.once);
        });

        it('with an "AopConfigParameters" parameter when calls the "test" method then invokes "wrapperCallback" method', () => {
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'exceptionCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            let aop = new Aop4Javascript();
            aop.intercept(aop.getAopConfigParameters(
                    apiFakes.MySecondClass,
                    'exceptionTest',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    apiFakes.exceptionCallback,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback
                    ));
            let sut = new apiFakes.MySecondClass();

            try {
                sut.exceptionTest();
            } catch (e) {
            }

            expect(apiFakes.beforeCallback).not.toHaveBeenCalled();
            expect(apiFakes.afterCallback).not.toHaveBeenCalled();
            expect(apiFakes.exceptionCallback).not.toHaveBeenCalled();
            expect(apiFakes.finallyCallback).not.toHaveBeenCalled();
            expect(apiFakes.wrapperCallback).toHaveBeenCalled();
            expect(apiFakes.wrapperCallback.calls.count()).toEqual(apiFakes.once);
        });

        it('with an "AopConfigParameters" parameter when calls the "test" method when calls "wrapperCallback" then invokes the original method', () => {
            spyOn(apiFakes.MySecondClass.prototype, 'test2').and.callThrough();
            let aop = new Aop4Javascript();
            aop.intercept(aop.getAopConfigParameters(
                    apiFakes.MySecondClass,
                    'exceptionTest',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    apiFakes.exceptionCallback,
                    apiFakes.finallyCallback,
                    (aopConfigParameters, argumentsCall) => {
                aopConfigParameters.execMethodReference(argumentsCall);
            }
            ));
            let sut = new apiFakes.MySecondClass();

            sut.test2(apiFakes.param1, apiFakes.param2);

            expect(apiFakes.MySecondClass.prototype.test2).toHaveBeenCalledWith(apiFakes.param1, apiFakes.param2);
            expect(apiFakes.MySecondClass.prototype.test2.calls.count()).toEqual(apiFakes.once);
        });
   });

    describe('FUNCTION - ', () => {
        describe('wrap - ', () => {
           it('with an "AopConfigParameters" parameter when calls the "window.myFunction" function then invokes "beforeCallback, afterCallback, finallyCallback, wrapperCallback" methods', () => {
                spyOn(apiFakes, 'beforeCallback').and.callThrough();
                spyOn(apiFakes, 'afterCallback').and.callThrough();
                spyOn(apiFakes, 'finallyCallback').and.callThrough();
                spyOn(apiFakes, 'wrapperCallback').and.callThrough();
                let aop = new Aop4Javascript();
                aop.wrap(aop.getAopConfigParameters(
                        null,
                        'myFunction',
                        apiFakes.beforeCallback,
                        apiFakes.afterCallback,
                        null,
                        apiFakes.finallyCallback,
                        apiFakes.wrapperCallback
                        ));

                myFunction();

                expect(apiFakes.beforeCallback).toHaveBeenCalled();
                expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.once);
                expect(apiFakes.afterCallback).toHaveBeenCalled();
                expect(apiFakes.afterCallback.calls.count()).toEqual(apiFakes.once);
                expect(apiFakes.finallyCallback).toHaveBeenCalled();
                expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.once);
                expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
            });

            it('with an "AopConfigParameters" parameter when calls the "window.myExceptionedFunction" function and it has an exception then invokes "beforeCallback, finallyCallback, wrapperCallback" methods', () => {
                spyOn(apiFakes, 'beforeCallback').and.callThrough();
                spyOn(apiFakes, 'afterCallback').and.callThrough();
                spyOn(apiFakes, 'exceptionCallback').and.callThrough();
                spyOn(apiFakes, 'finallyCallback').and.callThrough();
                spyOn(apiFakes, 'wrapperCallback').and.callThrough();
                let aop = new Aop4Javascript();
                aop.wrap(aop.getAopConfigParameters(
                        window,
                        'myExceptionedFunction',
                        apiFakes.beforeCallback,
                        apiFakes.afterCallback,
                        apiFakes.exceptionCallback,
                        apiFakes.finallyCallback,
                        apiFakes.wrapperCallback
                        ));

                try {
                    myExceptionedFunction();
                } catch (e) {
                }

                expect(apiFakes.beforeCallback).toHaveBeenCalled();
                expect(apiFakes.beforeCallback.calls.count()).toEqual(apiFakes.once);
                expect(apiFakes.afterCallback).not.toHaveBeenCalled();
                expect(apiFakes.exceptionCallback).toHaveBeenCalled();
                expect(apiFakes.exceptionCallback.calls.count()).toEqual(apiFakes.once);
                expect(apiFakes.finallyCallback).toHaveBeenCalled();
                expect(apiFakes.finallyCallback.calls.count()).toEqual(apiFakes.once);
                expect(apiFakes.wrapperCallback).not.toHaveBeenCalled();
            });
        });
        
        describe('intercept - When you want to change the original method for an interceptor - ', () => {
            it('with an "AopConfigParameters" parameter when calls the "window.myFunction" function then invokes "wrapperCallback" method', () => {
                spyOn(apiFakes, 'beforeCallback').and.callThrough();
                spyOn(apiFakes, 'afterCallback').and.callThrough();
                spyOn(apiFakes, 'finallyCallback').and.callThrough();
                spyOn(apiFakes, 'wrapperCallback').and.callThrough();
                let aop = new Aop4Javascript();
                aop.intercept(aop.getAopConfigParameters(
                        null,
                        'myFunction',
                        apiFakes.beforeCallback,
                        apiFakes.afterCallback,
                        null,
                        apiFakes.finallyCallback,
                        apiFakes.wrapperCallback
                        ));

                myFunction();

                expect(apiFakes.beforeCallback).not.toHaveBeenCalled();
                expect(apiFakes.afterCallback).not.toHaveBeenCalled();
                expect(apiFakes.finallyCallback).not.toHaveBeenCalled();
                expect(apiFakes.wrapperCallback).toHaveBeenCalled();
                expect(apiFakes.wrapperCallback.calls.count()).toEqual(apiFakes.once);
            });

            it('with an "AopConfigParameters" parameter when calls the "window.myExceptionedFunction" function then invokes "wrapperCallback" method', () => {
                spyOn(apiFakes, 'beforeCallback').and.callThrough();
                spyOn(apiFakes, 'afterCallback').and.callThrough();
                spyOn(apiFakes, 'exceptionCallback').and.callThrough();
                spyOn(apiFakes, 'finallyCallback').and.callThrough();
                spyOn(apiFakes, 'wrapperCallback').and.callThrough();
                let aop = new Aop4Javascript();
                aop.intercept(aop.getAopConfigParameters(
                        null,
                        'myExceptionedFunction',
                        apiFakes.beforeCallback,
                        apiFakes.afterCallback,
                        apiFakes.exceptionCallback,
                        apiFakes.finallyCallback,
                        apiFakes.wrapperCallback
                        ));

                try {
                    myExceptionedFunction();
                } catch (e) {
                }

                expect(apiFakes.beforeCallback).not.toHaveBeenCalled();
                expect(apiFakes.afterCallback).not.toHaveBeenCalled();
                expect(apiFakes.exceptionCallback).not.toHaveBeenCalled();
                expect(apiFakes.finallyCallback).not.toHaveBeenCalled();
                expect(apiFakes.wrapperCallback).toHaveBeenCalled();
                expect(apiFakes.wrapperCallback.calls.count()).toEqual(apiFakes.once);
            });

            it('with an "AopConfigParameters" parameter when calls the "window.myFunction" function when calls "wrapperCallback" then invokes the original method', () => {
                let result = false;
                let aop = new Aop4Javascript();
                aop.intercept(aop.getAopConfigParameters(
                    null,
                    'myInterceptedFunction',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    apiFakes.exceptionCallback,
                    apiFakes.finallyCallback,
                    wrapperCallback.bind(this)
                ));
                spyOn(window, 'myInterceptedFunction').and.callThrough();

                result = window.myInterceptedFunction(apiFakes.param1, apiFakes.param2);

                expect(result).toBeTruthy();
                expect(window.myInterceptedFunction).toHaveBeenCalledWith(apiFakes.param1, apiFakes.param2);
                expect(window.myInterceptedFunction.calls.count()).toEqual(apiFakes.once);
            });
        });
    });
    
    describe('Retry Manager - ', () => {
        it('With the "mustUseRetryManager === true" when there is an exception then the App retry calling the method call "defaultMaxAttemps" times', () => {
            let called = 0;
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'exceptionCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            spyOn(apiFakes.MySecondClass.prototype, 'exceptionTest').and.callFake(function () {
                called++;
                throw Error('the exception was throwed successfully');
            });
            let aop = new Aop4Javascript();
            aop.wrap(aop.getAopConfigParameters(
                    apiFakes.MySecondClass,
                    'exceptionTest',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    apiFakes.exceptionCallback,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback,
                    true));
            aop.setConfirmAction(() => {
                return true;
            });
            let sut = new apiFakes.MySecondClass();

            try {
                sut.exceptionTest();
            } catch (e) {
            }

            expect(called).toEqual(apiFakes.defaultMaxAttemps);
        });
        
        
        it('With twice "attemps" configured when there is an exception then the App retry calling the method call "defaultMaxAttemps" times', () => {
            let called = 0;
            spyOn(apiFakes, 'beforeCallback').and.callThrough();
            spyOn(apiFakes, 'afterCallback').and.callThrough();
            spyOn(apiFakes, 'exceptionCallback').and.callThrough();
            spyOn(apiFakes, 'finallyCallback').and.callThrough();
            spyOn(apiFakes, 'wrapperCallback').and.callThrough();
            spyOn(apiFakes.MySecondClass.prototype, 'exceptionTest').and.callFake(() => {
                called++;
                throw Error('the exception was throwed successfully');
            });
            let aop = new Aop4Javascript();
            aop.wrap(aop.getAopConfigParameters(
                    apiFakes.MySecondClass,
                    'exceptionTest',
                    apiFakes.beforeCallback,
                    apiFakes.afterCallback,
                    apiFakes.exceptionCallback,
                    apiFakes.finallyCallback,
                    apiFakes.wrapperCallback,
                    true));
            aop.setConfirmAction(function () {
                return true;
            });
            aop.setMaxAttemps(apiFakes.twice);
            let sut = new apiFakes.MySecondClass();

            try {
                sut.exceptionTest();
            } catch (e) {
            }

            expect(called).toEqual(apiFakes.twice);
        });
    });
});
