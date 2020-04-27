export interface ApplicationRole {
    Id: string;
    Name: string;
    NormalizedName: string;
    ConcurrencyStamp: string;
    Description: string;
    Discriminator: string;
}

export class RoleType_TypeDef {
  public static readonly Admin: string = 'Admin';
  public static readonly Employee: string = 'Employee';
  public static readonly Unregistered: string = 'Unregistered';
}

export let RoleList: string[] = [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee, RoleType_TypeDef.Unregistered];
