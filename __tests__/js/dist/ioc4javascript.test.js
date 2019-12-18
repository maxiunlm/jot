/* global expect */
import ApiFakes from '../../Selenium/Fakes/apiFakes';
import IoC4Javascript from '../../src/apis/ioc4javascript';

describe('IoC4Javascript - ', () => {
    let apiFakes = new ApiFakes();
    
    describe('CONSTRUCTOR - ', () => {
        it('without parameters then instances an "IoC4Javascript" object', () => {
            let sut = new IoC4Javascript();

            expect(sut instanceof IoC4Javascript).toBeTruthy();
            expect(sut.types instanceof Object).toBeTruthy();
            expect(sut.constructors instanceof Object).toBeTruthy();
            expect(sut.singletons instanceof Object).toBeTruthy();
            expect(sut.aop instanceof Object).toBeTruthy();
            expect(sut.mapper instanceof Object).toBeTruthy();
        });

        it('SINGLETON - ', () => {
            let sut = new IoC4Javascript();
            let sut2 = new IoC4Javascript();

            expect(window.ioc4JavascriptInstance instanceof IoC4Javascript).toBeTruthy();
            expect(sut).toBe(window.ioc4JavascriptInstance);
            expect(sut).toBe(sut2);
        });
    });

    describe('deleteInstance - ', () => {
        it('without parameters instance an "IoC4Javascript" object when the "" methos is called then the Songleton Instance is null', () => {
            let sut = new IoC4Javascript();
            expect(window.ioc4JavascriptInstance instanceof IoC4Javascript).toBeTruthy();
            expect(sut).toBe(window.ioc4JavascriptInstance);

            sut.deleteInstance();
            expect(window.ioc4JavascriptInstance).toEqual(null);
            expect(sut).not.toBe(window.ioc4JavascriptInstance);
        });
    });

    describe('registerConstructor - ', () => {
        it('with a "String Key" and a constructor method then regsters this method into the "IoC Object"', () => {
            let sut = new IoC4Javascript();
            spyOn(ApiFakes.prototype, 'constructAnObject').and.callThrough();

            sut.registerConstructor(apiFakes.constructorKey, apiFakes.constructAnObject.bind(apiFakes));
            let result = sut.getInstanceOf(apiFakes.constructorKey);

            expect(ApiFakes.prototype.constructAnObject).toHaveBeenCalled();
            expect(ApiFakes.prototype.constructAnObject.calls.count()).toEqual(apiFakes.once);
        });
    });

    describe('registerType - ', () => {

        it('with an Object Class Type and a Key and an Empty Callback Metho then the IoC registers a Type', () => {
            let sut = new IoC4Javascript();

            sut.registerType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey, () => {

            });
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result instanceof apiFakes.MyFifthClass).toBeTruthy();
        });

        it('with an Object Class Type and a Key and a Callback Method then the IoC registers a Type', () => {
            let sut = new IoC4Javascript();

            sut.registerType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey, () => {
                return new apiFakes.MyFifthClass();
            });
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result instanceof apiFakes.MyFifthClass).toBeTruthy();
        });

        it('with an Object Class Type and a Key and a Callback Method then the IoC registers a Type', () => {
            let sut = new IoC4Javascript();
            let originalObject = new apiFakes.MyFifthClass();

            sut.registerType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey, () => {
                return originalObject;
            });
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result).toBe(originalObject);
        });
    });

    describe('registerSingletonType - ', () => {
        it('with an Object Class Type and a Key when the IoC registers a Type then the IoC always returns the same Instance Object', () => {

            let sut = new IoC4Javascript();

            sut.registerSingletonType(apiFakes.MyThirdClass, apiFakes.myThirdClassKey);
            let result = sut.getInstanceOf(apiFakes.myThirdClassKey);
            let secondResult = sut.getInstanceOf(apiFakes.myThirdClassKey);

            expect(result instanceof apiFakes.MyThirdClass).toBeTruthy();
            expect(result).toBe(secondResult);
        });

        it('with an Object Class Type and a Key and an Empty Callback Metho then the IoC registers the Type', () => {
            let sut = new IoC4Javascript();

            sut.registerSingletonType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey, () => {

            });
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result instanceof apiFakes.MyFifthClass).toBeTruthy();
        });

        it('with an Object Class Type and a Key and a Callback Method then the IoC registers the Type', () => {
            let sut = new IoC4Javascript();

            sut.registerSingletonType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey, () => {
                return new apiFakes.MyFifthClass();
            });
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result instanceof apiFakes.MyFifthClass).toBeTruthy();
        });

        it('with an Object Class Type and a Key and a Callback Method then the IoC registers the Type', () => {
            let sut = new IoC4Javascript();
            let originalObject = new apiFakes.MyFifthClass();

            sut.registerSingletonType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey, () => {
                return originalObject;
            });
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result).toBe(originalObject);
        });

        it('with an Object Class Type and a Key and an Inastance Object then the IoC registers the Type', () => {
            let sut = new IoC4Javascript();
            let originalObject = new apiFakes.MyFourthClass();

            sut.registerSingletonType(apiFakes.MyFourthClass, apiFakes.myFourthClassKey, false, originalObject);
            let result = sut.getInstanceOf(apiFakes.myFourthClassKey);

            expect(result).toBe(originalObject);
        });
    });

    describe('getInstanceOf - ', () => {
        it('with an Object Class Type and a Key when the "registerType" method registers a Type then the IoC returns an Instanced Object', () => {
            let sut = new IoC4Javascript();

            sut.registerType(apiFakes.MyFifthClass, apiFakes.myFifthClassKey);
            let result = sut.getInstanceOf(apiFakes.myFifthClassKey);

            expect(result instanceof apiFakes.MyFifthClass).toBeTruthy();
        });
        
        it('with a Singleton Object Class Type and a Key then the "registerSingletonType" method registers a Type then the IoC returns an Instanced Object', () => {
            let sut = new IoC4Javascript();

            sut.registerSingletonType(apiFakes.MySecondClass, apiFakes.mySecondClassKey);
            let result = sut.getInstanceOf(apiFakes.mySecondClassKey);

            expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
        });
        
        it('with an Object Constructor Method and a Key then the "registerConstructor" method registers a Type then the IoC returns an Instanced Object', () => {
            let sut = new IoC4Javascript();
            let myThirdClass = new apiFakes.MyThirdClass();

            sut.registerConstructor(apiFakes.constructorKey, myThirdClass.constructAnArray.bind(myThirdClass));
            let result = sut.getInstanceOf(apiFakes.constructorKey);

            expect(result instanceof Array).toBeTruthy();
        });
    });
});
