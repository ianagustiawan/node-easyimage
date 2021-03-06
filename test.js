var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
    chai.use(chaiAsPromised);
    chai.should();
var assert = chai.assert;
var expect = chai.expect;
var fs = require('fs');

var outputDir = './output';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

var easyimg = require('./easyimage.js');
var srcimg = 'kitten.jpg';
var warningimg = 'letter.png';

describe('.info - ', function () {

    describe('valid file type', function () {
        it('should show file info', function () {
            return easyimg.info(srcimg);
        });
    });

    describe('valid file type with warning', function () {
		it('should show file info', function () {
			return expect(easyimg.info(warningimg)).to.eventually.have.property('warnings');
		});
	});

    describe('invalid file type', function () {
        it('should not be supported', function () {
            return assert.isRejected(easyimg.info('./test.js'), /^identify/);
        });
    });

});

describe('.convert -', function () {

    afterEach(function(done) {
        fs.unlink('./output/convert.png', function() {
            /* ignore any error unlinking */
            done();
        });
    });

    it('should convert an image format to another', function () {

        return easyimg.convert({src:srcimg, dst:'./output/convert.png', quality:10}).then(function (file) {
            file.should.be.a('object');
            file.should.have.property('type');
            file.type.should.be.equal('PNG');
            file.name.should.be.equal('convert.png');
        });

    });

});

describe('.rotate -', function () {

    afterEach(function(done) {
        fs.unlink('./output/rotated.jpg', function() {
            /* ignore any error unlinking */
            done();
        });
    });

    it('should rotate the image by 90 degree', function () {

        return easyimg.info(srcimg).then(function(info){
            info.should.have.property('width')
            info.should.have.property('height')

            // Mainly check only if width and height are swaped
            return easyimg.rotate({src:srcimg, dst:'./output/rotated.jpg', degree: 90}).then(function (file) {
                file.should.be.a('object');
                file.name.should.be.equal('rotated.jpg');
                file.should.have.property('width');
                file.width.should.be.equal(info.height);
                file.height.should.be.equal(info.width);
            });
        })
    });

});

describe('.resize -', function () {

    afterEach(function(done) {
        fs.unlink('./output/resize.jpg', function() {
            /* ignore any error unlinking */
            done();
        });
    });

    it('should resize an image', function () {

        return easyimg.resize({src:srcimg, dst:'./output/resize.jpg', width:640, height:480}).then(function (file) {
            file.should.be.a('object');
            file.should.have.property('width');
            file.width.should.be.equal(640);
            file.name.should.be.equal('resize.jpg');
        });

    });

});

describe('.crop -', function () {

    afterEach(function(done) {
        fs.unlink('./output/crop.jpg', function() {
            /* ignore any error unlinking */
            done();
        });
    });

    it('should crop an image', function () {

        return easyimg.crop({
            src:srcimg, dst:'./output/crop.jpg',
            cropwidth:128, cropheight:128,
            gravity:'North',
            x:0, y:0
        }).then(function (file) {
            file.should.be.a('object');
            file.should.have.property('width');
            file.width.should.be.equal(128);
            file.name.should.be.equal('crop.jpg');
        });

    });

});

describe('.rescrop -', function () {

    afterEach(function(done) {
        fs.unlink('./output/rescrop.jpg', function() {
            /* ignore any error unlinking */
            done();
        });
    });

    it('should resize and crop', function () {

        return easyimg.rescrop({
            src:srcimg, dst:'./output/rescrop.jpg',
            width:400, height:5400,
            cropwidth:100, cropheight:100,
            x:0, y:0
        }).then(function (file) {
            file.should.be.a('object');
            file.should.have.property('width');
            file.width.should.be.equal(100);
            file.name.should.be.equal('rescrop.jpg');
        });

    });

});

describe('.thumbnail -', function () {

    afterEach(function(done) {
        fs.unlink('./output/thumb nail.jpg', function() {
            /* ignore any error unlinking */
            done();
        });
    });

	//this.timeout(5000);
    it('should generate a thumbnail', function () {

        return easyimg.thumbnail({
            src:srcimg, dst:'./output/thumb nail.jpg',
            width:128, height:128,
            x:0, y:0
        }).then(function (file) {
            file.should.be.a('object');
            file.should.have.property('width');
            file.width.should.be.equal(128);
            file.name.should.be.equal('thumb nail.jpg');
        });

    });

});

describe('.exec -', function () {

    afterEach(function(done) {
        fs.unlink('./output/hello kitty.gif', function() {
            /* ignore any error unlinking */
            done();
        });
    });

    it('should invoke `convert` command', function () {
        return easyimg.exec('convert '+ srcimg +' ./output/hello\\ kitty.gif').then(function (file) {
        });

    });

});

