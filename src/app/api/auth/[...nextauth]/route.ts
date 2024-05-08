import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.id = user.id
      }
      return token;
    },
    async session({ session, token}) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id
      return session
    }
  }
});

export { handler as GET, handler as POST };
