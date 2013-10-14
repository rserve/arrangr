/* global $ */
define(function (require, exports, module) {

    'use strict';

    var factory = function (flash) {

        var dropbox,
            message,
            response;

        var template = '<div class="preview">' +
            '<img class="thumbnail"/>' +
            '<div class="progress">' +
            '<div class="progress-bar progress-bar-success"  role="progressbar">' +
            '</div>' +
            '</div>' +
            '</div>';

        var init = function (element, url) {
            dropbox = $(element);
            message = $('.message', dropbox);

            dropbox.filedrop({
                // The name of the $_FILES entry:
                paramname: 'thumbnail',

                maxfiles: 1,
                maxfilesize: 1, // in mb
                url: url,

                uploadFinished: function (i, file, res) {
                    $.data(file).addClass('done');
                    $.data(file).find('.progress').fadeOut('slow');
                    flash.success = 'Image uploaded';

                    response = res;
                },

                error: function (err, file) {
                    switch (err) {
                        case 'BrowserNotSupported':
                            flash.error = 'Your browser does not support HTML5 file uploads!';
                            break;
                        case 'TooManyFiles':
                            flash.error = 'Too many files! Please select 5 at most!';
                            break;
                        case 'FileTooLarge':
                            flash.error = 'File is too large! Please upload files up to 100kb.';
                            break;
                        default:
                            flash.error = 'Error from server:' + response;
                            break;
                    }
                },

                // Called before each upload is started
                beforeEach: function (file) {
                    if (!file.type.match(/^image\//)) {
                        flash.error = 'Only images are allowed!';

                        // Returning false will cause the
                        // file to be rejected
                        return false;
                    }
                },

                uploadStarted: function (i, file, len) {
                    dropbox.find('.thumbnail').hide();
                    createImage(file);
                },

                progressUpdated: function (i, file, progress) {
                    $.data(file).find('.progress-bar').width(progress);
                },

                docOver: function() {
                    dropbox.addClass('dragging');
                },
                docLeave: function() {
                    dropbox.removeClass('dragging');
                },
                drop: function() {
                    dropbox.removeClass('dragging');
                }
            });
        };

        function createImage(file) {

            var preview = $(template),
                image = $('img', preview);

            var reader = new FileReader();

//            image.width = 100;
//            image.height = 100;

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


        return {
            restrict: 'C',
            link: function (scope, element, attr) {
                scope.$watch(attr.uploadUrl, function (url) {
                    if (url) {
                        init(element, url);
                    }
                });
            }
        };
    };

    //export
    module.exports = factory;
});
