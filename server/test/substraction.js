var expect = require('chai').expect;
var request = require('request');
var url = 'http://localhost:8080/calculate';

describe('Substraction', function() {
    describe('Should be able to subtract two positive integers', function() {
        it('1500 - 2000 = -500', function(done) {
            request.post({
                url: url,
                form: {a: 1500,b: 2000,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-500');
                done();
            });
        });
        it('9 - 3 = 6', function(done) {
            request.post({
                url: url,
                form: {a: 9,b: 3,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('6');
                done();
            });
        });
    });

    describe('Should be able to subtract zero from a negative integer', function() {
        it('-3 - 0 = -3', function(done) {
            request.post({
                url: url,
                form: {a: -3,b: 0,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-3');
                done();
            });
        });
    });

    describe('Should be able to subtract 0 from a positive integer', function() {
        it('3 - 0 = 3', function(done) {
            request.post({
                url: url,
                form: {a: 3,b: 0,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('3');
                done();
            });
        });
    });

    describe('Should be able to subtract a floating point number from a negative integer', function() {
        it('-1 - 2.25 = -3.25', function(done) {
            request.post({
                url: url,
                form: {a: -1,b: 2.25,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-3.25');
                done();
            });
        });
    });

    describe('Should be able to subtract an integer from a floating point number', function() {
        it('9.35 - 1 = 8.35', function(done) {
            request.post({
                url: url,
                form: {a: 9.35,b: 1,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('8.35');
                done();
            });
        });
    });


    describe('Should be able to subtract a floating point number from an integer', function() {
        it('9 - 1.35 = 7.65', function(done) {
            request.post({
                url: url,
                form: {a: 9,b: 1.35,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('7.65');
                done();
            });
        });
    });

    describe('Should be able to subtract two floating point numbers', function() {
        it('0.29 - 1.35 = -1.06', function(done) {
            request.post({
                url: url,
                form: {a: 0.29,b: 1.35,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-1.06');
                done();
            });
        });
    });

    describe('Should be able to subtract two max-input floating point numbers', function() {
        it('7.1234567 - 2.2109876 = 4.9124691', function(done) {
            request.post({
                url: url,
                form: {a: 7.1234567,b: 2.2109876,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('4.9124691');
                done();
            });
        });
    });

    describe('Should be able to subtract an integer from a negative floating point number', function() {
        it('-1.33 - 2 = -3.33', function(done) {
            request.post({
                url: url,
                form: {a: -1.33,b: 2,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-3.33');
                done();
            });
        });
    });

    describe('Should be able to subtract two large integers', function() {
        it('123456789 - 210987654 = -87530865', function(done) {
            request.post({
                url: url,
                form: {a: 123456789,b: 210987654,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-87530865');
                done();
            });
        });
    });

    describe('Should be able to subtract two floating point numbers with many digits', function() {
        it('7.12345678 - 2.21098765 = 4.91246913', function(done) {
            request.post({
                url: url,
                form: {a: 7.12345678,b: 2.21098765,operate: '-'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('4.91246913');
                done();
            });
        });
    });






});
