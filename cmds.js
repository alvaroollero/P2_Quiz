const model=require("./model");
const {log,biglog,errorlog,colorize}=require("./out");

exports.helpCmd=rl=>{
  log("Comandos:");
  log("h|help - Muestra ayuda");
  log("list-Listar quizzes existentes");
  log("show <id>-Muestro la pregunta y la respuesta del quiz indicado");
  log("add-Añadir nuevo quiz interactivamente");
  log("delete <id>- Borrar el quiz indicado");
  log("edit <id>-Editar el quiz indicado");
  log("test <id>-Probar el quiz indicado");
  log("p|play-Jugar a preguntar aleatoriamente todos los quizzes");
  log("credits-Creditos");
  log("q|quit-Salir del programa");
  rl.prompt();
};

exports.quitCmd=rl=>{
  rl.close();
  rl.prompt();
};

exports.addCmd=rl=>{
  rl.question(colorize("Introduzca una pregunta: ","red"),question=>{
    rl.question(colorize("Introduzca la respuesta: ","red"),answer =>{
      model.add(question,answer);
      log(`${colorize("Se ha añadido","magenta")}: ${question} ${colorize("=>","magenta")}${answer}`);
      rl.prompt();
    })
  })
};

exports.listCmd=rl=>{
  model.getAll().forEach((quiz,id) =>{
    log(`[${colorize(id,"magenta")}]:${quiz.question+""}`);
  });
  rl.prompt();
};

exports.showCmd= (rl,id) =>{
  if(typeof id==="undefined"){
    errorlog("El valor del parámetro id no es válido.");
  }else{
    try{
      const quiz=model.getByIndex(id);
      log(`[${colorize(id,"magenta")}]: ${quiz.question} ${colorize("=>","magenta")} ${quiz.answer}`);
    }catch (error){
      errorlog(error.message);
    }
  }

  rl.prompt();
};

exports.testCmd= (rl,id) =>{
  if(typeof id==="undefined"){
    errorlog("Falta el parametro id");
  }else{
    try{
      const quiz=model.getByIndex(id);
      rl.question(`${colorize(quiz.question,"red")} `, answer=>{
        if(answer.toUpperCase()===quiz.answer.toUpperCase()){
          log("Su respuesta es correcta.");
          biglog("CORRECTA","green");
        }else{
          log("Su respuesta es incorrecta.");
          biglog("INCORRECTA","magenta");
        }
        rl.prompt();
      });
    }catch(error){
      errorlog(error.message);
      rl.prompt();
    }
  }
};

exports.playCmd=rl=>{ 
let score=0;
let toBeResolved=[];
let numtotalquiz=model.count();

 for(var i=0;i<model.count();i++){
  toBeResolved[i]=i;
 };

const aleatorio=()=>{
  id=Math.floor(Math.random()*toBeResolved.length);
}

const playOne=()=>{

 if(toBeResolved.length===0){
  log("No hay más preguntas que responder","red");
  rl.prompt();
 }else{
  aleatorio();

  while(toBeResolved[id]==="nada"){
    aleatorio();
  }

  let quiz=model.getByIndex(id);
  toBeResolved.splice(id,1,"nada");

      rl.question(`${colorize(quiz.question,"red")} `, answer=>{
        if(answer.toUpperCase()===quiz.answer.toUpperCase()){
          score+=1;
          numtotalquiz-=1;

         if(numtotalquiz===0){
           log(`CORRECTO - Lleva  ${score} aciertos.\nNo hay nada más que preguntar.\nFin del juego. Aciertos: ${score}`);
           biglog(`${score}`,"magenta");
         }else{
          log(`CORRECTO - Lleva ${score} aciertos.`);
          playOne();
         };
          
        }else{
         log(`INCORRECTO.\nFin del juego. Aciertos: ${score}`);
         biglog(`${score}`,"red");
        }
        rl.prompt();
      });
    };
  }
    playOne();
};

exports.deleteCmd= (rl,id) =>{
  if(typeof id ==="undefined"){
    errorlog("Falta el parametro id")
  }else{
    try{
      model.deleteByIndex(id);
    }catch(error){
      errorlog(error.message);
    }
  }
  rl.prompt();
};

exports.editCmd= (rl,id) =>{
  if(typeof id==="undefined"){
    errorlog("Falta el parametro id");
    rl.prompt();
  }else{
    try{
      const quiz =model.getByIndex(id);
      process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.question)},0);

      rl.question(colorize("Introduzca una pregunta: ","red"),question => {

        process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.answer)},0);

        rl.question(colorize("Introduzca la respuesta ","red"),answer => {
          model.update(id,question,answer);
          log(`Se ha cambiado el quiz ${colorize(id,"magenta")} por: ${question} ${colorize("=>","magenta")} ${answer}`);
          rl.prompt();
        });
      });
    }catch(error){
      errorlog(error.message);
      rl.promt();
    }
  }
};

exports.creditsCmd=rl=>{
  log("Autores de la practica:","green");
  log("ALVARO OLLERO","green");
  rl.prompt();
};

