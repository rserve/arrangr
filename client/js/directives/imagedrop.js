define(function (require, exports, module) {

    'use strict';

    var dropbox,
        message,
        response;

    var template = '<div class="preview">' +
        '<span class="imageHolder">' +
        '<img />' +
        '<span class="uploaded"></span>' +
        '</span>' +
        '<div class="progressHolder">' +
        '<div class="progress"></div>' +
        '</div>' +
        '</div>';

    var init = function (element, url) {
        dropbox = $(element);
        message = $('.message', dropbox);

        dropbox.filedrop({
            // The name of the $_FILES entry:
            paramname: 'thumbnail',

            maxfiles: 1,
            maxfilesize: 0.1, // in mb
            url: url,

            uploadFinished: function (i, file, res) {
                $.data(file).addClass('done');
                response = res;
            },

            error: function (err, file) {
                switch (err) {
                    case 'BrowserNotSupported':
                        showMessage('Your browser does not support HTML5 file uploads!');
                        break;
                    case 'TooManyFiles':
                        alert('Too many files! Please select 5 at most!');
                        break;
                    case 'FileTooLarge':
                        alert(file.name + ' is too large! Please upload files up to 2mb.');
                        break;
                    default:
                        alert('Error from server:' + response);
                        break;
                }
            },

            // Called before each upload is started
            beforeEach: function (file) {
                if (!file.type.match(/^image\//)) {
                    alert('Only images are allowed!');

                    // Returning false will cause the
                    // file to be rejected
                    return false;
                }
            },

            uploadStarted: function (i, file, len) {
                createImage(file);
            },

            progressUpdated: function (i, file, progress) {
                $.data(file).find('.progress').width(progress);
            }

        });
    };

    function createImage(file) {

        var preview = $(template),
            image = $('img', preview);

        var reader = new FileReader();

        image.width = 100;
        image.height = 100;

        reader.onload = function (e) {

            // e.target.result holds the DataURL which
            // can be used as a source of the image:

            image.attr('src', e.target.result);
        };

        // Reading the file as a DataURL. When finished,
        // this will trigger the onload function above:
        reader.readAsDataURL(file);

        message.hide();
        preview.appendTo(dropbox);

        // Associating a preview container
        // with the file, using jQuery's $.data():

        $.data(file, preview);
    }

    function showMessage(msg) {
        message.html(msg);
    }

    var factory = function () {
        return {
            restrict: 'C',
            template: '<span class="message">Drop image here.</span>',
            link: function (scope, element, attr) {
                scope.$watch(attr.uploadUrl, function (url) {
                    if (url) {
                        init(element, url);
                    }
                });
            }
        }
    };

    //export
    module.exports = factory;
});
