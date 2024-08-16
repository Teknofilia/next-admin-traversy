import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { generateIdFromEntropySize } from 'lucia'
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { fullname, email, password } = await req.json();

    try {
        if (!fullname || !email || !password) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return Response.json({ error: 'User already exists' }, { status: 409 });
        }

        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const userId = generateIdFromEntropySize(10); // 16 characters long

        const createUser = await prisma.user.create({
            data:{
                id: userId, 
                fullname, 
                email, 
                password: passwordHash
            }
        })

        // Create session
        const session = await lucia.createSession(userId, {});
	    const sessionCookie = lucia.createSessionCookie(session.id);

	    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return Response.json({ success: true }, { status: 201 });    
    } catch (error) {
        console.error('Registration error:', error);
        return Response.json({ error: 'Registration failed' }, { status: 500 });
    }
}