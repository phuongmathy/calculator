var expect = require('chai').expect;
var request = require('request');
var url = 'http://localhost:8080/calculate';

describe('Addition', function() {

    describe('Should be able to add two positive integers numbers',
        function() {

            it('1500 + 2000 = 3500', function(done) {
                request.post({
                    url: url,
                    form: {a: 1500,b: 2000,operate: '+'},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    var result = JSON.parse(body);
                    expect(result.result).to.equal('3500');
                    done();
                });
            });

            it('1 + 2 = 3', function(done) {
                request.post({
                    url: url,
                    form: {a: 1,b: 2,operate: '+'},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    var result = JSON.parse(body);
                    expect(result.result).to.equal('3');
                    done();
                });
            });
        });

    describe('Should be able to add a negative integer to a positive floating point number', function(){
        it('-1 + 1.000 = 0', function(done) {
            request.post({
                url: url,
                form: {a: -1,b: 1.000,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0');
                done();
            });
        });
    });

    describe('Should be able to add a floating point number to an integer', function(){
        it('10.1 + 2 = 12.1', function(done) {
            request.post({
                url: url,
                form: {a: 10.1,b: 2,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('12.1');
                done();
            });
        });
    });

    describe('Should be able to add an integer to a floating point number', function(){
        it('10 + 9.9999 = 19.9999', function(done) {
            request.post({
                url: url,
                form: {a: 10,b: 9.9999,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('19.9999');
                done();
            });
        });
    });

    describe('Should be able to add two floating point numbers', function(){
        it('34.999 + 1.0 = 35.999', function(done) {
            request.post({
                url: url,
                form: {a: 34.999,b: 1.0,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('35.999');
                done();
            });
        });
    });

    describe('Should be able to add a negative integer and zero', function(){
        it('-5 + 0 = -5', function(done) {
            request.post({
                url: url,
                form: {a: -5,b: 0,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-5');
                done();
            });
        });
    });

    describe('Should be able to add zero and a positive integer', function(){
        it('0 + 5 = 5', function(done) {
            request.post({
                url: url,
                form: {a: 0,b: 5,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('5');
                done();
            });
        });
    });


    describe('Should be able to add a negative integer with a positive number', function(){
        it('-5 + 5 = 0', function(done) {
            request.post({
                url: url,
                form: {a: -5,b: 5,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('0');
                done();
            });
        });
    });

    describe('Should be able to add two large positive integers', function(){
        it('300000000 + 900000000 = 1200000000', function(done) {
            request.post({
                url: url,
                form: {a: 300000000,b: 900000000,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('1200000000');
                done();
            });
        });
        it('900000000 + 900000000 = 1800000000', function(done) {
            request.post({
                url: url,
                form: {a: 900000000,b: 900000000,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('1800000000');
                done();
            });
        });
        it('999999999 + 1 = 1000000000', function(done) {
            request.post({
                url: url,
                form: {a: 999999999,b: 1,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('1000000000');
                done();
            });
        });
    });

    describe('Should be able to add a negative floating point and a positive integer', function(){
        it('-1987.50 + 1987 = -0.5', function(done) {
            request.post({
                url: url,
                form: {a: -1987.50,b: 1987,operate: '+'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                var result = JSON.parse(body);
                expect(result.result).to.equal('-0.5');
                done();
            });
        });
    });

});
