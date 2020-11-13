
import DB from '../providers/DB';
import { Model, DataTypes } from 'sequelize';


export interface AgentListingAttributes {
    agentId: number;
    listingId: number;
}

export interface AgentListingCreationAttributes extends AgentListingAttributes {}


class AgentListing extends Model<AgentListingAttributes, AgentListingCreationAttributes> implements AgentListingAttributes {
    public agentId!: number;
    public listingId!: number;
}

AgentListing.init(
    {
        agentId: {
            type: DataTypes.BIGINT(),
            allowNull: false
        },
        listingId: {
            type: DataTypes.BIGINT(),
            allowNull: false
        },
    },
    {
        tableName: "agentListings",
        sequelize: DB,
        indexes: [
            { fields: ['agentId'] },
            { fields: ['listingId'] },
        ]
    }
);


export default AgentListing;
