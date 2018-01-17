var expect = require('chai').expect;
var request = require('request');
var url = 'http://localhost:8080/calculate';

describe('Multiplication', function() {

    describe('Should be able to multiply two positive integers', function() {
        it('1500 * 2000 = 3000000', function(done) {
            request.post({
                url: url,
                form: {a: 1500,b: 2000,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('3000000');
                done();
            });
        });
    });

    describe('Should be able to multiply a floating point multiplicand with an integer multipliplier', function() {
        it('1.212 * 8 = 9.696', function(done) {
            request.post({
                url: url,
                form: {a: 1.212,b: 8,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('9.696');
                done();
            });
        });
    });

    describe('Should be able to multiply an integer multiplicand with a floating point multiplier', function() {
        it('3 * 1.212 = 3.636', function(done) {
            request.post({
                url: url,
                form: {a: 3,b: 1.212,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('3.636');
                done();
            });
        });
    });

    describe('Should be able to multiply two floating point numbers', function() {
        it('0.133 * 1.212 = 0.161196', function(done) {
            request.post({
                url: url,
                form: {a: 0.133,b: 1.212,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0.161196');
                done();
            });
        });
    });

    describe('Should be able to multiply a integer multiplicand with zero', function() {
        it('1500 * 0 = 0', function(done) {
            request.post({
                url: url,
                form: {a: 1500,b: 0,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0');
                done();
            });
        });
    });

    describe('Should be able to multiply a negative integer multiplicand with a positive integer multiplier', function() {
        it('-1500 * 2000 = -3000000', function(done) {
            request.post({
                url: url,
                form: {a: -1500,b: 2000,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-3000000');
                done();
            });
        });
    });

    describe('Should be able to multiply a negative floating point multiplicand with a positive integer multiplier', function() {
        it('-1.212 * 8 = -9.696', function(done) {
            request.post({
                url: url,
                form: {a: -1.212,b: 8,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-9.696');
                done();
            });
        });
    });

    describe('Should be able to multiply a negative integer multiplicand with a positive floating point multiplier', function() {
        it('-8 * 1.212 = -9.696', function(done) {
            request.post({
                url: url,
                form: {a: -8,b: 1.212,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-9.696');
                done();
            });
        });
    });

    describe('Should be able to multiply two many digit floating point numbers', function() {
        it('1.23456789 * 2.10987654 = 2.6047858281483006', function(done) {
            request.post({
                url: url,
                form: {a: 1.23456789,b: 2.10987654,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('2.6047858281483006');
                done();
            });
        });
    });

    describe('Should be able to multiply two large integers', function() {
        it('123456789 * 210987654 = 26047858281483006', function(done) {
            request.post({
                url: url,
                form: {a: 123456789,b: 210987654,operate: '*'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('26047858281483006');
                done();
            });
        });
    });

});
