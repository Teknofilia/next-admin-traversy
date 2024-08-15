import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";



export async function POST(req: Request) {
    const { email, password } = await req.json(); 

    try {
        const findUser = await prisma.user.findFirst({
            where:{
                email,
            }
        })

        // check if there is match user email
        if(!findUser?.password) {
            return Response.json({ message: "Invalid Credentials"}, { status: 401 })
        }

        // creating login session Id
        const validPassword = await verify(findUser.password, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        if (!validPassword) {
            return {
                error: "Incorrect username or password"
            };
        }
        
        const session = await lucia.createSession(findUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        return Response.json({session, sessionCookie})
        //cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        // if(findUser.password === password) {
        //     const session = await lucia.createSession(findUser.id, {});
        //     const sessionCookie = lucia.createSessionCookie(session.id);
        //     cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        //     return redirect("/");
        //     return Response.json({session, sessionCookie})
        
        } catch (error) {
        console.log(error)
        return Response.json({ message: "An error occurred"}, { status: 500 })
    }
}