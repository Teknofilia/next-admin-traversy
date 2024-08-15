import { prisma } from "@/lib/prisma"
import { Lucia } from 'lucia'
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"

const prismaAdapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(prismaAdapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
})