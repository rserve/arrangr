define(function (require, exports, module) {

	'use strict';

    var baseForm = require('framework/form/baseForm');

    var createForm = baseForm.create();

    createForm.addField({
        validator: 'notEmpty',
        name: 'name',
        customError: 'Name cannot be empty'
    });

	var Controller = function ($scope, groupsClient, $rootScope, flash) {

        createForm.initialize($scope, 'createForm');

		function createGroup() {
            var errors = createForm.validate();
            if (errors) {
                flash.error = errors[0].message;
            } else {
                groupsClient.create(createForm.toJSON(),
                    function (data) {
                        createForm.clear();
                        flash.success = 'Meetup created';
                        getGroups();
                    },
                    function (data) {
                        flash.error = data.message;
                    }
                );
            }
		}

		function deleteGroup(group) {
			groupsClient.delete(group.key, function() {
                flash.success = 'Meetup deleted';
                getGroups();
            },
            function(data) {
                flash.error = data.message;
            });
		}

		function getGroups() {
			groupsClient.findAll(function (data) {
				$scope.groups = data;
			});
		}


		//expose methods to view
		$scope.create = createGroup;
		$scope.delete = deleteGroup;

		$scope.isAdmin = function (group) {
			return group.isAdmin($rootScope.user);
		};

        $scope.member = function (group) {
            return group.member($rootScope.user)
        };

		//default action
		getGroups();

	};

	//inject dependencies
	Controller.$inject = ['$scope', 'groupsClient', '$rootScope', 'flash'];

	module.exports = Controller;

});
