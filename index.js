const dbConnect = require("./db");
const app = require("./server.js");
const User = require('./models/user');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

dbConnect().then(
  async () => {
    const server = await app.listen(PORT, () => {
      console.log("Connection successfully established.");
    });
  },
  (err) => {
    console.log("Connection error: " + err);
  }
);


//Actualizar los datos nutricionales cuando sea el cumple del usuario (ya que cambia su edad)
var CronJob = require("cron").CronJob;

new CronJob("00 00 * * *", function() {
  User.find().then(data =>{
    for (var i=0; i<data.length; i++){
      console.log("Dentro del usuario!!!");
      let usuario = data[i];
      var hoy = new Date();
      var cumpleanos = new Date(usuario.fechaNacimiento);
      var m = cumpleanos.getMonth()-hoy.getMonth()
      var d = cumpleanos.getDate()-hoy.getDate()
      if ((d===0)&&(m===0)) {
          console.log("Actualice los datos!");
          var corrector_actividad = 1.2
          var tmb = 0
          if(usuario.nivel_actividad == "Ejercicio Ligero"){
              corrector_actividad = 1.375
          }else if(usuario.nivel_actividad == "Ejercicio moderado"){
              corrector_actividad = 1.55
          }else if(usuario.nivel_actividad == "Ejercicio fuerte"){
              corrector_actividad = 1.725
          }else if(usuario.nivel_actividad == "Ejercicio muy fuerte"){
              corrector_actividad = 1.9
          }
  
          if (usuario.sexo == "Masculino"){
              tmb = 66 + (13.7 * usuario.peso_actual) + (5 * usuario.altura) - (6.75 * calcularEdad(usuario.fechaNacimiento))
              tmb *= corrector_actividad  
              if(usuario.objetivo == "Perder peso" || usuario.objetivo == "Aumentar masa muscular"){
                  tmb += usuario.objetivo_semanal * 1000
              }
          }else{
              tmb = 665 + (9.6 * usuario.peso_actual) + (1.8 * usuario.altura) - (4.7 * calcularEdad(usuario.fechaNacimiento))
              tmb *= corrector_actividad  
              if(usuario.objetivo == "Perder peso" || usuario.objetivo == "Aumentar masa muscular"){
                  tmb += usuario.objetivo_semanal * 1600
              }
          }
  
          if(tmb > 1200)  {
              usuario.kcal_recomendadas = tmb
          }else{
              usuario.kcal_recomendadas = 1200
          }
  
          if(usuario.dieta_pref == "Estándar"){
              usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.5
              usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.2
              usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.3
          }else if(usuario.dieta_pref == "Baja en carbohidratos"){
              usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.3
              usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.25
              usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.45
          }else if(usuario.dieta_pref == "Alta en proteínas"){
              usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.35
              usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.4
              usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.25
          }else if(usuario.dieta_pref == "Baja en grasas"){
              usuario.carbohidratos_recomendados = usuario.kcal_recomendadas * 0.55
              usuario.proteinas_recomendadas = usuario.kcal_recomendadas * 0.2
              usuario.grasas_recomendadas = usuario.kcal_recomendadas * 0.25
          }
      }
    }
  })
}, function() {
  null
}, true);

function calcularEdad(fechaNacimiento) {
  var hoy = new Date();
  var cumpleanos = new Date(fechaNacimiento);
  var edad = hoy.getFullYear() - cumpleanos.getFullYear();
  var m = hoy.getMonth() - cumpleanos.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
  }

  return edad;
}