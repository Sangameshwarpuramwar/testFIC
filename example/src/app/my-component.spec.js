'use strict';

describe('Component: myComponent', function () {

  beforeEach(module('myComponentModule'));

  describe('Tesing myComponent', function () {

    var element;
    var scope;
    var ctrl;
    beforeEach(inject(function ($rootScope, $compile, _$controller_) {
      // $controller = _$controller_;
      scope = $rootScope.$new();
      scope.outside = '1.5';
      element = angular.element('<my-component my-binding="{{outside}}"></my-component>');
      element = $compile(element)(scope);
      scope.$apply();
    }));

    beforeEach(inject(function (_$componentController_) {
      // $controller = _$controller_;
      var $componentController = _$componentController_;
      var myService;
      ctrl = $componentController('myComponent', myService, {});
    }));

    it('should render the text', function () {
      var h1 = element.find('h1');
      expect(h1.text()).toBe('Unit Testing AngularJS 1.5');
    });

    it('should update the rendered text when the parent scope changes', function () {
      scope.outside = '2.0';
      scope.$apply();
      var h1 = element.find('h1');
      expect(h1.text()).toBe('Unit Testing AngularJS 2.0');
    });

    describe('when calling controller properties', function () {


      beforeEach(inject(function (_$componentController_) {
        // $controller = _$controller_;
        var $componentController = _$componentController_;
        var myService;
        ctrl = $componentController('myComponent', myService, { myBinding: "007" });
      }));

      it('should expose my title', function () {
        expect(ctrl.myTitle).toBeDefined();
        expect(ctrl.myTitle).toBe('Unit Testing AngularJS');
      });

      it('should have my binding bound', function () {
        expect(ctrl.myBinding).toBeDefined();
        expect(ctrl.myBinding).toBe('007');
      });

      describe('when calling testData function', function () {

        it('testData should be defined', function () {
          expect(ctrl.testdata).toBeDefined();
        });

        it('then should return true', function () {

          expect(ctrl.testdata).toBeDefined();
          var test = ctrl.testdata();
          expect(test).toBe(true);
        });
      });

    });
    describe('When calling Async calls', function () {
      var deferred, myService;
      beforeEach(inject(function ($q, _myService_, _$componentController_) {
        // $controller = _$controller_;
        deferred = $q.defer();

        //spyOn(myService, 'syncCall').and.callThrough();

        var $componentController = _$componentController_;

        ctrl = $componentController('myComponent', myService, { myBinding: "1.5" });
        ctrl.myService = _myService_;
        myService = _myService_;
        spyOn(myService, 'asyncCall').and.returnValue(deferred.promise);
        ctrl.getAsyncData();
      }));

      it('should call asyncCall on service', function () {
        expect(ctrl.myService.asyncCall).toHaveBeenCalled();
        expect(ctrl.myService.asyncCall.calls.count()).toBe(1);
      });

      it('should do something on success', function () {
        var data = ['something', 'on', 'success'];
        deferred.resolve(data);
        scope.$digest();
        expect(ctrl.responseData).toBe(data);
      });

      it('should do something on error', function () {
        deferred.reject(400);
        scope.$digest();
        expect(ctrl.hasError).toBe(true);
      });

    });


  });




});
