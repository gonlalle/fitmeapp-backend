let chai = require('chai');
let app = require('../../index.js');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
require("dotenv").config();
require('../../routes/alimentos.js')

chai.use(chaiHttp);

 describe('Get Alimentos: ', () => {
    it('should get successfully', (done) => {
      chai.request(app)
      .get('/api/v1/alimentos')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Get Alimentos Favoritos: ', () => {
    it('should get successfully', (done) => {
      chai.request(app)
      .get('/api/v1/alimentos/favoritos/prueba')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Get Alimentos Recientes: ', () => {
    it('should get successfully', (done) => {
      chai.request(app)
      .get('/api/v1/alimentos/recientes/prueba')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 