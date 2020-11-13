
import DB from '../providers/DB';
import { Model, DataTypes, Optional } from 'sequelize';


export interface ListingAttributes {
    id: number;
    address: string;
}

export interface ListingCreationAttributes extends Optional<ListingAttributes, "id"> {}


class Listing extends Model<ListingAttributes, ListingCreationAttributes> implements ListingAttributes {
    public id!: number;
    public address!: string;
}

Listing.init(
    {
        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },
        address: {
            type: new DataTypes.TEXT(),
            allowNull: false
        }
    },
    {
        tableName: "listings",
        sequelize: DB
    }
);


export default Listing;
