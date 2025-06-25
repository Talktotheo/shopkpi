import { users, kpiReports, type User, type InsertUser, type KpiReport, type InsertKpiReport, type KpiReportWithCalculated, type DashboardData, type DashboardStats } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  createKpiReport(userId: number, report: InsertKpiReport): Promise<KpiReport>;
  getKpiReports(userId?: number, fromDate?: string, toDate?: string): Promise<KpiReportWithCalculated[]>;
  getKpiReportByUserAndDate(userId: number, reportDate: string): Promise<KpiReport | undefined>;
  getDashboardData(userId?: number, dateRange?: { from: string; to: string }): Promise<DashboardData>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'user')).orderBy(asc(users.name));
  }

  async createKpiReport(userId: number, report: InsertKpiReport): Promise<KpiReport> {
    const [kpiReport] = await db
      .insert(kpiReports)
      .values({
        ...report,
        userId,
        reportDate: report.reportDate,
      })
      .returning();
    return kpiReport;
  }

  async getKpiReportByUserAndDate(userId: number, reportDate: string): Promise<KpiReport | undefined> {
    const [report] = await db
      .select()
      .from(kpiReports)
      .where(and(eq(kpiReports.userId, userId), eq(kpiReports.reportDate, reportDate)));
    return report || undefined;
  }

  async getKpiReports(userId?: number, fromDate?: string, toDate?: string): Promise<KpiReportWithCalculated[]> {
    const conditions = [];
    
    if (userId) {
      conditions.push(eq(kpiReports.userId, userId));
    }
    if (fromDate) {
      conditions.push(gte(kpiReports.reportDate, fromDate));
    }
    if (toDate) {
      conditions.push(lte(kpiReports.reportDate, toDate));
    }

    const reports = await db
      .select()
      .from(kpiReports)
      .leftJoin(users, eq(kpiReports.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(kpiReports.reportDate), desc(kpiReports.createdAt));

    return reports.map((report) => {
      const kpiData = report.kpi_reports;
      const userData = report.users;
      
      return {
        ...kpiData,
        userName: userData?.name || '',
        printsPerHour: kpiData.hoursWorked > 0 ? kpiData.printsCompleted / kpiData.hoursWorked : 0,
        jobsPerHour: kpiData.hoursWorked > 0 ? kpiData.jobsCompleted / kpiData.hoursWorked : 0,
        defectRate: kpiData.printsCompleted > 0 ? (kpiData.misprints / kpiData.printsCompleted) * 100 : 0,
        screensPerJob: kpiData.jobsCompleted > 0 ? kpiData.screensUsed / kpiData.jobsCompleted : 0,
        orderAccuracy: kpiData.printsCompleted > 0 ? ((kpiData.printsCompleted - kpiData.misprints) / kpiData.printsCompleted) * 100 : 0,
      };
    });
  }

  async getDashboardData(userId?: number, dateRange?: { from: string; to: string }): Promise<DashboardData> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const conditions = [];
    if (userId) {
      conditions.push(eq(kpiReports.userId, userId));
    }

    // Get today's data
    const todayConditions = [...conditions, eq(kpiReports.reportDate, today)];
    const todayData = await db
      .select({
        printsCompleted: sql<number>`COALESCE(SUM(${kpiReports.printsCompleted}), 0)`,
        jobsCompleted: sql<number>`COALESCE(SUM(${kpiReports.jobsCompleted}), 0)`,
        misprints: sql<number>`COALESCE(SUM(${kpiReports.misprints}), 0)`,
        screensUsed: sql<number>`COALESCE(SUM(${kpiReports.screensUsed}), 0)`,
        hoursWorked: sql<number>`COALESCE(SUM(${kpiReports.hoursWorked}), 0)`,
      })
      .from(kpiReports)
      .where(todayConditions.length > 0 ? and(...todayConditions) : undefined);

    // Get yesterday's data
    const yesterdayConditions = [...conditions, eq(kpiReports.reportDate, yesterday)];
    const yesterdayData = await db
      .select({
        printsCompleted: sql<number>`COALESCE(SUM(${kpiReports.printsCompleted}), 0)`,
        jobsCompleted: sql<number>`COALESCE(SUM(${kpiReports.jobsCompleted}), 0)`,
        misprints: sql<number>`COALESCE(SUM(${kpiReports.misprints}), 0)`,
        screensUsed: sql<number>`COALESCE(SUM(${kpiReports.screensUsed}), 0)`,
        hoursWorked: sql<number>`COALESCE(SUM(${kpiReports.hoursWorked}), 0)`,
      })
      .from(kpiReports)
      .where(yesterdayConditions.length > 0 ? and(...yesterdayConditions) : undefined);

    // Get 7-day average
    const weekConditions = [...conditions, gte(kpiReports.reportDate, sevenDaysAgo)];
    const weekData = await db
      .select({
        printsCompleted: sql<number>`COALESCE(AVG(${kpiReports.printsCompleted}), 0)`,
        jobsCompleted: sql<number>`COALESCE(AVG(${kpiReports.jobsCompleted}), 0)`,
        misprints: sql<number>`COALESCE(AVG(${kpiReports.misprints}), 0)`,
        screensUsed: sql<number>`COALESCE(AVG(${kpiReports.screensUsed}), 0)`,
        hoursWorked: sql<number>`COALESCE(AVG(${kpiReports.hoursWorked}), 0)`,
      })
      .from(kpiReports)
      .where(weekConditions.length > 0 ? and(...weekConditions) : undefined);

    const todayStats = todayData[0] || { printsCompleted: 0, jobsCompleted: 0, misprints: 0, screensUsed: 0, hoursWorked: 0 };
    const yesterdayStats = yesterdayData[0] || { printsCompleted: 0, jobsCompleted: 0, misprints: 0, screensUsed: 0, hoursWorked: 0 };
    const weekStats = weekData[0] || { printsCompleted: 0, jobsCompleted: 0, misprints: 0, screensUsed: 0, hoursWorked: 0 };

    const calculateChange = (today: number, yesterday: number): number => {
      if (yesterday === 0) return today > 0 ? 100 : 0;
      return ((today - yesterday) / yesterday) * 100;
    };

    const createStats = (
      today: number,
      yesterday: number,
      average: number
    ): DashboardStats => ({
      today,
      yesterday,
      change: calculateChange(today, yesterday),
      average7Day: average,
    });

    // Calculate order accuracy for each period
    const todayOrderAccuracy = todayStats.printsCompleted > 0 ? ((todayStats.printsCompleted - todayStats.misprints) / todayStats.printsCompleted) * 100 : 0;
    const yesterdayOrderAccuracy = yesterdayStats.printsCompleted > 0 ? ((yesterdayStats.printsCompleted - yesterdayStats.misprints) / yesterdayStats.printsCompleted) * 100 : 0;
    const weekOrderAccuracy = weekStats.printsCompleted > 0 ? ((weekStats.printsCompleted - weekStats.misprints) / weekStats.printsCompleted) * 100 : 0;

    return {
      printsCompleted: createStats(todayStats.printsCompleted, yesterdayStats.printsCompleted, weekStats.printsCompleted),
      jobsCompleted: createStats(todayStats.jobsCompleted, yesterdayStats.jobsCompleted, weekStats.jobsCompleted),
      misprints: createStats(todayStats.misprints, yesterdayStats.misprints, weekStats.misprints),
      orderAccuracy: createStats(todayOrderAccuracy, yesterdayOrderAccuracy, weekOrderAccuracy),
      screensUsed: createStats(todayStats.screensUsed, yesterdayStats.screensUsed, weekStats.screensUsed),
      hoursWorked: createStats(todayStats.hoursWorked, yesterdayStats.hoursWorked, weekStats.hoursWorked),
      calculatedMetrics: {
        printsPerHour: todayStats.hoursWorked > 0 ? todayStats.printsCompleted / todayStats.hoursWorked : 0,
        jobsPerHour: todayStats.hoursWorked > 0 ? todayStats.jobsCompleted / todayStats.hoursWorked : 0,
        defectRate: todayStats.printsCompleted > 0 ? (todayStats.misprints / todayStats.printsCompleted) * 100 : 0,
        screensPerJob: todayStats.jobsCompleted > 0 ? todayStats.screensUsed / todayStats.jobsCompleted : 0,
      },
    };
  }
}

export const storage = new DatabaseStorage();
