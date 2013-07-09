define(function (require, exports, module) {

	'use strict';

    var baseForm = require('framework/form/baseForm');

    var createForm = baseForm.create();

    createForm.addField({
        validator: 'notEmpty',
        name: 'name',
        customError: 'Name cannot be empty'
    });

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient, $rootScope) {

        createForm.initialize($scope, 'createForm');

		function createGroup() {
            var errors = createForm.validate();
            if (errors) {
                $scope.status = 'error';
                $scope.message = errors[0].message;
            } else {
                groupsClient.create(createForm.toJSON(),
                    function (data) {
                        createForm.clear();
                        $scope.groups.push(data);
                    },
                    function (data) {
                        $scope.status = 'error';
                        $scope.message = data.error;
                    }
                );
            }
		}

		function deleteGroup(group) {
			groupsClient.delete(group.key);

			getGroups();
		}

		function getGroups() {
			groupsClient.findAll(function (data) {
				$scope.groups = data;
			});
		}


		//expose methods to view
		$scope.create = createGroup;
		$scope.delete = deleteGroup;
		$scope.refresh = getGroups;

		$scope.isAdmin = function (group) {
			return group.isAdmin($rootScope.user);
		};

		//default action
		getGroups();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', '$rootScope'];

	module.exports = Controller;

});
