const Sequelize =require("sequelize")
const bcrypt = require("bcrypt")
const zlib = require("zlib")
const sequelize=new Sequelize('seconddb','root','cagan6185',{
    host:"localhost",
    port:"3308",
    dialect:"mysql",
    define:{
     //   freezeTableName:true,       DOES FOR ALL SEQUELİZE INTANCES
    }

})

const User=sequelize.define('user',{
    user_id:{
        type:Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    username:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[4,6]
        },
        get(){ //get method
            const rawValue=this.getDataValue('username');
            return rawValue.toUpperCase();
        }
    },
    password:{
        type:Sequelize.DataTypes.STRING,
        set(value){   //set method
            const salt=bcrypt.genSaltSync(12);
            const hash=bcrypt.hashSync(value,salt)
            this.setDataValue('password',hash);

        }
    },
    age:{
        type:Sequelize.DataTypes.INTEGER,
        defaultValue:17,
        validate:{
            isOldEnough(value){
                if(value<21){


                    throw new Error("Too young")
                }

            },
            isNumeric:{
                msg:"Give a number" // instead of isNumeric true you can customize it if you give arguemts in this kind of thing give it args: values... msg:"No"
            }
        }
    },
    description:{
        type:Sequelize.DataTypes.STRING,
        set(value){  //set method
            const compressed=zlib.deflateSync(value).toString('base64');
            this.setDataValue('description',compressed)
        },
        get(){  //get method
            const value=this.getDataValue('description');
            const uncompressed=zlib.inflateSync(Buffer.from(value,'base64'));
            return uncompressed.toString()
        }
    },
    aboutUser:{
        type:Sequelize.DataTypes.VIRTUAL,
        get(){
            return this.username + ' ' + this.description
        },

    
    },
    email:{
        type:Sequelize.DataTypes.STRING,
        unique:true, //unique constraint
        allowNull:true, //allow null
        validate: {    //validatiors
           // isEmail:true   //Checks if email built in in sequelize
           myemailvalidator(value){
            if(value===null){ //doesnt make null check cause when you give empty field it is undefined not null spesificly nulls are checked here
                throw new Error("Empty field")
            }
           }
        }
    }

},{
    freezeTableName:true,    //ADI AYNI YAPAR  S EKLEMEZ SONUNA 
    timestamps:false,       //UPDATED AT DELETED ATI ONLER
    validate:{    //Model wide validator
        usernamePassMatch(){
            if(this.username===this.password){
                throw new Error("User name and password cant be same")
            }
        }
    },
    paranoid:true,            //Paranoid tables timestamp should be true if you want table to be paranoid
}



);

//               User.drop().then()                //DROPS TABLE


//sequelize.drop({ match:/_test$/}).then()   //DROPS TABLE that ends with test      DOES TAKE REGEX PATERNS

//sequelize.sync().then()       //SYNCS ALL TABLES WITH DATABASE


console.log(sequelize.models.user);

User.sync({alter:true}).then(()=>{          //ALTER AND FORCE ARE THE THINGS       FORCE DROPS AND REDOES      ALTER ALTERS DOESNT DROP X
    console.log("TABLE AND MODEL SYNCHED ");
 //   const user=User.build({username:"cagan",password:"cagan",age:19,})   //DOESNT ADD TO THE TABLE
 //   return user.save();    //DOES ADD TO THE TABLE   ASYNC

  //return User.create({username:"cagan2",password:"cagan2"})      //User.create() directly adds to the table    ASYNC
  //return User.bulkCreate([{username:"cagan2",password:"cagan2},{username:"cagan"}])    //User.bulkcreate is create but takes array   passes valiation unless spesified  
  // return User.bulkCreate([{username:"cagan2",password:"cagan2},{username:"cagan"}],{validate:true})   if you want to validate with bulkCreate
  // return User.findAll()    //GETS ALL USERS
  // return User.findAll({attributes:['username', 'password']})    //GETS ALL USERS USERNAME PASSWORD
  // return User.findAll({attributes::[['username','usr'],['password','psw']]})    //GETS ALL USERS USERNAME PASSWORD USERNAME AS USR   PASSWORD PSW
 // return User.findAll({attributes:[[sequelize.fn('SUM',sequelize.col('age')),'howOld']]})  DOES FUNCTION IN WHERE AS WHAT
 // return User.findAll({attributes:{exclude:['password']}})  GET EVERYDATA EXCLUDING PASSWORD
 // return User.findAll({where:{age:17}}) FILTERS JUST AGE 17
 // return User.findAll({attributes:['username'],where:{age:17}})     //GETS JUST THE USERNAME OF 17S NAME
// return User.findAll({attributes:['username'],where:{age:17,username:'cagan2'}})   //YOU CAN PASS MULTIPLE ATTRIBUTES
// return User.findAll({limit:2})  limits the number of getted results 
// return User.findAll({order:[['age','ASC']]})   //DOES 
// return User.findAll({order:[['age','DESC']]})
 /*return User.findAll({
    attributes:['username',[sequelize.fn('SUM',sequelize.col('age')),'sum_age']],
    group:'username'
 })
*/       //GROPUS THE USER DEPENDING ON THE GIVEN THINGS

/*return User.findAll({
    where:{
        [Sequelize.Op.or]:{username:"cagan",age:17}
    }
})*/        // YOU CAN ADD OR, AND OPERATIONS TO WHERE LIKE THAT4


/*return User.findAll({
    where:{
        age:{
            [Sequelize.Op.gt]:18
        }}})
*/    //GREATER THAN OPERATION


/*
return User.findAll({where:{
    age:{
        [Sequelize.Op.or]:{
            [Sequelize.Op.lt]:45,
            [Sequelize.Op.eq]:null
        }
    }
}})
*/       // A bit more complex with Op 


/*return User.findAll({where:

    sequelize.where(sequelize.fn('char_length',sequelize.col('username')),5)
})
*/           // GETS THE 5 LENGHT USERNAMES


//  return User.update({age:28},{where:{username:cagan}})        UPDATE GIVEN THING 
// return User.destroy({where:{username:cagan}} )       can use truncate true deletes everything except table itself
//return User.max('age')    gives you max age can use where
//return User.sum('age') gives you sum age can use where
//return User.findAll({raw:true})   RETURNS AS JSON
//return User.findByPk(2)    Find by primary key
// return User.findOne()      RETURN FIRST ELEMENT
/*return User.findOne({where:{
    age:13
} }) */  //CAN USE WHERE IN FINDONE

// return User.findOrCreate({where:{username:"cagan3"}})  


/*return User.findOrCreate({where:{username:"cagan5"},defaults:{
    age:70
}})   
 */  //YOU CAN SET DEFAULT VALUES

 /*return User.findAndCountAll({
    where:{
        username:"cagan"
    }
 })*/    //FINDS AND COUNTS ALL ROWS WITH THE LIMITATIONS YOU GIVE


 /*User.create({username:"desc",password:"desc",description:"This is the description"}).then((data)=>{
    console.log(data.toJSON());

 })
*/
User.findOne({where:{
        username:"desc"
}}).then((data)=>{
   console.log( data.aboutUser )
})

  /*const user = User.build({
    email: "css",
    age:19
}
)
return user.validate().then((data)=>{console.log(data);})
*/

// return User.findOne({paranoid:false})  return alldata including soft deleted ones

}).then((data)=>{
    

   // data.username='pizza';            YOU CAN SET DATA AFTER THEY HAVE ADDED TO THE TABLE

   // data.decrement({age:2})                 SUBTRACT TO THE GIVEN INTEGER TO GIVEN VALUE YOU CAN PASS MULTIPLE VALUES LIKE ({age:2,height:3})


   // data.increment({age:2})                 ADD TO THE GIVEN INTEGER TO GIVEN VALUE YOU CAN PASS MULTIPLE VALUES LIKE ({age:2,height:3})


   // console.log("User added "+data);


 /* data.forEach(element => {
        console.log(element.toJSON());
   });

*/
  // console.log(data.toJSON());

   // return data.save()              YOU CAN ADD IT AFTER YOU HAVE MADE CHANGES TO THE TABLE         ASYNC

   // return data.destroy()           YOU CAN DELETE THE USER IF NEEDED              ASYNC               THEN CHANGE DATA AFTER IF NEEDED           ASYNC 


   // return data.save({fields:['age']})              YOU CAN JUST SEND THE CHANGED TABLE TO DATABASE TO BE SAVED         ASYNC 

   /*const [givendata,results] = data
   console.log(results);*/    // GIVES THE IF USER CREATED OR NOT IN THE FIND OR CREATE METHOD


   /*const{ count,rows}=data
   console.log(count);
   console.log(rows);*/        // RETURNED VALUE FROM FINDANDCOUNTALL COUNT IS NUMBER OF FIND ROWS AND ROWS IS THE FIND ROWS



   // Assosiations are really good explained here : https://sequelize.org/docs/v6/core-concepts/assocs/


   //hasOne() belongsTo() hasMany() belongsToMany()  methodları kullanılır sonrasında optionstan ONDELETE ONUPDATE AYARLANABILIR
   //If you are stuck go back and look at that : https://www.youtube.com/watch?v=HJGWu0cZUe8&list=PLkqiWyX-_Lov8qmMOVn4SEQwr9yOjNn3f&index=11
}).catch((err)=>{
    console.log("ERROR"+ err);
})