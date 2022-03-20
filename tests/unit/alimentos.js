let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
require("dotenv").config();

chai.use(chaiHttp);
const url = process.env.VUE_APP_BACKEND_URL ||'http://localhost:3000/api/v1';

 describe('Get Alimentos: ', () => {
    it('should get successfully', (done) => {
      chai.request(url)
      .get('/alimentos')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Get Alimentos Favoritos: ', () => {
    it('should get successfully', (done) => {
      chai.request(url)
      .get('/alimentos/favoritos/prueba')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Get Alimentos Recientes: ', () => {
    it('should get successfully', (done) => {
      chai.request(url)
      .get('/alimentos/recientes/prueba')
      .send()
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Post Comsuption Recientes: ', () => {
    it('should post successfully', (done) => {
      chai.request(url)
      .post('/alimentos/newConsumption')
      .send({product_id: "62250cd9bb396cea00a25a65", username: "prueba", num_consumption: 1, last_consumption: "2022-01-16"})
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 