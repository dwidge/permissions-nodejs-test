import { Sequelize, DataTypes, Model } from "sequelize";

// User model
export class UserModel extends Model {
  static initialize(sequelize: Sequelize) {
    return UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "User",
        timestamps: true,
      }
    );
  }
  static associate(models: any) {
    UserModel.hasMany(models.GroupLink, {
      foreignKey: "userId",
      as: "groupLinks",
    });
  }
}

// Company model
export class CompanyModel extends Model {
  static initialize(sequelize: Sequelize) {
    return CompanyModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Company",
        timestamps: true,
      }
    );
  }
  static associate(models: any) {
    CompanyModel.hasMany(models.GroupLink, {
      foreignKey: "companyId",
      as: "groupLinks",
    });
  }
}

// Group model
export class GroupModel extends Model {
  static initialize(sequelize: Sequelize) {
    return GroupModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Group",
        timestamps: true,
      }
    );
  }
  static associate(models: any) {
    GroupModel.hasMany(models.GroupLink, {
      foreignKey: "groupId",
      as: "groupLinks",
    });
    GroupModel.hasMany(models.Permission, {
      foreignKey: "subject",
      as: "subjectPermissions",
    });
    GroupModel.hasMany(models.Permission, {
      foreignKey: "object",
      as: "objectPermissions",
    });
  }
}

// Permission model
export class PermissionModel extends Model {
  static initialize(sequelize: Sequelize) {
    return PermissionModel.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false,
        },
        subject: {
          type: DataTypes.STRING,
          allowNull: true,
          references: { model: "Groups", key: "id" },
        },
        object: {
          type: DataTypes.STRING,
          allowNull: true,
          references: { model: "Groups", key: "id" },
        },
      },
      {
        sequelize,
        modelName: "Permission",
        timestamps: true,
      }
    );
  }
  static associate(models: any) {
    PermissionModel.belongsTo(models.Group, {
      foreignKey: "subject",
      as: "subjectGroup", // Alias for subject association
    });
    PermissionModel.belongsTo(models.Group, {
      foreignKey: "object",
      as: "objectGroup", // Alias for object association
    });

    // Add associations for subjectLink and objectLink using the correct alias
    PermissionModel.belongsToMany(models.GroupLink, {
      through: "PermissionGroupLink", // Example junction table name
      foreignKey: "permissionId",
      otherKey: "groupLinkId",
      as: "subjectLink", // Alias for subject link
    });
    PermissionModel.belongsToMany(models.GroupLink, {
      through: "PermissionGroupLink",
      foreignKey: "permissionId",
      otherKey: "groupLinkId",
      as: "objectLink", // Alias for object link
    });
  }
}

// GroupLink model
export class GroupLinkModel extends Model {
  static initialize(sequelize: Sequelize) {
    return GroupLinkModel.init(
      {
        groupId: {
          type: DataTypes.UUID,
          references: { model: "Group", key: "id" },
          allowNull: true,
        },
        companyId: {
          type: DataTypes.UUID,
          references: { model: "Company", key: "id" },
          allowNull: true,
        },
        userId: {
          type: DataTypes.UUID,
          references: { model: "User", key: "id" },
          allowNull: true,
        },
        productId: {
          type: DataTypes.UUID,
          references: { model: "Products", key: "id" },
          allowNull: true,
        },
        taskId: {
          type: DataTypes.UUID,
          references: { model: "Tasks", key: "id" },
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "GroupLink",
        timestamps: true,
      }
    );
  }
  static associate(models: any) {
    GroupLinkModel.belongsTo(models.Group, {
      onDelete: "SET NULL",
      foreignKey: "groupId",
      as: "group",
    });
    GroupLinkModel.belongsTo(models.Company, {
      onDelete: "SET NULL",
      foreignKey: "companyId",
      as: "company",
    });
    GroupLinkModel.belongsTo(models.User, {
      onDelete: "SET NULL",
      foreignKey: "userId",
      as: "user",
    });
  }
}

// Product model
export class ProductModel extends Model {
  static initialize(sequelize: Sequelize) {
    return ProductModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.FLOAT,
      },
      {
        sequelize,
        modelName: "Product",
        timestamps: true,
      }
    );
  }
  static associate(models: any) {}
}
