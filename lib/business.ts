export const moduleMeta = {
  customers: { label: "客户管理", singular: "客户", icon: "UsersRound", description: "维护客户联系信息与跟进状态" },
  products: { label: "商品管理", singular: "商品", icon: "Package", description: "管理商品、库存与销售价格" },
  orders: { label: "订单管理", singular: "订单", icon: "ShoppingCart", description: "查看订单金额、客户与履约状态" },
  employees: { label: "员工管理", singular: "员工", icon: "BriefcaseBusiness", description: "维护团队成员与组织信息" },
  projects: { label: "项目进度", singular: "项目", icon: "ChartNoAxesCombined", description: "追踪项目负责人、进度与截止日期" },
} as const;

export type BusinessModule = keyof typeof moduleMeta;
export const businessModules = Object.keys(moduleMeta) as BusinessModule[];

export function isBusinessModule(value: string): value is BusinessModule {
  return businessModules.includes(value as BusinessModule);
}
