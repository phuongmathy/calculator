var expect = require('chai').expect;
var request = require('request');
var url = 'http://localhost:8080/calculate';

describe('Division', function() {

    describe('Should be able to divide two positive integers', function() {
        it('1500 / 2000 = 0.75', function(done) {
            request.post({
                url: url,
                form: {a: 1500,b: 2000,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0.75');
                done();
            });
        });
    });

    describe('Should be able to divide 0 by a integer divisor', function() {
        it('0 / 2000 = 0', function(done) {
            request.post({
                url: url,
                form: {a: 0,b: 2000,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0');
                done();
            });
        });
    });

    describe('Should be able to divide a negative dividend by a positive divisor', function() {
        it('-1500 / 2000 = -0.75', function(done) {
            request.post({
                url: url,
                form: {a: -1500,b: 2000,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-0.75');
                done();
            });
        });
    });

    describe('Should be able to divide a negative floating point dividend by a positive divisor', function() {
        it('-3.123 / 5 = -0.6246', function(done) {
            request.post({
                url: url,
                form: {a: -3.123,b: 5,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-0.6246');
                done();
            });
        });
    });

    describe('Should be able to divide a negative integer dividend by a positive floating point divisor to nine significiant figures', function() {
        it('-5 / 3.123 = -1.60102465577969900736', function(done) {
            request.post({
                url: url,
                form: {a: -5,b: 3.123,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-1.60102465577969900736');
                done();
            });
        });
    });

    describe('Should be able to divide an floating point dividend by an integer divisor', function() {
        it('4.21 / 3 = 1.40333333333333333333', function(done) {
            request.post({
                url: url,
                form: {a: 4.21,b: 3,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('1.40333333333333333333');
                done();
            });
        });
    });

    describe('Should be able to divide an integer dividend by a floating point divisor', function() {
        it('10 / 3.123 = 3.20204931155939801473', function(done) {
            request.post({
                url: url,
                form: {a: 10,b: 3.123,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('3.20204931155939801473');
                done();
            });
        });
    });

    describe('Should be able to divide two floating point numbers', function() {
        it('0.234 / 3.123 =0.07492795389048991354', function(done) {
            request.post({
                url: url,
                form: {a: 0.234,b: 3.123,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0.07492795389048991354');
                done();
            });
        });
    });

    describe('Should report error for division by 0', function() {
        it('1500 / 0 = Error', function(done) {
            request.post({
                url: url,
                form: {a: 1500,b: 0,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('Error');
                done();
            });
        });
    });

    describe('Should be able to divide two many digit floating point numbers', function() {
        it('1.23456789 / 2.10987654 = 0.58513750287967086453', function(done) {
            request.post({
                url: url,
                form: {a: 1.23456789,b: 2.10987654,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0.58513750287967086453');
                done();
            });
        });
    });

    describe('Should be able to divide a negative integer by a large integer', function() {
        it('-500 / 123456789 = -0.000004050000036855', function(done) {
            request.post({
                url: url,
                form: {a: -500,b: 123456789,operate: '/'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-0.000004050000036855');
                done();
            });
        });
    });

});
