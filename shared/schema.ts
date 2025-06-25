import { pgTable, text, serial, integer, real, timestamp, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kpiReports = pgTable("kpi_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reportDate: date("report_date").notNull(),
  printsCompleted: integer("prints_completed").notNull(),
  jobsCompleted: integer("jobs_completed").notNull(),
  misprints: integer("misprints").notNull(),
  screensUsed: integer("screens_used").notNull(),
  hoursWorked: real("hours_worked").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  kpiReports: many(kpiReports),
}));

export const kpiReportsRelations = relations(kpiReports, ({ one }) => ({
  user: one(users, {
    fields: [kpiReports.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  role: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertKpiReportSchema = createInsertSchema(kpiReports).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  printsCompleted: z.number().min(0).max(10000),
  jobsCompleted: z.number().min(0).max(1000),
  misprints: z.number().min(0).max(1000),
  screensUsed: z.number().min(0).max(1000),
  hoursWorked: z.number().min(0).max(24),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type KpiReport = typeof kpiReports.$inferSelect;
export type InsertKpiReport = z.infer<typeof insertKpiReportSchema>;

// Extended types for API responses with calculated metrics
export type KpiReportWithCalculated = KpiReport & {
  userName?: string;
  printsPerHour: number;
  jobsPerHour: number;
  defectRate: number;
  screensPerJob: number;
  orderAccuracy: number;
};

export type DashboardStats = {
  today: number;
  yesterday: number;
  change: number;
  average7Day: number;
};

export type DashboardData = {
  printsCompleted: DashboardStats;
  jobsCompleted: DashboardStats;
  misprints: DashboardStats;
  orderAccuracy: DashboardStats;
  screensUsed: DashboardStats;
  hoursWorked: DashboardStats;
  calculatedMetrics: {
    printsPerHour: number;
    jobsPerHour: number;
    defectRate: number;
    screensPerJob: number;
  };
};
