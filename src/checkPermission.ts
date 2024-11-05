import { PermissionModel, GroupLinkModel } from "./models.js";
import { GroupEntity } from "./types.js";

// Helper function to check if a subject has a permission for a object
// If subject is null, we are asking if anything has a permission to do something on object
// If object is null, we are asking if subject has a permission to do something on anything
// If both are null, we are asking if anything has a permission to do something on anything

// Resolve the group ids the subject is part of
// Resolve the group ids the object is part of
// Find the permissions by name
// Check if there is a link between subject and object by the permission name

export async function checkPermission(
  permissionName: string,
  subject: Partial<GroupEntity> | null = null,
  object: Partial<GroupEntity> | null = null
): Promise<boolean> {
  // Resolve the group ids for the subject and object
  const subjectWhereClause = constructWhereClause(subject);
  const objectWhereClause = constructWhereClause(object);

  // Use the correct aliases in the include array
  const permission = await PermissionModel.findOne({
    where: {
      name: permissionName,
    },
    include: [
      {
        model: GroupLinkModel,
        as: "subjectLink", // Use the subjectLink alias
        where: subjectWhereClause,
        required: !!subject, // Include if subject exists
      },
      {
        model: GroupLinkModel,
        as: "objectLink", // Use the objectLink alias
        where: objectWhereClause,
        required: !!object, // Include if object exists
      },
    ],
  });

  return !!permission;
}

// Helper to construct the WHERE clause for the group link resolution
export function constructWhereClause(entity: Partial<GroupEntity> | null) {
  return {
    companyId: entity?.companyId || null,
    userId: entity?.userId || null,
    productId: entity?.productId || null,
    taskId: entity?.taskId || null,
  };
}
