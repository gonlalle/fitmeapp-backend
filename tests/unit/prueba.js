let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
require("dotenv").config();

chai.use(chaiHttp);
const url = process.env.VUE_APP_BACKEND_URL ||'http://localhost:3000/api/v1';

 describe('Register: ', () => {
    it('should register successfully', (done) => {
      chai.request(url)
      .post('/auth/register')
      .send({username: "testUsername", password: "testPassword", isTestUser: true})
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Delete user: ', () => {
  it('should delete the users created on the previous tests', (done) => {
    chai.request(url)
    .delete('/users/test')
    .end(function(err,res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});