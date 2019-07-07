const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');

describe('GET /apps', () => {
    it('returns 400 when genre is not specified', () => {
        return request(app).get('/apps').expect(400, 'Please specify a genre')
    });
    it('returns 400 when genre is invalid', () => {
        return request(app).get('/apps').query({ genre: 'crap' }).expect(400, 'Genre must be action, puzzle, strategy, casual, arcade, or card')
    });
    it('returns correctly formatted results', () => {
        return request(app).get('/apps').query({ genre: 'action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                expect(res.body[0]).to.include.all.keys(
                    'App',
                    'Category',
                    'Rating',
                    'Reviews',
                    'Size',
                    'Installs',
                    'Type',
                    'Price',
                    'Content Rating',
                    'Genres',
                    'Last Updated',
                    'Current Ver',
                    'Android Ver')
            });
    });
    it('sorts properly when sort term is specified', () => {
        return request(app).get('/apps').query({ genre: 'action', sort: 'app' })
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while (sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].App < res.body[i + 1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
})