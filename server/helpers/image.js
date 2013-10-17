var im = require('imagemagick');
var fs = require('fs');

var image = {
  thumbnail: function(path, options, cb) {
      var proc = im.resize({
          srcPath: path,
          width:   options.size,
          height:  options.size
      }, function(err, stdout, stderr){
          if(err) {
              cb(err);
          }
          else {
              //remove temporary file
              fs.unlink(path, function(err) {
                  if (err) console.log(err);
              });
              cb(false, new Buffer(stdout, 'binary'));
          }
      });

      proc.on('error', function(err) {
          proc.kill();
      });
  }
};


module.exports = image;