import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { generateId } from 'lucia'
import { hash } from "@node-rs/argon2";


export async function POST(req: Request) {
    const { fullname, email, password } = await req.json();

    try {
        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const createUser = await prisma.user.create({
            data:{
                id: generateId(16), 
                fullname, 
                email, 
                password: passwordHash
            }
        })

        return Response.json({ data: createUser }, { status: 201 });
    } catch (error) {
        return Response.json({ error: 'Registration failed' }, { status: 500 });
    }
}