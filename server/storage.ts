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
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string, subscriptionStatus: string, subscriptionPlan: string): Promise<User>;
  updateUserSubscriptionStatus(userId: number, subscriptionStatus: string): Promise<User>;
  
  // Team management
  createTeam(ownerId: number, name: string, description?: string): Promise<Team>;
  getTeamByUserId(userId: number): Promise<{ team: Team; members: User[] } | null>;
  getTeamMembers(teamId: number): Promise<User[]>;
  addUserToTeam(userId: number, teamId: number): Promise<User>;
  removeUserFromTeam(userId: number): Promise<User>;
  createTeamInvite(teamId: number, email: string, name: string, invitedBy: number): Promise<{ inviteToken: string }>;
  
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

  async updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string, subscriptionStatus: string, subscriptionPlan: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus,
        subscriptionPlan,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscriptionStatus(userId: number, subscriptionStatus: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Team management methods
  async createTeam(ownerId: number, name: string, description?: string): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values({ ownerId, name, description })
      .returning();
    
    // Add owner to the team
    await db
      .update(users)
      .set({ teamId: team.id })
      .where(eq(users.id, ownerId));
    
    return team;
  }

  async getTeamByUserId(userId: number): Promise<{ team: Team; members: User[] } | null> {
    const user = await this.getUser(userId);
    if (!user?.teamId) return null;

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, user.teamId),
    });

    if (!team) return null;

    const members = await db.query.users.findMany({
      where: eq(users.teamId, team.id),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        inviteStatus: true,
        createdAt: true,
      },
    });

    return { team, members };
  }

  async getTeamMembers(teamId: number): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(users.teamId, teamId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        inviteStatus: true,
        createdAt: true,
      },
    });
  }

  async addUserToTeam(userId: number, teamId: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ teamId, inviteStatus: 'accepted' })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async removeUserFromTeam(userId: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ teamId: null, inviteStatus: null })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createTeamInvite(teamId: number, email: string, name: string, invitedBy: number): Promise<{ inviteToken: string }> {
    const inviteToken = randomBytes(32).toString('hex');
    
    // Check if user already exists
    let existingUser = await this.getUserByEmail(email);
    
    if (existingUser) {
      // Update existing user with team info
      await db
        .update(users)
        .set({
          teamId,
          invitedBy,
          inviteToken,
          inviteStatus: 'pending'
        })
        .where(eq(users.id, existingUser.id));
    } else {
      // Create placeholder user for invite
      await db.insert(users).values({
        email,
        name,
        username: email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 9),
        password: '', // Will be set when they accept invite
        teamId,
        invitedBy,
        inviteToken,
        inviteStatus: 'pending'
      });
    }
    
    return { inviteToken };
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
        printsPerHour: kpiData.timeOnJob > 0 ? kpiData.printsCompleted / kpiData.timeOnJob : 0,
        defectRate: kpiData.printsCompleted > 0 ? (kpiData.misprints / kpiData.printsCompleted) * 100 : 0,
        screensPerJob: kpiData.printsCompleted > 0 ? kpiData.screensUsed / kpiData.printsCompleted : 0,
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
        misprints: sql<number>`COALESCE(SUM(${kpiReports.misprints}), 0)`,
        screensUsed: sql<number>`COALESCE(SUM(${kpiReports.screensUsed}), 0)`,
        timeOnJob: sql<number>`COALESCE(SUM(${kpiReports.timeOnJob}), 0)`,
      })
      .from(kpiReports)
      .where(todayConditions.length > 0 ? and(...todayConditions) : undefined);

    // Get yesterday's data
    const yesterdayConditions = [...conditions, eq(kpiReports.reportDate, yesterday)];
    const yesterdayData = await db
      .select({
        printsCompleted: sql<number>`COALESCE(SUM(${kpiReports.printsCompleted}), 0)`,
        misprints: sql<number>`COALESCE(SUM(${kpiReports.misprints}), 0)`,
        screensUsed: sql<number>`COALESCE(SUM(${kpiReports.screensUsed}), 0)`,
        timeOnJob: sql<number>`COALESCE(SUM(${kpiReports.timeOnJob}), 0)`,
      })
      .from(kpiReports)
      .where(yesterdayConditions.length > 0 ? and(...yesterdayConditions) : undefined);

    // Get 7-day average
    const weekConditions = [...conditions, gte(kpiReports.reportDate, sevenDaysAgo)];
    const weekData = await db
      .select({
        printsCompleted: sql<number>`COALESCE(AVG(${kpiReports.printsCompleted}), 0)`,
        misprints: sql<number>`COALESCE(AVG(${kpiReports.misprints}), 0)`,
        screensUsed: sql<number>`COALESCE(AVG(${kpiReports.screensUsed}), 0)`,
        timeOnJob: sql<number>`COALESCE(AVG(${kpiReports.timeOnJob}), 0)`,
      })
      .from(kpiReports)
      .where(weekConditions.length > 0 ? and(...weekConditions) : undefined);

    const todayStats = todayData[0] || { printsCompleted: 0, misprints: 0, screensUsed: 0, timeOnJob: 0 };
    const yesterdayStats = yesterdayData[0] || { printsCompleted: 0, misprints: 0, screensUsed: 0, timeOnJob: 0 };
    const weekStats = weekData[0] || { printsCompleted: 0, misprints: 0, screensUsed: 0, timeOnJob: 0 };

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
      misprints: createStats(todayStats.misprints, yesterdayStats.misprints, weekStats.misprints),
      orderAccuracy: createStats(todayOrderAccuracy, yesterdayOrderAccuracy, weekOrderAccuracy),
      screensUsed: createStats(todayStats.screensUsed, yesterdayStats.screensUsed, weekStats.screensUsed),
      timeOnJob: createStats(todayStats.timeOnJob, yesterdayStats.timeOnJob, weekStats.timeOnJob),
      calculatedMetrics: {
        printsPerHour: todayStats.timeOnJob > 0 ? todayStats.printsCompleted / todayStats.timeOnJob : 0,
        defectRate: todayStats.printsCompleted > 0 ? (todayStats.misprints / todayStats.printsCompleted) * 100 : 0,
        screensPerJob: todayStats.printsCompleted > 0 ? todayStats.screensUsed / todayStats.printsCompleted : 0,
      },
    };
  }
}

export const storage = new DatabaseStorage();
