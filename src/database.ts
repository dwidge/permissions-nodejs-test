import { Sequelize } from "sequelize";
import {
  UserModel,
  CompanyModel,
  GroupModel,
  GroupLinkModel,
  PermissionModel,
  ProductModel,
} from "./models.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  logging: false,
});

// Initialize models
const User = UserModel.initialize(sequelize);
const Company = CompanyModel.initialize(sequelize);
const Group = GroupModel.initialize(sequelize);
const GroupLink = GroupLinkModel.initialize(sequelize);
const Permission = PermissionModel.initialize(sequelize);
const Product = ProductModel.initialize(sequelize);

const models = { User, Company, Group, GroupLink, Permission, Product };

// Call associate functions
UserModel.associate(models);
CompanyModel.associate(models);
GroupModel.associate(models);
PermissionModel.associate(models);
GroupLinkModel.associate(models);
ProductModel.associate(models);

export default sequelize;
