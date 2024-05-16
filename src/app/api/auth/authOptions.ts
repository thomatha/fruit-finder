import { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { sql } from '@vercel/postgres';

export const authOptions: AuthOptions = {
    providers: [
      Auth0Provider({
        clientId: process.env.AUTH0_CLIENT_ID as string,
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
        issuer: process.env.AUTH0_ISSUER,
      }),
    ],
    callbacks: {
      async jwt({ token, user, session }) {
        // Persist the OAuth access_token and or the user id to the token right after signin
        if (user) {
          token.id = user.id
        }
  
        return token
      }
      ,
      async session({ session, token }) {
        // Send properties to the client, like an access_token and user id from a provider.
        session.user.id = token.id;
        let image = session.user.image ? session.user.image : null;
        try {
          const date = new Date();
          await sql`
              INSERT INTO Users (id, name, email, image, created) 
              VALUES (${session.user.id}, ${session.user.name}, ${session.user.email}, ${image}, ${date.toJSON()}) 
              ON CONFLICT (id) 
              DO UPDATE 
              SET name = ${session.user.name}, email = ${session.user.email}, image = ${image};
              `;
        } catch (e) {
          console.error(e);
        }
        return session;
      }
    }
  };