let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let app = require('../../index.js');
require("dotenv").config();
require('../../routes/auth.js')
require('../../routes/users.js')

chai.use(chaiHttp);

 describe('Register: ', () => {
    it('should register successfully', (done) => {
      chai.request(app)
      .post('/api/v1/auth/register')
      .send({username: "testUsername", password: "testPassword", isTestUser: true})
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
}); 

describe('Delete user: ', () => {
  it('should delete the users created on the previous tests', (done) => {
    chai.request(app)
    .delete('/api/v1/users/test')
    .end(function(err,res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});