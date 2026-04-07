import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: (() => {
        const providers: NextAuthOptions["providers"] = [
            CredentialsProvider({
                name:"Credentials",
                credentials:{
                    email:{label:"Email", type:"text"},
                    password:{label:"Password", type:"password"},
                },
                async authorize(credentials){
                    if(!credentials?.email||!credentials?.password){
                        throw new Error("Missing email or password")
                    }
                    try {
                        await connectToDatabase()
                        const user = await User.findOne({email:credentials.email})

                        if(!user){
                            throw new Error("NO user found with this")
                        }
                        const isValid = await bcrypt.compare(
                            credentials.password,
                            user.password
                        )
                        if(!isValid){
                            throw new Error("Invalid password")
                        }
                        return {
                            id: user._id.toString(),
                            email: user.email
                        }

                    } catch (error) {
                        console.error("Auth error:", error)
                        throw error
                    }
                }
            }),
        ];

        if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
            providers.push(
                GithubProvider({
                    clientId: process.env.GITHUB_ID,
                    clientSecret: process.env.GITHUB_SECRET,
                })
            );
        }

        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
            providers.push(
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                })
            );
        }

        return providers;
    })(),
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        },
        
    },
    pages:{
            signIn: "/login",
            error:"/login"
        },
        session:{
            strategy: "jwt",
            maxAge: 30*24*60*60,
        },
        secret:process.env.NEXTAUTH_SECRET,
}
