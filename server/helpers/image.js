var im = require('imagemagick');

var image = {
  thumbnail: function(path, size, cb) {
      im.resize({
          srcPath: path,
          width:   100,
          height:  100
      }, function(err, stdout, stderr){
          cb(err, new Buffer(stdout, 'binary'));
      });
  }
};


module.exports = image;