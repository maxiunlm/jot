/* global expect, jasmine, Function, spyOn */
import ApiFakes from '../../Selenium/Fakes/apiFakes';
import RegisterMapperConfiguration from '../../src/apis/RegisterMapperConfiguration';
import GetterMapperConfiguration from '../../src/apis/GetterMapperConfiguration';
import Mapper4Javascript from '../../src/apis/Mapper4Javascript';

class OriginTestClass {
    constructor() {
        this.internalFifthClassAttribute = true;
        this.pedro = '10';

        this.originMethod = this.originMethod.bind(this);
    }

    originMethod() {
        return true;
    }

    anotherTest2(obj) {
        console.log('OriginTestClass::anotherTest2 was called');
        return obj.originMethod();
    }
}

class DestinationTestClass {
    constructor() {
        this.pedro = -1;
        this.pepe = '3';
        this.lui = '4';
        this.objectAttribute;
    }

    destinyMethod(param1, param2) {
    }

    anotherTest2() {
        console.log('DestinationTestClass::anotherTest2 was called');
        return false;
    }
}

describe('Mapper4Javascript - ', () => {
    let apiFakes = new ApiFakes();

    describe('CONSTRUCTOR - ', () => {
        //        it('without parameters then throws an instances of "TypeError" exception.', () => {
        //            try {
        //                let sut = new Mapper4Javascript();
        //                expect(false).toBeTruthy();
        //            } catch (e) {
        //                expect(e instanceof TypeError).toBeTruthy();
        //            }
        //        });

        it('with a "RegisterMapperConfiguration" parameter then instances an "Mapper4Javascript" object', () => {
            let paramConfig = new RegisterMapperConfiguration(Array, Object);

            let sut = new Mapper4Javascript(paramConfig);

            expect(sut.mappers).toBeDefined();
            expect(sut.mapperTypes).toBeDefined();
            expect(sut.defaultConfiguration instanceof RegisterMapperConfiguration).toBeTruthy();
        });
    });

    describe('registerMapper - ', () => {
        it('with a "RegisterMapperConfiguration" parameter then registers a "Configuration"', () => {
            let sut = new Mapper4Javascript();
            let paramConfig = new RegisterMapperConfiguration(Array, Object);

            sut.registerMapper(paramConfig);

            expect(sut.mappers).toBeDefined();
            expect(sut.mappers['Object2Array'].originKey).toEqual('Object');
            expect(sut.mappers['Object2Array'].destinationKey).toEqual('Array');
            expect(sut.mappers['Object2Array'].destinationObjectType).toEqual(Array);
            expect(sut.mappers['Object2Array'].originObjectType instanceof Object).toBeTruthy();
            expect(sut.mappers['Object2Array'].mapperCallback).toEqual(jasmine.any(Function));
            expect(sut.mappers['Object2Array'].ignoredAttributes).toEqual(jasmine.any(Array));
            expect(sut.mappers['Object2Array'].exceptedAttributes).toEqual(jasmine.any(Array));
            expect(sut.mappers['Object2Array'].ignoreAllAttributes).toEqual(false);
        });
    });

    describe('getMappedObject - ', () => {
        it('with a "GetterMapperConfiguration" then maps the Origin Object to the Destination Object', () => {
            let origin = new apiFakes.MyFifthClass();
            let destiny = new apiFakes.MySecondClass();
            let sut = new Mapper4Javascript();
            let paramConfig = new RegisterMapperConfiguration(
                    apiFakes.MySecondClass,
                    apiFakes.MyFifthClass,
                    null,
                    apiFakes.mySecondClassKey,
                    apiFakes.myFifthClassKey);
            let getterConfig = new GetterMapperConfiguration(apiFakes.mySecondClassKey, origin, destiny);
            sut.registerMapper(paramConfig);

            let result = sut.getMappedObject(getterConfig);

            expect(result).toBeDefined();
            expect(result).toBe(destiny);
            expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
            expect(result.pedro).toEqual(origin.pedro);
        });
    });

    describe('Changing the default Mapper Callback by: ', () => {
        describe('mapAllAttributesCallback - ', () => {
            it('changing the default Mapper Callback to "mapAllAttributesCallback" in the "RegisterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        sut.mapAllAttributesCallback,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(apiFakes.mySecondClassKey, origin, destiny);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
                expect(result.internalMethod).toBeUndefined();
                expect(origin.internalMethod).toBeDefined();
                expect(origin.internalMethod instanceof Function).toBeTruthy();
            });

            it('changing the default Mapper Callback to "mapAllAttributesCallback" in the "GetterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        null,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(
                        apiFakes.mySecondClassKey,
                        origin,
                        destiny,
                        undefined,
                        undefined,
                        undefined,
                        sut.mapAllAttributesCallback);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
                expect(result.internalMethod).toBeUndefined();
                expect(origin.internalMethod).toBeDefined();
                expect(origin.internalMethod instanceof Function).toBeTruthy();
            });
        });

        describe('mapAllOriginCallback - ', () => {
            it('changing the default Mapper Callback to "mapAllOriginCallback" in the "RegisterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        sut.mapAllOriginCallback,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(apiFakes.mySecondClassKey, origin, destiny);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeDefined();
                expect(result.fifthClassMethod instanceof Function).toBeTruthy();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });

            it('changing the default Mapper Callback to "mapAllOriginCallback" in the "GetterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        null,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(
                        apiFakes.mySecondClassKey,
                        origin,
                        destiny,
                        undefined,
                        undefined,
                        undefined,
                        sut.mapAllOriginCallback);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeDefined();
                expect(result.fifthClassMethod instanceof Function).toBeTruthy();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });
        });

        describe('mapAllOriginAttributesCallback - ', () => {
            it('changing the default Mapper Callback to "mapAllOriginAttributesCallback" in the "RegisterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        sut.mapAllOriginAttributesCallback,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(apiFakes.mySecondClassKey, origin, destiny);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });

            it('changing the default Mapper Callback to "mapAllOriginAttributesCallback" in the "GetterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        null,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(
                        apiFakes.mySecondClassKey,
                        origin,
                        destiny,
                        undefined,
                        undefined,
                        undefined,
                        sut.mapAllOriginAttributesCallback);

                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);
                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.internalMethod).toBeUndefined();
                expect(origin.internalMethod).toBeDefined();
                expect(origin.internalMethod instanceof Function).toBeTruthy();
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });
        });

        describe('mapAllOriginMethodsCallback - ', () => {
            it('changing the default Mapper Callback to "mapAllOriginMethodsCallback" in the "RegisterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        sut.mapAllOriginMethodsCallback,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(apiFakes.mySecondClassKey, origin, destiny);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).not.toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });

            it('changing the default Mapper Callback to "mapAllOriginMethodsCallback" in the "GetterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        null,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(
                        apiFakes.mySecondClassKey,
                        origin,
                        destiny,
                        undefined,
                        undefined,
                        undefined,
                        sut.mapAllOriginMethodsCallback);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).not.toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });
        });

        describe('mapAllCallback - ', () => {
            it('changing the default Mapper Callback to "mapAllCallback" in the "RegisterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        sut.mapAllCallback,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(apiFakes.mySecondClassKey, origin, destiny);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.fifthClassMethod).toBeUndefined();
                expect(result.internalFifthClassAttribute).toBeUndefined();
                expect(origin.internalFifthClassAttribute).toBeDefined();
                expect(result.internalMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });

            it('changing the default Mapper Callback to "mapAllCallback" in the "GetterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new apiFakes.MyFifthClass();
                let destiny = new apiFakes.MySecondClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        apiFakes.MySecondClass,
                        apiFakes.MyFifthClass,
                        null,
                        apiFakes.mySecondClassKey,
                        apiFakes.myFifthClassKey);
                let getterConfig = new GetterMapperConfiguration(
                        apiFakes.mySecondClassKey,
                        origin,
                        destiny,
                        undefined,
                        undefined,
                        undefined,
                        sut.mapAllCallback);
                sut.registerMapper(paramConfig);

                let result = sut.getMappedObject(getterConfig);

                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof apiFakes.MySecondClass).toBeTruthy();
                expect(result.pedro).toEqual(origin.pedro);
                expect(result.internalFifthClassAttribute).toBeUndefined();
                expect(origin.internalFifthClassAttribute).toBeDefined();
                expect(result.internalMethod).toBeUndefined();
                expect(origin.internalMethod).toBeDefined();
                expect(origin.internalMethod instanceof Function).toBeTruthy();
                expect(result.fifthClassMethod).toBeUndefined();
                expect(origin.fifthClassMethod).toBeDefined();
                expect(origin.fifthClassMethod instanceof Function).toBeTruthy();
            });
        });

        describe('mapAllMethodsCallback - ', () => {
            it('changing the default Mapper Callback to "mapAllMethodsCallback" in the "RegisterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new OriginTestClass();
                let destiny = new DestinationTestClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        DestinationTestClass,
                        OriginTestClass,
                        sut.mapAllMethodsCallback,
                        'DestinationTestClassKey',
                        'OriginTestClassKey');
                let getterConfig = new GetterMapperConfiguration(
                        'DestinationTestClassKey',
                        origin,
                        destiny,);
                sut.registerMapper(paramConfig);
                origin.originMethod = origin.originMethod.bind(origin);
                let result = sut.getMappedObject(getterConfig);

                let wasOriginMethodCalled = result.anotherTest2(origin);

                expect(wasOriginMethodCalled).toBeTruthy();
                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof DestinationTestClass).toBeTruthy();
                expect(result.pedro).not.toEqual(origin.pedro);
                expect(result.originMethod).toBeUndefined();
                expect(origin.originMethod).toBeDefined();
                expect(origin.originMethod instanceof Function).toBeTruthy();
                expect(origin.destinyMethod).toBeUndefined();
                expect(result.destinyMethod).toBeDefined();
                expect(result.destinyMethod instanceof Function).toBeTruthy();
                expect(result.anotherTest2).toBeDefined();
                expect(result.anotherTest2 instanceof Function).toBeTruthy();
                expect(origin.anotherTest2).toBeDefined();
                expect(origin.anotherTest2 instanceof Function).toBeTruthy();
            });

            it('changing the default Mapper Callback to "mapAllMethodsCallback" in the "GetterMapperConfiguration" object then maps the Origin Object to the Destination Object', () => {
                let origin = new OriginTestClass();
                let destiny = new DestinationTestClass();
                let sut = new Mapper4Javascript();
                let paramConfig = new RegisterMapperConfiguration(
                        DestinationTestClass,
                        OriginTestClass,
                        null,
                        'DestinationTestClassKey',
                        'OriginTestClassKey');
                    let getterConfig = new GetterMapperConfiguration(
                        'DestinationTestClassKey',
                        origin,
                        destiny,
                        undefined,
                        undefined,
                        undefined,
                        sut.mapAllMethodsCallback);
                sut.registerMapper(paramConfig);
                origin.originMethod = origin.originMethod.bind(origin);
                let result = sut.getMappedObject(getterConfig);

                let wasOriginMethodCalled = result.anotherTest2(origin);

                expect(wasOriginMethodCalled).toBeTruthy();
                expect(result).toBeDefined();
                expect(result).toBe(destiny);
                expect(result instanceof DestinationTestClass).toBeTruthy();
                expect(result.pedro).not.toEqual(origin.pedro);
                expect(result.originMethod).toBeUndefined();
                expect(origin.originMethod).toBeDefined();
                expect(origin.originMethod instanceof Function).toBeTruthy();
                expect(origin.destinyMethod).toBeUndefined();
                expect(result.destinyMethod).toBeDefined();
                expect(result.destinyMethod instanceof Function).toBeTruthy();
                expect(result.anotherTest2).toBeDefined();
                expect(result.anotherTest2 instanceof Function).toBeTruthy();
                expect(origin.anotherTest2).toBeDefined();
                expect(origin.anotherTest2 instanceof Function).toBeTruthy();
            });
        });
    });
});
