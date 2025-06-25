const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const bcrypt =require('bcryptjs');

const User = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'Name is required'
            },
            len:{
                args:[2,50],
                msg:'Name must be between 2 and 50 characters'
            }
        }
    },
    email:{
       type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email'
      }
    }
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters long'
      }
    }
  }
  
},{
    tableName:'users',
    timestamps:true,
    createdAt:'created_at',
    updatedAt:false,
    hooks:{
        beforeCreate: async(user)=>{
            if(user.password){
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password,salt);
            }
        }
    }
  }
);

// instance method to check password
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};
module.exports = User;