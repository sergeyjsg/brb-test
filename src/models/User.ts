
import DB from '../providers/DB';
import { Model, DataTypes, Optional } from 'sequelize';


export interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}


class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public role!: string;
}

User.init(
    {
        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: new DataTypes.TEXT(),
            allowNull: false
        },
        lastName: {
            type: new DataTypes.TEXT(),
            allowNull: false
        },
        email: {
            type: new DataTypes.TEXT(),
            allowNull: false
        },
        role: {
            type: new DataTypes.TEXT(),
            allowNull: false
        }
    },
    {
        tableName: "users",
        sequelize: DB
    }
);


export default User;
